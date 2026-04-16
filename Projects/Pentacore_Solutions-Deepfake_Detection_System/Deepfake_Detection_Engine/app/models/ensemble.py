"""
Multi-Model Ensemble Predictor for Deepfake Detection
Combines predictions from multiple models using weighted voting
Loads all models from centralized model folder
"""
import numpy as np
from typing import Dict, List, Optional
import logging

from .model_config import (
    get_available_models, 
    get_model_config, 
    MODEL_GROUPS, 
    ENSEMBLE_CONFIGS
)
from .pytorch_detectors import PinpointDetector
from .tensorflow_detectors import create_tensorflow_detector

logger = logging.getLogger(__name__)


class EnsemblePredictor:
    """Ensemble predictor combining multiple deepfake detection models"""
    
    def __init__(self, ensemble_config: str = "default"):
        """
        Initialize ensemble with multiple models from centralized model folder
        
        Args:
            ensemble_config: Name of ensemble configuration from model_config.py
                           Options: "default", "fast", "maximum_accuracy", "visual_only"
        """
        self.detectors = {}
        self.model_weights = {}
        self.ensemble_config_name = ensemble_config
        
        # Get available models
        available_models = get_available_models()
        
        if not available_models:
            raise RuntimeError("No models found in model folder. Check model directory.")
        
        # Get ensemble configuration
        config = ENSEMBLE_CONFIGS.get(ensemble_config, ENSEMBLE_CONFIGS["default"])
        requested_models = config["models"]
        
        logger.info(f"Initializing '{ensemble_config}' ensemble")
        logger.info(f"Requested models: {requested_models}")
        logger.info(f"Available models: {available_models}")
        
        # Filter to only available models
        models_to_load = [m for m in requested_models if m in available_models]
        
        if not models_to_load:
            raise RuntimeError(f"No requested models available. Available: {available_models}")
        
        logger.info(f"Loading {len(models_to_load)} models: {models_to_load}")
        
        # Load models
        self._load_models(models_to_load)
        
        logger.info(f"Successfully initialized ensemble with {len(self.detectors)} models")
    
    def _load_models(self, model_names: List[str]):
        """
        Load detector models
        
        Args:
            model_names: List of model names to load
        """
        for model_name in model_names:
            try:
                logger.info(f"Loading {model_name}...")
                
                # Get model config for weight
                config = get_model_config(model_name)
                self.model_weights[model_name] = config.get("weight", 1.0)
                
                # Load PyTorch models
                if model_name == "pinpoint":
                    detector = PinpointDetector()
                    self.detectors[model_name] = detector
                    logger.info(f"✅ Loaded {model_name} (PyTorch)")
                
                # Load TensorFlow models
                elif model_name in MODEL_GROUPS["tensorflow_only"]:
                    detector = create_tensorflow_detector(model_name)
                    self.detectors[model_name] = detector
                    logger.info(f"✅ Loaded {model_name} (TensorFlow)")
                
                else:
                    logger.warning(f"Unknown model type: {model_name}")
                    
            except Exception as e:
                logger.error(f"❌ Failed to load {model_name}: {str(e)}")
                # Continue loading other models even if one fails
    
    def predict_ensemble(
        self,
        frames: List[np.ndarray],
        audio_path: Optional[str] = None
    ) -> Dict:
        """
        Get predictions from all models and compute ensemble result
        
        Args:
            frames: List of video frames (BGR format from OpenCV)
            audio_path: Optional path to audio file (required for Pinpoint)
            
        Returns:
            Dictionary containing:
                - manipulation_percentage: Final ensemble prediction (0-100)
                - confidence: Confidence score (0-100)
                - model_predictions: Individual predictions from each model
                - agreement_matrix: Model agreement scores
                - consensus_details: Details about model agreement
        """
        if not self.detectors:
            raise RuntimeError("No detectors loaded in ensemble")
        
        model_predictions = []
        
        # Get predictions from all models
        for model_name, detector in self.detectors.items():
            try:
                logger.info(f"Running prediction with {model_name}...")
                
                # Run prediction
                pred = detector.predict(frames, audio_path)
                pred["model_name"] = model_name
                pred["weight"] = self.model_weights.get(model_name, 1.0)
                
                model_predictions.append(pred)
                
                logger.info(f"  {model_name}: {pred['manipulation_percentage']:.2f}% manipulation")
                
            except Exception as e:
                logger.error(f"Error in {model_name}: {str(e)}")
                # Continue with other models
        
        if not model_predictions:
            raise RuntimeError("All model predictions failed")
        
        # Calculate consensus
        consensus_result = self._calculate_consensus(model_predictions)
        
        # Calculate agreement matrix
        agreement_matrix = self._calculate_agreement_matrix(model_predictions)
        
        # Build final result
        result = {
            "manipulation_percentage": consensus_result["manipulation_percentage"],
            "confidence": consensus_result["confidence"],
            "label": consensus_result["label"],
            "model_predictions": model_predictions,
            "agreement_matrix": agreement_matrix,
            "consensus_details": consensus_result,
            "ensemble_config": self.ensemble_config_name,
            "num_models": len(model_predictions)
        }
        
        logger.info(f"Ensemble prediction: {result['manipulation_percentage']:.2f}% ({result['label']})")
        logger.info(f"Confidence: {result['confidence']:.2f}%")
        
        return result
    
    def _calculate_consensus(self, predictions: List[Dict]) -> Dict:
        """
        Calculate weighted consensus from multiple model predictions
        
        Args:
            predictions: List of prediction dictionaries from each model
            
        Returns:
            Dictionary with consensus results
        """
        if not predictions:
            return {
                "manipulation_percentage": 0.0,
                "confidence": 0.0,
                "label": "Unknown"
            }
        
        # Extract manipulation percentages and weights
        scores = []
        weights = []
        confidences = []
        
        for pred in predictions:
            scores.append(pred["manipulation_percentage"])
            weights.append(pred.get("weight", 1.0))
            confidences.append(pred.get("confidence", 50.0))
        
        scores = np.array(scores)
        weights = np.array(weights)
        confidences = np.array(confidences)
        
        # Calculate weighted average
        total_weight = np.sum(weights)
        weighted_score = np.sum(scores * weights) / total_weight
        
        # Calculate standard deviation (agreement measure)
        std_dev = np.std(scores)
        
        # Calculate confidence based on:
        # 1. Model agreement (low std = high confidence)
        # 2. Individual model confidences
        # 3. Number of models (more models = more confidence)
        agreement_score = 100 * (1 - min(std_dev / 50, 1))  # Normalize std to 0-100
        avg_model_confidence = np.mean(confidences)
        model_count_bonus = min(len(predictions) * 5, 20)  # Up to 20% bonus
        
        ensemble_confidence = (
            0.4 * agreement_score +
            0.5 * avg_model_confidence +
            0.1 * model_count_bonus
        )
        
        # Determine label
        if weighted_score < 20:
            label = "Authentic (High Confidence)"
        elif weighted_score < 40:
            label = "Likely Authentic"
        elif weighted_score < 60:
            label = "Uncertain"
        elif weighted_score < 80:
            label = "Likely Manipulated"
        else:
            label = "Manipulated (High Confidence)"
        
        return {
            "manipulation_percentage": round(float(weighted_score), 2),
            "confidence": round(float(ensemble_confidence), 2),
            "label": label,
            "agreement": {
                "std_deviation": round(float(std_dev), 2),
                "min_score": round(float(np.min(scores)), 2),
                "max_score": round(float(np.max(scores)), 2),
                "range": round(float(np.max(scores) - np.min(scores)), 2)
            },
            "weighted_average": round(float(weighted_score), 2),
            "simple_average": round(float(np.mean(scores)), 2)
        }
    
    def _calculate_agreement_matrix(self, predictions: List[Dict]) -> List[List[float]]:
        """
        Calculate pairwise agreement between models
        
        Args:
            predictions: List of prediction dictionaries
            
        Returns:
            2D matrix of agreement scores (0-100)
        """
        n = len(predictions)
        agreement_matrix = np.zeros((n, n))
        
        scores = [pred["manipulation_percentage"] for pred in predictions]
        
        for i in range(n):
            for j in range(n):
                if i == j:
                    agreement_matrix[i][j] = 100.0
                else:
                    # Agreement is inverse of difference
                    diff = abs(scores[i] - scores[j])
                    agreement = 100 * (1 - min(diff / 100, 1))
                    agreement_matrix[i][j] = agreement
        
        # Convert to list of lists with model names
        model_names = [pred["model_name"] for pred in predictions]
        
        result = []
        for i, name_i in enumerate(model_names):
            row = {
                "model": name_i,
                "agreements": {}
            }
            for j, name_j in enumerate(model_names):
                row["agreements"][name_j] = round(float(agreement_matrix[i][j]), 2)
            result.append(row)
        
        return result
    
    def get_model_info(self) -> Dict:
        """
        Get information about loaded models
        
        Returns:
            Dictionary with model information
        """
        info = {
            "ensemble_config": self.ensemble_config_name,
            "num_models": len(self.detectors),
            "models": []
        }
        
        for model_name, detector in self.detectors.items():
            config = get_model_config(model_name)
            model_info = {
                "name": model_name,
                "architecture": config.get("architecture", "Unknown"),
                "framework": config.get("framework", "Unknown"),
                "weight": self.model_weights.get(model_name, 1.0),
                "focus_areas": config.get("focus_areas", []),
                "description": config.get("description", "")
            }
            info["models"].append(model_info)
        
        return info


