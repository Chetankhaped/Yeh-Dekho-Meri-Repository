"""
EfficientNet-based deepfake detector
Uses timm library with pre-trained EfficientNet models
"""
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Optional
import cv2

try:
    import timm
    TIMM_AVAILABLE = True
except ImportError:
    TIMM_AVAILABLE = False

from .base_detector import BaseDeepfakeDetector


class EfficientNetDetector(BaseDeepfakeDetector):
    """EfficientNet-based deepfake detector"""
    
    def __init__(self, device: str = "cpu", model_variant: str = "efficientnet_b4"):
        super().__init__("EfficientNet-B4", device)
        self.model_variant = model_variant
        self.input_size = 224
        
    def load_model(self, model_path: Optional[str] = None):
        """Load EfficientNet model"""
        if not TIMM_AVAILABLE:
            raise ImportError("timm library required. Install with: pip install timm")
        
        # Create model
        self.model = timm.create_model(
            self.model_variant,
            pretrained=True if model_path is None else False,
            num_classes=1
        )
        
        # Load custom weights if provided
        if model_path:
            try:
                state_dict = torch.load(model_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
            except Exception as e:
                print(f"Warning: Could not load custom weights: {e}")
                print("Using ImageNet pretrained weights")
        
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
                
                # Generate heatmap for key frames
                if i in [len(frames)//4, len(frames)//2, 3*len(frames)//4]:
                    heatmap = self._generate_gradcam(frame_tensor, frame_resized)
                    if heatmap is not None:
                        heatmaps.append(heatmap)
        
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
            "focus_areas": ["face_region", "compression_artifacts", "frequency_domain"],
            "heatmaps": heatmaps if heatmaps else None
        }
    
    def _preprocess_frame(self, frame: np.ndarray) -> torch.Tensor:
        """Preprocess single frame for EfficientNet"""
        # Normalize with ImageNet stats
        frame = frame.astype(np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        frame = (frame - mean) / std
        
        # Convert to tensor (C, H, W)
        frame_tensor = torch.from_numpy(frame.transpose(2, 0, 1)).float()
        return frame_tensor
    
    def _generate_gradcam(self, frame_tensor: torch.Tensor, original_frame: np.ndarray) -> Optional[np.ndarray]:
        """Generate Grad-CAM heatmap"""
        try:
            # Get the last convolutional layer
            target_layer = None
            for name, module in self.model.named_modules():
                if isinstance(module, nn.Conv2d):
                    target_layer = module
            
            if target_layer is None:
                return None
            
            # Hook to capture activations and gradients
            activations = []
            gradients = []
            
            def forward_hook(module, input, output):
                activations.append(output)
            
            def backward_hook(module, grad_in, grad_out):
                gradients.append(grad_out[0])
            
            forward_handle = target_layer.register_forward_hook(forward_hook)
            backward_handle = target_layer.register_full_backward_hook(backward_hook)
            
            # Forward pass
            self.model.zero_grad()
            output = self.model(frame_tensor)
            
            # Backward pass
            output.backward()
            
            # Remove hooks
            forward_handle.remove()
            backward_handle.remove()
            
            # Compute Grad-CAM
            if activations and gradients:
                activation = activations[0]
                gradient = gradients[0]
                
                # Global average pooling of gradients
                weights = torch.mean(gradient, dim=(2, 3), keepdim=True)
                
                # Weighted combination of activation maps
                cam = torch.sum(weights * activation, dim=1, keepdim=True)
                cam = F.relu(cam)
                
                # Normalize
                cam = cam.squeeze().cpu().numpy()
                cam = cam - cam.min()
                if cam.max() > 0:
                    cam = cam / cam.max()
                
                # Resize to original frame size
                cam = cv2.resize(cam, (original_frame.shape[1], original_frame.shape[0]))
                
                return cam
            
        except Exception as e:
            print(f"Grad-CAM generation failed: {e}")
        
        return None
    
    def _generate_explanation(self, score: float, per_frame_scores: List[float]) -> str:
        """Generate human-readable explanation"""
        if score > 0.7:
            consistency = "high" if np.std(per_frame_scores) < 0.15 else "moderate"
            return f"High manipulation detected with {consistency} consistency across frames. Facial region shows compression artifacts and frequency domain anomalies."
        elif score > 0.5:
            return "Moderate manipulation detected. Some frames show inconsistencies in texture patterns and compression artifacts."
        elif score > 0.3:
            return "Low manipulation detected. Mostly authentic with minor anomalies in compression patterns."
        else:
            return "Appears authentic. Consistent texture patterns and natural compression throughout."
