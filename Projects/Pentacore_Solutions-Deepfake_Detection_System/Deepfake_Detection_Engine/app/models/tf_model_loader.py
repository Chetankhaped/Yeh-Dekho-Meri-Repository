"""
TensorFlow Model Loader for Pretrained Deepfake Detection Models

This module loads the trained .h5 and .keras model files and provides
a unified interface for all TensorFlow-based detectors.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class TensorFlowModelLoader:
    """
    Loads and manages TensorFlow/Keras pretrained models for deepfake detection.
    """
    
    def __init__(self, model_base_path: str = "../pretrained-models-code"):
        """
        Initialize the model loader.
        
        Args:
            model_base_path: Base directory containing pretrained models
        """
        self.model_base_path = model_base_path
        self.models = {}
        self.model_configs = {
            "efficientnet_b4": {
                "name": "EfficientNet-B4",
                "path": "EfficientNet-B4/redeepfake_model.h5",
                "input_size": (224, 224),
                "preprocessing": "standard",  # (x - 127.5) / 127.5
                "description": "ReDeepFake model with highest accuracy"
            },
            "resnet_50_v1": {
                "name": "ResNet-50-v1",
                "path": "ResNet-50/Res_01_FINAL.keras",
                "input_size": (224, 224),
                "preprocessing": "imagenet",  # ImageNet preprocessing
                "description": "ResNet-50 variant 1"
            },
            "resnet_50_v2": {
                "name": "ResNet-50-v2",
                "path": "ResNet-50/Res_02_FINAL.keras",
                "input_size": (224, 224),
                "preprocessing": "imagenet",
                "description": "ResNet-50 variant 2"
            },
            "vgg_16_v1": {
                "name": "VGG-16-v1",
                "path": "ResNet-50/VGG_01_FINAL.keras",
                "input_size": (224, 224),
                "preprocessing": "imagenet",
                "description": "VGG-16 variant 1 for texture analysis"
            },
            "vgg_16_v2": {
                "name": "VGG-16-v2",
                "path": "ResNet-50/VGG_2_FINAL.h5",
                "input_size": (224, 224),
                "preprocessing": "imagenet",
                "description": "VGG-16 variant 2"
            },
            "inceptionv3": {
                "name": "InceptionV3",
                "path": "ResNet-50/ICV3_FINAL.keras",
                "input_size": (224, 224),
                "preprocessing": "inception",  # (-1, 1) range
                "description": "InceptionV3 for multi-scale detection"
            }
        }
        
        logger.info(f"TensorFlow Model Loader initialized with {len(self.model_configs)} model configurations")
    
    def load_model(self, model_key: str) -> tf.keras.Model:
        """
        Load a specific model by key.
        
        Args:
            model_key: Key from model_configs
            
        Returns:
            Loaded Keras model
        """
        if model_key in self.models:
            logger.info(f"Model {model_key} already loaded, returning cached version")
            return self.models[model_key]
        
        if model_key not in self.model_configs:
            raise ValueError(f"Unknown model key: {model_key}. Available: {list(self.model_configs.keys())}")
        
        config = self.model_configs[model_key]
        model_path = os.path.join(self.model_base_path, config["path"])
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        logger.info(f"Loading model {config['name']} from {model_path}")
        
        try:
            # Load the model
            model = load_model(model_path, compile=False)
            
            # Recompile with appropriate loss and metrics
            model.compile(
                optimizer='adam',
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            self.models[model_key] = model
            logger.info(f"✅ Successfully loaded {config['name']}")
            
            return model
            
        except Exception as e:
            logger.error(f"❌ Failed to load model {model_key}: {str(e)}")
            raise
    
    def load_all_models(self) -> Dict[str, tf.keras.Model]:
        """
        Load all available models.
        
        Returns:
            Dictionary of loaded models
        """
        logger.info("Loading all TensorFlow models...")
        
        for model_key in self.model_configs.keys():
            try:
                self.load_model(model_key)
            except Exception as e:
                logger.warning(f"Could not load {model_key}: {str(e)}")
        
        logger.info(f"Loaded {len(self.models)} out of {len(self.model_configs)} models")
        return self.models
    
    def preprocess_image(self, image: np.ndarray, model_key: str) -> np.ndarray:
        """
        Preprocess image according to model requirements.
        
        Args:
            image: Input image as numpy array (H, W, 3)
            model_key: Model key to determine preprocessing method
            
        Returns:
            Preprocessed image ready for model input
        """
        config = self.model_configs[model_key]
        input_size = config["input_size"]
        preprocessing = config["preprocessing"]
        
        # Resize image
        if image.shape[:2] != input_size:
            image = tf.image.resize(image, input_size).numpy()
        
        # Ensure float32 and [0, 255] range
        if image.dtype != np.float32:
            image = image.astype(np.float32)
        
        # Apply preprocessing based on model type
        if preprocessing == "standard":
            # Standard normalization: (x - 127.5) / 127.5 => [-1, 1]
            image = (image - 127.5) / 127.5
            
        elif preprocessing == "imagenet":
            # ImageNet preprocessing
            # RGB to BGR
            image = image[..., ::-1]
            # Zero-center by mean pixel
            mean = [103.939, 116.779, 123.68]
            image[..., 0] -= mean[0]
            image[..., 1] -= mean[1]
            image[..., 2] -= mean[2]
            
        elif preprocessing == "inception":
            # InceptionV3 preprocessing: scale to [-1, 1]
            image = image / 127.5 - 1.0
            
        else:
            # Default: scale to [0, 1]
            if image.max() > 1.0:
                image = image / 255.0
        
        # Add batch dimension
        if len(image.shape) == 3:
            image = np.expand_dims(image, axis=0)
        
        return image
    
    def predict(self, image: np.ndarray, model_key: str) -> Tuple[float, str]:
        """
        Make prediction using a specific model.
        
        Args:
            image: Input image (H, W, 3)
            model_key: Model to use for prediction
            
        Returns:
            Tuple of (confidence_score, label)
        """
        # Load model if not already loaded
        model = self.load_model(model_key)
        
        # Preprocess image
        processed_image = self.preprocess_image(image, model_key)
        
        # Make prediction
        prediction = model.predict(processed_image, verbose=0)[0][0]
        
        # Convert to label and confidence
        if prediction >= 0.5:
            label = "FAKE"
            confidence = float(prediction)
        else:
            label = "REAL"
            confidence = float(1.0 - prediction)
        
        return confidence, label
    
    def predict_ensemble(self, image: np.ndarray, 
                        model_keys: List[str] = None,
                        weights: Dict[str, float] = None) -> Dict:
        """
        Make ensemble prediction using multiple models.
        
        Args:
            image: Input image
            model_keys: List of model keys to use (None = use all)
            weights: Custom weights for each model (None = equal weights)
            
        Returns:
            Dictionary with ensemble results
        """
        if model_keys is None:
            model_keys = list(self.model_configs.keys())
        
        # Default equal weights
        if weights is None:
            weights = {key: 1.0 / len(model_keys) for key in model_keys}
        
        # Normalize weights
        total_weight = sum(weights.values())
        weights = {k: v / total_weight for k, v in weights.items()}
        
        # Collect predictions from all models
        predictions = {}
        manipulation_scores = []
        
        for model_key in model_keys:
            try:
                confidence, label = self.predict(image, model_key)
                
                # Calculate manipulation percentage
                if label == "FAKE":
                    manipulation_pct = confidence * 100
                else:
                    manipulation_pct = (1.0 - confidence) * 100
                
                predictions[model_key] = {
                    "model_name": self.model_configs[model_key]["name"],
                    "confidence": confidence,
                    "label": label,
                    "manipulation_percentage": manipulation_pct,
                    "weight": weights[model_key]
                }
                
                # Weighted manipulation score
                manipulation_scores.append(manipulation_pct * weights[model_key])
                
            except Exception as e:
                logger.error(f"Prediction failed for {model_key}: {str(e)}")
                continue
        
        # Calculate ensemble score
        ensemble_manipulation = sum(manipulation_scores)
        ensemble_label = "FAKE" if ensemble_manipulation > 50 else "REAL"
        
        # Determine confidence level
        if ensemble_manipulation >= 80 or ensemble_manipulation <= 20:
            confidence_level = "very_high"
        elif ensemble_manipulation >= 70 or ensemble_manipulation <= 30:
            confidence_level = "high"
        elif ensemble_manipulation >= 60 or ensemble_manipulation <= 40:
            confidence_level = "medium"
        elif ensemble_manipulation >= 50 or ensemble_manipulation <= 50:
            confidence_level = "low"
        else:
            confidence_level = "very_low"
        
        # Calculate model agreement
        fake_count = sum(1 for p in predictions.values() if p["label"] == "FAKE")
        agreement = max(fake_count, len(predictions) - fake_count) / len(predictions)
        
        return {
            "ensemble": {
                "manipulation_percentage": round(ensemble_manipulation, 2),
                "label": ensemble_label,
                "confidence_level": confidence_level,
                "agreement": round(agreement, 2)
            },
            "individual_predictions": predictions,
            "model_count": len(predictions)
        }
    
    def get_model_info(self, model_key: str = None) -> Dict:
        """
        Get information about models.
        
        Args:
            model_key: Specific model key (None = all models)
            
        Returns:
            Model configuration information
        """
        if model_key:
            return self.model_configs.get(model_key, {})
        return self.model_configs


# Example usage
if __name__ == "__main__":
    # Initialize loader
    loader = TensorFlowModelLoader()
    
    # Print available models
    print("\n📋 Available Models:")
    for key, config in loader.model_configs.items():
        print(f"  • {key}: {config['name']} - {config['description']}")
    
    # Load all models (optional, for testing)
    # loader.load_all_models()
    
    print("\n✅ TensorFlow Model Loader ready!")
