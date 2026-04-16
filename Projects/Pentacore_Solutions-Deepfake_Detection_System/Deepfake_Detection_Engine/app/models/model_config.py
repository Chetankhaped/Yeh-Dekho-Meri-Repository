"""
Model Configuration for Multi-Model Deepfake Detection
All model files should be in: Deepfake_Detection_Engine/model/
"""
import os
from pathlib import Path

# Base model directory - support both Docker and local paths
# In Docker: /app/model (from volume mount)
# Locally: Deepfake_Detection_Engine/model/
MODEL_DIR = Path(os.environ.get("MODEL_DIR", Path(__file__).parent.parent.parent / "model"))

# Model paths configuration
MODEL_PATHS = {
    # PyTorch models
    "pinpoint": {
        "path": MODEL_DIR / "best_pinpoint_model_antisocial.pth",
        "type": "pytorch",
        "framework": "pytorch",
        "input_size": (128, 128),
        "num_frames": 64,
        "requires_audio": True,
        "description": "Audio-visual transformer for lip-sync and temporal consistency",
        "focus_areas": ["audio_visual_sync", "lip_sync", "temporal_consistency"],
        "weight": 1.3  # Highest weight due to audio-visual analysis
    },
    
    # TensorFlow models
    "efficientnet_b4": {
        "path": MODEL_DIR / "efficientnet_b4_deepfake.h5",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (224, 224),
        "architecture": "EfficientNet-B4",
        "description": "Efficient feature extraction for facial manipulation detection",
        "focus_areas": ["face_region", "compression_artifacts", "frequency_domain"],
        "weight": 1.2
    },
    
    "resnet50_v1": {
        "path": MODEL_DIR / "Res_01_FINAL.keras",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (224, 224),
        "architecture": "ResNet-50",
        "description": "Deep residual network variant 1 for robust feature detection",
        "focus_areas": ["deep_features", "face_textures", "artifacts"],
        "weight": 1.0
    },
    
    "resnet50_v2": {
        "path": MODEL_DIR / "Res_02_FINAL.keras",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (224, 224),
        "architecture": "ResNet-50",
        "description": "Deep residual network variant 2 for enhanced detection",
        "focus_areas": ["deep_features", "spatial_patterns", "artifacts"],
        "weight": 1.0
    },
    
    "vgg16_v1": {
        "path": MODEL_DIR / "VGG_01_FINAL.keras",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (224, 224),
        "architecture": "VGG-16",
        "description": "VGG network for texture and pattern analysis",
        "focus_areas": ["texture_patterns", "edge_detection", "color_consistency"],
        "weight": 0.9
    },
    
    "vgg16_v2": {
        "path": MODEL_DIR / "VGG_2_FINAL.h5",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (224, 224),
        "architecture": "VGG-16",
        "description": "VGG network variant 2 for complementary texture analysis",
        "focus_areas": ["texture_patterns", "gradient_analysis", "artifacts"],
        "weight": 0.9
    },
    
    "inceptionv3": {
        "path": MODEL_DIR / "ICV3_FINAL.keras",
        "type": "tensorflow",
        "framework": "tensorflow",
        "input_size": (299, 299),  # InceptionV3 uses 299x299
        "architecture": "InceptionV3",
        "description": "Multi-scale feature extraction with inception modules",
        "focus_areas": ["multi_scale_features", "inception_patterns", "semantic_consistency"],
        "weight": 1.1
    }
}

# Model groups for different scenarios
MODEL_GROUPS = {
    "all": ["pinpoint", "efficientnet_b4", "resnet50_v1", "resnet50_v2", "vgg16_v1", "vgg16_v2", "inceptionv3"],
    "audio_required": ["pinpoint"],
    "visual_only": ["efficientnet_b4", "resnet50_v1", "resnet50_v2", "vgg16_v1", "vgg16_v2", "inceptionv3"],
    "fast": ["efficientnet_b4", "resnet50_v1", "pinpoint"],  # Faster models
    "accurate": ["pinpoint", "efficientnet_b4", "inceptionv3", "resnet50_v1", "resnet50_v2"],  # Most accurate
    "tensorflow_only": ["efficientnet_b4", "resnet50_v1", "resnet50_v2", "vgg16_v1", "vgg16_v2", "inceptionv3"],
    "pytorch_only": ["pinpoint"]
}

