"""
PyTorch-based Pinpoint deepfake detector
Loads from the centralized model folder
"""
import numpy as np
import cv2
from typing import Dict, List, Optional
import logging

import torch

from .base_detector import BaseDeepfakeDetector
from .model_config import get_model_path, get_model_config
from .pinpoint import PinpointTransformer, Config, normalize_frames

logger = logging.getLogger(__name__)


class PinpointDetector(BaseDeepfakeDetector):
    """Pinpoint Transformer detector for audio-visual deepfake detection"""
    
    def __init__(self):
        """Initialize Pinpoint detector"""
        self.model_name = "pinpoint"
        self.config = get_model_config(self.model_name)
        self.model_path = get_model_path(self.model_name)
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.pinpoint_config = Config()
        
        self.model = None
        self.load_model()
        
        logger.info(f"Initialized Pinpoint Transformer detector")
        logger.info(f"Device: {self.device}")
    
    def load_model(self):
        """Load Pinpoint model from centralized model folder"""
        try:
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found: {self.model_path}")
            
            logger.info(f"Loading Pinpoint model from: {self.model_path}")
            
            # Initialize model
            self.model = PinpointTransformer(self.pinpoint_config).to(self.device)
            
            # Load state dict
            state_dict = torch.load(str(self.model_path), map_location=self.device)
            self.model.load_state_dict(state_dict)
            self.model.eval()
            
            logger.info("Successfully loaded Pinpoint model")
            
        except Exception as e:
            logger.error(f"Failed to load Pinpoint model: {str(e)}")
            raise
    
    def preprocess_frames(self, frames: List[np.ndarray]) -> np.ndarray:
        """
        Preprocess frames for Pinpoint model
        
        Args:
            frames: List of video frames (BGR format from OpenCV)
            
        Returns:
            Preprocessed frames as torch tensor
        """
        # Sample frames if too many
        num_frames = self.pinpoint_config.NUM_FRAMES
        if len(frames) > num_frames:
            indices = np.linspace(0, len(frames) - 1, num_frames, dtype=int)
            frames = [frames[i] for i in indices]
        elif len(frames) < num_frames:
            # Pad with last frame if too few
            while len(frames) < num_frames:
                frames.append(frames[-1].copy())
        
        # Preprocess each frame
        processed = []
        for frame in frames:
            # Resize to expected size
            resized = cv2.resize(frame, self.pinpoint_config.VIDEO_SIZE)
            
            # Convert BGR to RGB
            rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
            
            # Normalize
            normalized = normalize_frames(rgb)
            
            processed.append(normalized)
        
        # Stack and convert to tensor: (batch=1, num_frames, C, H, W)
        frames_array = np.stack(processed, axis=0)  # (T, C, H, W)
        frames_tensor = torch.from_numpy(frames_array).unsqueeze(0)  # (1, T, C, H, W)
        
        return frames_tensor
    
    def preprocess_audio(self, audio_path: str) -> torch.Tensor:
        """
        Preprocess audio for Pinpoint model
        
        Args:
            audio_path: Path to audio file
            
        Returns:
            MFCC features as torch tensor
        """
        try:
            import librosa
            
            # Load audio
            audio, sr = librosa.load(audio_path, sr=16000)
            
            # Extract MFCC features
            mfcc = librosa.feature.mfcc(
                y=audio,
                sr=sr,
                n_mfcc=self.pinpoint_config.NUM_MFCC,
                n_fft=512,
                hop_length=160
            )
            
            # Calculate expected audio length
            num_frames = self.pinpoint_config.NUM_FRAMES
            expected_audio_frames = num_frames * self.pinpoint_config.MFCC_FRAMES_PER_VIDEO_FRAME
            
            # librosa returns MFCC in shape (n_mfcc, time)
            # Resize MFCC to match video frames
            if mfcc.shape[1] > expected_audio_frames:
                mfcc = mfcc[:, :expected_audio_frames]
            elif mfcc.shape[1] < expected_audio_frames:
                # Pad with zeros
                padding = expected_audio_frames - mfcc.shape[1]
                mfcc = np.pad(mfcc, ((0, 0), (0, padding)), mode='constant')
            
            # Verify shape before conversion
            logger.debug(f"MFCC shape after padding: {mfcc.shape}")
            logger.debug(f"Expected shape: ({self.pinpoint_config.NUM_MFCC}, {expected_audio_frames})")
            
            # Convert to tensor: (batch=1, num_mfcc=13, time=128)
            # librosa.feature.mfcc returns shape (n_mfcc, time), so this should be correct
            mfcc_tensor = torch.from_numpy(mfcc).unsqueeze(0).float()
            
            logger.debug(f"MFCC tensor shape: {mfcc_tensor.shape}")
            
            return mfcc_tensor
            
        except ImportError:
            logger.error("librosa not installed. Audio processing requires librosa.")
            raise
        except Exception as e:
            logger.error(f"Failed to process audio: {str(e)}")
            raise
    
    def predict(self, frames: List[np.ndarray], audio_path: Optional[str] = None) -> Dict:
        """
        Predict deepfake probability using Pinpoint model
        
        Args:
            frames: List of video frames
            audio_path: Path to audio file (required for Pinpoint)
            
        Returns:
            Dictionary with prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        if audio_path is None:
            logger.warning("Pinpoint requires audio. Prediction may be less accurate without audio.")
            # You could implement a fallback here or raise an error
        
        # Preprocess video and audio
        video_tensor = self.preprocess_frames(frames).to(self.device)
        
        if audio_path and audio_path.strip():
            audio_tensor = self.preprocess_audio(audio_path).to(self.device)
        else:
            # Create dummy audio if not provided
            num_frames = self.pinpoint_config.NUM_FRAMES
            expected_audio_frames = num_frames * self.pinpoint_config.MFCC_FRAMES_PER_VIDEO_FRAME
            audio_tensor = torch.zeros(
                1, self.pinpoint_config.NUM_MFCC, expected_audio_frames
            ).to(self.device)
        
        # Run inference
        with torch.no_grad():
            classification_logits, offset_logits, attention_map = self.model(
                video_tensor, audio_tensor
            )
            
            # Get probability (sigmoid of logits)
            prob = torch.sigmoid(classification_logits).item()
        
        # Calculate manipulation percentage
        manipulation_pct = self.calculate_manipulation_percentage(prob)
        
        # Calculate confidence based on attention patterns
        confidence = self._calculate_confidence_from_attention(attention_map)
        
        return {
            "model_name": self.model_name,
            "architecture": "Pinpoint Transformer",
            "manipulation_percentage": manipulation_pct,
            "raw_score": float(prob),
            "confidence": confidence,
            "audio_visual_sync": {
                "offset_prediction": self._get_offset_prediction(offset_logits),
                "attention_strength": float(attention_map.mean().item()) if attention_map is not None else 0.0
            },
            "focus_areas": self.config.get("focus_areas", []),
            "description": self.config.get("description", ""),
            "uses_audio": audio_path is not None and audio_path.strip() != ""
        }
    
    def _get_offset_prediction(self, offset_logits: torch.Tensor) -> int:
        """Get predicted audio-video offset"""
        offset_class = torch.argmax(offset_logits, dim=-1).item()
        offset = offset_class - self.pinpoint_config.MAX_OFFSET
        return int(offset)
    
    def _calculate_confidence_from_attention(self, attention_map: Optional[torch.Tensor]) -> float:
        """
        Calculate confidence based on attention patterns
        
        Args:
            attention_map: Attention weights from the model
            
        Returns:
            Confidence score (0-100)
        """
        if attention_map is None:
            return 50.0  # Default confidence
        
        # High attention variance indicates strong, focused patterns (higher confidence)
        attention_variance = float(attention_map.var().item())
        
        # Normalize variance to confidence score
        # Higher variance = more decisive attention = higher confidence
        confidence = min(100, attention_variance * 1000)
        
        return round(confidence, 2)
    
    def calculate_manipulation_percentage(self, raw_score: float) -> float:
        """
        Convert raw Pinpoint score to manipulation percentage
        
        Args:
            raw_score: Raw prediction probability (0-1)
            
        Returns:
            Manipulation percentage (0-100)
        """
        return round(raw_score * 100, 2)


def create_pinpoint_detector() -> PinpointDetector:
    """
    Factory function to create Pinpoint detector
    
    Returns:
        Initialized PinpointDetector instance
    """
    return PinpointDetector()


if __name__ == "__main__":
    # Test Pinpoint detector
    print("=" * 80)
    print("TESTING PINPOINT DETECTOR")
    print("=" * 80)
    
    try:
        detector = create_pinpoint_detector()
        print(f"✅ Successfully loaded Pinpoint Transformer")
        print(f"   Device: {detector.device}")
        print(f"   Model path: {detector.model_path}")
        print(f"   Input size: {detector.pinpoint_config.VIDEO_SIZE}")
        print(f"   Num frames: {detector.pinpoint_config.NUM_FRAMES}")
        
    except Exception as e:
        print(f"❌ Failed to load Pinpoint: {str(e)}")
