"""
TensorFlow-based deepfake detectors
Loads .h5 and .keras models from the centralized model folder
"""
import numpy as np
import cv2
from typing import Dict, List, Tuple, Optional
from pathlib import Path
import logging

try:
    import tensorflow as tf
    from tensorflow import keras
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    logging.warning("TensorFlow not available. TensorFlow models will not load.")

from .base_detector import BaseDeepfakeDetector
from .model_config import get_model_path, get_model_config

logger = logging.getLogger(__name__)


class TensorFlowDetector(BaseDeepfakeDetector):
    """Base class for TensorFlow-based detectors"""
    
    def __init__(self, model_name: str):
        """
        Initialize TensorFlow detector
        
        Args:
            model_name: Name of the model from model_config.py
        """
        if not TF_AVAILABLE:
            raise ImportError("TensorFlow is not installed. Install with: pip install tensorflow>=2.13.0")
        
        self.model_name = model_name
        self.config = get_model_config(model_name)
        self.model_path = get_model_path(model_name)
        self.input_size = self.config["input_size"]
        self.architecture = self.config.get("architecture", "Unknown")
        
        self.model = None
        self.load_model()
        
        logger.info(f"Initialized {self.architecture} detector: {model_name}")
    
    def load_model(self):
        """Load TensorFlow model from file"""
        try:
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found: {self.model_path}")
            
            logger.info(f"Loading {self.architecture} model from: {self.model_path}")
            
            # Custom objects for EfficientNet-B4 compatibility fix
            custom_objects = None
            if self.model_name == "efficientnet_b4":
                # Fix for 'groups' parameter compatibility issue
                from tensorflow.keras.layers import DepthwiseConv2D
                
                class FixedDepthwiseConv2D(DepthwiseConv2D):
                    def __init__(self, *args, **kwargs):
                        # Remove 'groups' parameter if present
                        kwargs.pop('groups', None)
                        super().__init__(*args, **kwargs)
                
                custom_objects = {'DepthwiseConv2D': FixedDepthwiseConv2D}
                logger.info("Using custom_objects for EfficientNet-B4 compatibility")
            
            # Load based on file extension
            if str(self.model_path).endswith('.h5'):
                self.model = keras.models.load_model(str(self.model_path), compile=False, custom_objects=custom_objects)
            elif str(self.model_path).endswith('.keras'):
                self.model = keras.models.load_model(str(self.model_path), compile=False, custom_objects=custom_objects)
            else:
                raise ValueError(f"Unsupported model format: {self.model_path}")
            
            logger.info(f"Successfully loaded {self.architecture} model")
            logger.info(f"Model input shape: {self.model.input_shape}")
            logger.info(f"Model output shape: {self.model.output_shape}")
            
        except Exception as e:
            logger.error(f"Failed to load {self.architecture} model: {str(e)}")
            raise
    
    def preprocess_frames(self, frames: List[np.ndarray]) -> np.ndarray:
        """
        Preprocess frames for TensorFlow model input
        
        Args:
            frames: List of video frames (BGR format from OpenCV)
            
        Returns:
            Preprocessed frames as numpy array
        """
        processed = []
        
        for frame in frames:
            # Resize to model's input size
            resized = cv2.resize(frame, self.input_size)
            
            # Convert BGR to RGB
            rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            
            # Normalize to [0, 1]
            normalized = rgb.astype(np.float32) / 255.0
            
            processed.append(normalized)
        
        return np.array(processed)
    
    def predict(self, frames: List[np.ndarray], audio_path: Optional[str] = None) -> Dict:
        """
        Predict deepfake probability for frames
        
        Args:
            frames: List of video frames
            audio_path: Path to audio file (not used for visual-only models)
            
        Returns:
            Dictionary with prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        # Preprocess frames
        processed_frames = self.preprocess_frames(frames)
        
        # Get predictions for each frame
        frame_predictions = []
        for frame in processed_frames:
            # Add batch dimension
            frame_batch = np.expand_dims(frame, axis=0)
            
            # Predict
            prediction = self.model.predict(frame_batch, verbose=0)
            
            # Get probability (assuming single output node with sigmoid)
            if prediction.shape[-1] == 1:
                prob = float(prediction[0][0])
            else:
                # If multiple outputs, take the fake class probability
                prob = float(prediction[0][1]) if prediction.shape[-1] == 2 else float(np.max(prediction[0]))
            
            frame_predictions.append(prob)
        
        # Calculate statistics
        avg_prediction = np.mean(frame_predictions)
        std_prediction = np.std(frame_predictions)
        max_prediction = np.max(frame_predictions)
        min_prediction = np.min(frame_predictions)
        
        # Calculate manipulation percentage
        manipulation_pct = self.calculate_manipulation_percentage(avg_prediction)
        
        # Determine confidence based on consistency
        confidence = self._calculate_confidence(frame_predictions)
        
        return {
            "model_name": self.model_name,
            "architecture": self.architecture,
            "manipulation_percentage": manipulation_pct,
            "raw_score": float(avg_prediction),
            "confidence": confidence,
            "frame_scores": frame_predictions,
            "statistics": {
                "mean": float(avg_prediction),
                "std": float(std_prediction),
                "max": float(max_prediction),
                "min": float(min_prediction),
                "num_frames": len(frame_predictions)
            },
            "focus_areas": self.config.get("focus_areas", []),
            "description": self.config.get("description", "")
        }
    
    def _calculate_confidence(self, predictions: List[float]) -> float:
        """
        Calculate confidence based on prediction consistency
        
        Args:
            predictions: List of frame-wise predictions
            
        Returns:
            Confidence score (0-100)
        """
        # Low standard deviation = high confidence
        std = np.std(predictions)
        mean = np.mean(predictions)
        
        # Confidence is higher when:
        # 1. Predictions are consistent (low std)
        # 2. Predictions are decisive (far from 0.5)
        consistency_score = 100 * (1 - min(std * 2, 1))  # std normalized
        decisiveness_score = 100 * abs(mean - 0.5) * 2  # distance from 0.5
        
        # Weighted combination
        confidence = 0.6 * consistency_score + 0.4 * decisiveness_score
        
        return round(confidence, 2)
    
    def calculate_manipulation_percentage(self, raw_score: float) -> float:
        """
        Convert raw model output to manipulation percentage
        
        Args:
            raw_score: Raw prediction score (typically 0-1)
            
        Returns:
            Manipulation percentage (0-100)
        """
        # Direct conversion from probability to percentage
        return round(raw_score * 100, 2)


class EfficientNetB4Detector(TensorFlowDetector):
    """EfficientNet-B4 based deepfake detector"""
    
    def __init__(self):
        super().__init__("efficientnet_b4")
    
    def generate_heatmap(self, frame: np.ndarray) -> np.ndarray:
        """
        Generate attention heatmap for EfficientNet
        
        Args:
            frame: Input frame
            
        Returns:
            Heatmap as numpy array
        """
        # Preprocess single frame
        processed = self.preprocess_frames([frame])[0]
        frame_batch = np.expand_dims(processed, axis=0)
        
        # Get the last convolutional layer
        last_conv_layer = None
        for layer in reversed(self.model.layers):
            if isinstance(layer, keras.layers.Conv2D):
                last_conv_layer = layer
                break
        
        if last_conv_layer is None:
            logger.warning("No convolutional layer found for heatmap generation")
            return np.zeros((frame.shape[0], frame.shape[1]))
        
        # Create a model that outputs the last conv layer
        grad_model = keras.models.Model(
            inputs=self.model.input,
            outputs=[last_conv_layer.output, self.model.output]
        )
        
        # Get gradients
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(frame_batch)
            loss = predictions[:, 0]
        
        grads = tape.gradient(loss, conv_outputs)
        
        # Pool the gradients
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight the channels by the gradients
        conv_outputs = conv_outputs[0]
        for i in range(len(pooled_grads)):
            conv_outputs[:, :, i] *= pooled_grads[i]
        
        # Create heatmap
        heatmap = tf.reduce_mean(conv_outputs, axis=-1)
        heatmap = np.maximum(heatmap, 0)
        heatmap /= np.max(heatmap) if np.max(heatmap) != 0 else 1
        
        # Resize to match input
        heatmap_resized = cv2.resize(heatmap.numpy(), (frame.shape[1], frame.shape[0]))
        
        return heatmap_resized


class ResNet50Detector(TensorFlowDetector):
    """ResNet-50 based deepfake detector"""
    
    def __init__(self, variant: int = 1):
        """
        Initialize ResNet detector
        
        Args:
            variant: ResNet variant (1 or 2)
        """
        model_name = f"resnet50_v{variant}"
        super().__init__(model_name)
        self.variant = variant


class VGG16Detector(TensorFlowDetector):
    """VGG-16 based deepfake detector"""
    
    def __init__(self, variant: int = 1):
        """
        Initialize VGG detector
        
        Args:
            variant: VGG variant (1 or 2)
        """
        model_name = f"vgg16_v{variant}"
        super().__init__(model_name)
        self.variant = variant


class InceptionV3Detector(TensorFlowDetector):
    """InceptionV3 based deepfake detector"""
    
    def __init__(self):
        super().__init__("inceptionv3")
    
    def preprocess_frames(self, frames: List[np.ndarray]) -> np.ndarray:
        """
        Preprocess frames for InceptionV3 (299x299 input)
        
        Args:
            frames: List of video frames
            
        Returns:
            Preprocessed frames
        """
        processed = []
        
        for frame in frames:
            # InceptionV3 uses 299x299
            resized = cv2.resize(frame, (299, 299))
            rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            
            # InceptionV3-specific normalization [-1, 1]
            normalized = (rgb.astype(np.float32) / 127.5) - 1.0
            
            processed.append(normalized)
        
        return np.array(processed)


# Factory function to create detectors
def create_tensorflow_detector(model_name: str) -> TensorFlowDetector:
    """
    Factory function to create TensorFlow detectors
    
    Args:
        model_name: Name of the model from model_config.py
        
    Returns:
        Initialized detector instance
    """
    if model_name == "efficientnet_b4":
        return EfficientNetB4Detector()
    elif model_name == "resnet50_v1":
        return ResNet50Detector(variant=1)
    elif model_name == "resnet50_v2":
        return ResNet50Detector(variant=2)
    elif model_name == "vgg16_v1":
        return VGG16Detector(variant=1)
    elif model_name == "vgg16_v2":
        return VGG16Detector(variant=2)
    elif model_name == "inceptionv3":
        return InceptionV3Detector()
    else:
        raise ValueError(f"Unknown TensorFlow model: {model_name}")


if __name__ == "__main__":
    # Test model loading
    from model_config import get_available_models, MODEL_GROUPS
    
    print("=" * 80)
    print("TESTING TENSORFLOW DETECTORS")
    print("=" * 80)
    
    available = get_available_models()
    tf_models = [m for m in MODEL_GROUPS["tensorflow_only"] if m in available]
    
    print(f"\nAvailable TensorFlow models: {len(tf_models)}")
    
    for model_name in tf_models:
        try:
            print(f"\n{'='*80}")
            print(f"Testing: {model_name.upper()}")
            print(f"{'='*80}")
            
            detector = create_tensorflow_detector(model_name)
            print(f"✅ Successfully loaded {detector.architecture}")
            print(f"   Input size: {detector.input_size}")
            print(f"   Model path: {detector.model_path}")
            
        except Exception as e:
            print(f"❌ Failed to load {model_name}: {str(e)}")