def create_ensemble(config: str = "default") -> EnsemblePredictor:
    """
    Factory function to create ensemble predictor
    
    Args:
        config: Ensemble configuration name
                Options: "default", "fast", "maximum_accuracy", "visual_only"
    
    Returns:
        Initialized EnsemblePredictor instance
    """
    return EnsemblePredictor(ensemble_config=config)


if __name__ == "__main__":
    # Test ensemble predictor
    print("=" * 80)
    print("TESTING ENSEMBLE PREDICTOR")
    print("=" * 80)
    
    try:
        print("\nInitializing ensemble...")
        ensemble = create_ensemble("default")
        
        print("\n" + "=" * 80)
        print("ENSEMBLE INFO")
        print("=" * 80)
        
        info = ensemble.get_model_info()
        print(f"\nEnsemble Config: {info['ensemble_config']}")
        print(f"Number of Models: {info['num_models']}")
        
        print("\nLoaded Models:")
        for model in info["models"]:
            print(f"\n  {model['name'].upper()}")
            print(f"    Architecture: {model['architecture']}")
            print(f"    Framework: {model['framework']}")
            print(f"    Weight: {model['weight']}")
            print(f"    Focus: {', '.join(model['focus_areas'])}")
        
        print("\n" + "=" * 80)
        print("✅ Ensemble successfully initialized")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ Failed to initialize ensemble: {str(e)}")
        import traceback
        traceback.print_exc()
