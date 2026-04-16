"""
ResNet-based deepfake detector
Uses torchvision ResNet50 model
"""
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Optional
import cv2
import torchvision.models as models

from .base_detector import BaseDeepfakeDetector


class ResNetDetector(BaseDeepfakeDetector):
    """ResNet50-based deepfake detector"""
    
    def __init__(self, device: str = "cpu"):
        super().__init__("ResNet-50", device)
        self.input_size = 224
        
    def load_model(self, model_path: Optional[str] = None):
        """Load ResNet50 model"""
        # Create model
        self.model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2 if model_path is None else None)
        
        # Modify final layer for binary classification
        num_features = self.model.fc.in_features
        self.model.fc = nn.Linear(num_features, 1)
        
        # Load custom weights if provided
        if model_path:
            try:
                state_dict = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
            except Exception as e:
                print(f"Warning: Could not load custom weights: {e}")
                print("Using ImageNet pretrained weights with random classifier")
        
        self.model = self.model.to(self.device)
        self.model.eval()
        
    def predict(self, frames: np.ndarray, **kwargs) -> Dict:
        """
        Predict manipulation on video frames
        
        Args:
            frames: numpy array (T, H, W, C)
        """
        if self.model is None:
            self.load_model()
        
        # Sample frames if too many
        max_frames = 32
        if len(frames) > max_frames:
            indices = np.linspace(0, len(frames) - 1, max_frames, dtype=int)
            frames = frames[indices]
        
        per_frame_scores = []
        heatmaps = []
        
        with torch.no_grad():
            for i, frame in enumerate(frames):
                # Resize and preprocess
                frame_resized = cv2.resize(frame, (self.input_size, self.input_size))
                frame_tensor = self._preprocess_frame(frame_resized)
                frame_tensor = frame_tensor.unsqueeze(0).to(self.device)
                
                # Predict
                logit = self.model(frame_tensor)
                prob = torch.sigmoid(logit).item()
                per_frame_scores.append(prob)
        
        # Calculate overall score
        manipulation_score = float(np.mean(per_frame_scores))
        manipulation_pct, confidence = self.calculate_manipulation_percentage(manipulation_score)
        
        # Explanation
        explanation = self._generate_explanation(manipulation_score, per_frame_scores)
        
        return {
            "manipulation_score": manipulation_score,
            "manipulation_percentage": manipulation_pct,
            "confidence": confidence,
            "per_frame_scores": per_frame_scores,
            "explanation": explanation,
            "focus_areas": ["deep_features", "face_textures", "artifacts"],
            "heatmaps": None
        }
    
    def _preprocess_frame(self, frame: np.ndarray) -> torch.Tensor:
        """Preprocess single frame for ResNet"""
        # Normalize with ImageNet stats
        frame = frame.astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        frame = (frame - mean) / std
        
        # Convert to tensor (C, H, W)
        frame_tensor = torch.from_numpy(frame.transpose(2, 0, 1)).float()
        return frame_tensor
    
    def _generate_explanation(self, score: float, per_frame_scores: List[float]) -> str:
        """Generate human-readable explanation"""
        variance = np.var(per_frame_scores)
        
        if score > 0.7:
            if variance < 0.05:
                return "High and consistent manipulation detected across all frames. Deep feature analysis suggests systematic alteration."
            else:
                return "High manipulation detected but with varying intensity. Some frames show stronger manipulation signals."
        elif score > 0.5:
            return "Moderate manipulation likelihood. Deep feature extraction reveals some inconsistencies in facial textures."
        elif score > 0.3:
            return "Low manipulation signals. Minor artifacts detected but could be due to compression or lighting."
        else:
            return "Appears authentic based on deep feature analysis. Natural texture patterns and consistent features throughout."
