"""
Base detector interface for all deepfake detection models
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Tuple, Optional
import numpy as np
import torch


class BaseDeepfakeDetector(ABC):
    """Abstract base class for deepfake detection models"""
    
    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self.model = None
        
    @abstractmethod
    def load_model(self, model_path: str):
        """Load the pretrained model"""
        pass
    
    @abstractmethod
    def predict(self, frames: np.ndarray, **kwargs) -> Dict:
        """
        Make prediction on input frames
        
        Args:
            frames: numpy array of shape (T, H, W, C) - video frames
            **kwargs: additional model-specific parameters
            
        Returns:
            Dict containing:
                - manipulation_score: float 0-1 (0=real, 1=fake)
                - manipulation_percentage: float 0-100
                - confidence: float 0-1
                - per_frame_scores: List[float]
                - explanation: str
                - focus_areas: List[str]
                - heatmaps: Optional[List[np.ndarray]]
        """
        pass
    
    def calculate_manipulation_percentage(self, score: float) -> Tuple[float, str]:
        """
        Convert model score to manipulation percentage with confidence level
        
        Args:
            score: float 0-1 where 1 = fully manipulated
            
        Returns:
            (manipulation_percentage, confidence_level)
        """
        manipulation_pct = score * 100
        
        # Confidence levels based on distance from decision boundary
        distance_from_boundary = abs(score - 0.5)
        if distance_from_boundary > 0.4:
            confidence = "very_high"
        elif distance_from_boundary > 0.3:
            confidence = "high"
        elif distance_from_boundary > 0.2:
            confidence = "medium"
        elif distance_from_boundary > 0.1:
            confidence = "low"
        else:
            confidence = "very_low"
            
        return manipulation_pct, confidence
    
    def preprocess_frames(self, frames: np.ndarray) -> torch.Tensor:
        """Default preprocessing for frames"""
        # Normalize to [0, 1]
        if frames.max() > 1.0:
            frames = frames / 255.0
        
        # Convert to torch tensor (T, C, H, W)
        frames_tensor = torch.from_numpy(frames.transpose(0, 3, 1, 2)).float()
        return frames_tensor.to(self.device)
    
    def get_model_info(self) -> Dict:
        """Return model metadata"""
        return {
            "name": self.model_name,
            "device": self.device,
            "loaded": self.model is not None
        }