# Ensemble configurations
ENSEMBLE_CONFIGS = {
    "default": {
        "models": ["pinpoint", "efficientnet_b4", "resnet50_v1", "inceptionv3"],
        "description": "Balanced ensemble with audio-visual and visual models"
    },
    "fast": {
        "models": ["pinpoint", "vgg16_v1", "vgg16_v2"],
        "description": "Fast ensemble - Pinpoint + VGG16 models (excludes slow EfficientNet-B4)"
    },
    "single": {
        "models": ["pinpoint"],
        "description": "Fastest inference - Pinpoint audio-visual transformer only"
    },
    "maximum_accuracy": {
        "models": MODEL_GROUPS["all"],
        "description": "All models for highest accuracy (slower)"
    },
    "visual_only": {
        "models": MODEL_GROUPS["visual_only"],
        "description": "For videos without audio"
    }
}

def get_model_path(model_name: str) -> Path:
    """Get absolute path to model file"""
    if model_name not in MODEL_PATHS:
        raise ValueError(f"Unknown model: {model_name}. Available: {list(MODEL_PATHS.keys())}")
    return MODEL_PATHS[model_name]["path"]

def get_available_models() -> list:
    """Get list of models that exist on disk"""
    available = []
    for name, config in MODEL_PATHS.items():
        if config["path"].exists():
            available.append(name)
    return available

def get_model_config(model_name: str) -> dict:
    """Get configuration for a specific model"""
    if model_name not in MODEL_PATHS:
        raise ValueError(f"Unknown model: {model_name}")
    return MODEL_PATHS[model_name].copy()

def get_ensemble_config(config_name: str = "default") -> dict:
    """Get ensemble configuration"""
    if config_name not in ENSEMBLE_CONFIGS:
        raise ValueError(f"Unknown ensemble config: {config_name}. Available: {list(ENSEMBLE_CONFIGS.keys())}")
    return ENSEMBLE_CONFIGS[config_name].copy()

def validate_models() -> dict:
    """Validate all model files exist and return status"""
    status = {}
    for name, config in MODEL_PATHS.items():
        path = config["path"]
        exists = path.exists()
        status[name] = {
            "exists": exists,
            "path": str(path),
            "framework": config["framework"],
            "size_mb": round(path.stat().st_size / (1024 * 1024), 2) if exists else 0
        }
    return status

# Print model information when imported
if __name__ == "__main__":
    print("=" * 80)
    print("DEEPFAKE DETECTION MODEL CONFIGURATION")
    print("=" * 80)
    print(f"\nModel Directory: {MODEL_DIR}")
    print(f"\nTotal Models Configured: {len(MODEL_PATHS)}")
    
    print("\n" + "=" * 80)
    print("MODEL STATUS")
    print("=" * 80)
    
    status = validate_models()
    for name, info in status.items():
        status_icon = "✅" if info["exists"] else "❌"
        print(f"\n{status_icon} {name.upper()}")
        print(f"   Framework: {info['framework']}")
        print(f"   Path: {info['path']}")
        if info["exists"]:
            print(f"   Size: {info['size_mb']} MB")
        else:
            print(f"   Status: FILE NOT FOUND")
    
    print("\n" + "=" * 80)
    print("AVAILABLE MODELS")
    print("=" * 80)
    available = get_available_models()
    print(f"Ready to use: {len(available)}/{len(MODEL_PATHS)}")
    print(f"Models: {', '.join(available)}")
    
    print("\n" + "=" * 80)
    print("ENSEMBLE CONFIGURATIONS")
    print("=" * 80)
    for config_name, config in ENSEMBLE_CONFIGS.items():
        print(f"\n{config_name.upper()}")
        print(f"   Description: {config['description']}")
        print(f"   Models: {', '.join(config['models'])}")
        available_count = sum(1 for m in config['models'] if m in available)
        print(f"   Available: {available_count}/{len(config['models'])}")
