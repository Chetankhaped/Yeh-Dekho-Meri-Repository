#!/usr/bin/env python3
"""
Quick Test Script for Multi-Model Deepfake Detection

This script tests all components of the multi-model system:
1. TensorFlow model loading
2. Individual model predictions
3. Ensemble predictions
4. Model comparison
"""

import os
import sys
import numpy as np
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent / "app"))

def test_model_loader():
    """Test TensorFlow model loader"""
    print("\n" + "="*70)
    print("🔍 TEST 1: TensorFlow Model Loader")
    print("="*70)
    
    try:
        from models.tf_model_loader import TensorFlowModelLoader
        
        # Initialize loader
        loader = TensorFlowModelLoader("pretrained-models-code")
        
        # List available models
        print("\n📋 Available Models:")
        for key, config in loader.model_configs.items():
            print(f"  • {key}: {config['name']}")
            print(f"    - Path: {config['path']}")
            print(f"    - Input: {config['input_size']}")
            print(f"    - Preprocessing: {config['preprocessing']}")
            print()
        
        print("✅ Model loader initialized successfully!")
        return loader
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None


def test_single_model(loader):
    """Test loading and using a single model"""
    print("\n" + "="*70)
    print("🔍 TEST 2: Single Model Prediction")
    print("="*70)
    
    try:
        # Create dummy image
        dummy_image = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
        print(f"\n📷 Created test image: {dummy_image.shape}, dtype: {dummy_image.dtype}")
        
        # Test EfficientNet-B4
        print("\n🧪 Testing EfficientNet-B4...")
        model = loader.load_model("efficientnet_b4")
        print(f"✅ Model loaded: {type(model)}")
        
        confidence, label = loader.predict(dummy_image, "efficientnet_b4")
        print(f"✅ Prediction: {label} (confidence: {confidence:.4f})")
        
        # Calculate manipulation percentage
        if label == "FAKE":
            manipulation_pct = confidence * 100
        else:
            manipulation_pct = (1.0 - confidence) * 100
        
        print(f"📊 Manipulation percentage: {manipulation_pct:.2f}%")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_ensemble(loader):
    """Test ensemble prediction"""
    print("\n" + "="*70)
    print("🔍 TEST 3: Ensemble Prediction")
    print("="*70)
    
    try:
        # Create dummy image
        dummy_image = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
        
        # Define models and weights
        model_weights = {
            "efficientnet_b4": 0.93,
            "resnet_50_v1": 0.91,
            "vgg_16_v1": 0.89,
            "inceptionv3": 0.90
        }
        
        print(f"\n🎯 Running ensemble with {len(model_weights)} models...")
        print("\nModel weights:")
        for model, weight in model_weights.items():
            print(f"  • {model}: {weight}")
        
        # Run ensemble prediction
        result = loader.predict_ensemble(
            dummy_image,
            model_keys=list(model_weights.keys()),
            weights=model_weights
        )
        
        print("\n📊 Ensemble Results:")
        print(f"  • Manipulation%: {result['ensemble']['manipulation_percentage']:.2f}%")
        print(f"  • Label: {result['ensemble']['label']}")
        print(f"  • Confidence Level: {result['ensemble']['confidence_level']}")
        print(f"  • Agreement: {result['ensemble']['agreement']:.2%}")
        print(f"  • Models Used: {result['model_count']}")
        
        print("\n🔍 Individual Model Predictions:")
        for model_key, pred in result['individual_predictions'].items():
            print(f"\n  {pred['model_name']}:")
            print(f"    - Label: {pred['label']}")
            print(f"    - Confidence: {pred['confidence']:.4f}")
            print(f"    - Manipulation%: {pred['manipulation_percentage']:.2f}%")
            print(f"    - Weight: {pred['weight']:.3f}")
        
        print("\n✅ Ensemble prediction completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_model_info(loader):
    """Test model info retrieval"""
    print("\n" + "="*70)
    print("🔍 TEST 4: Model Information")
    print("="*70)
    
    try:
        # Get all model info
        all_info = loader.get_model_info()
        
        print("\n📚 Complete Model Specifications:")
        for model_key, config in all_info.items():
            print(f"\n{config['name']}:")
            print(f"  Key: {model_key}")
            print(f"  Path: {config['path']}")
            print(f"  Input Size: {config['input_size']}")
            print(f"  Preprocessing: {config['preprocessing']}")
            print(f"  Description: {config['description']}")
        
        print("\n✅ Model information retrieved successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def verify_model_files():
    """Verify that all model files exist"""
    print("\n" + "="*70)
    print("🔍 TEST 5: Verify Model Files")
    print("="*70)
    
    model_files = [
        "pretrained-models-code/EfficientNet-B4/redeepfake_model.h5",
        "pretrained-models-code/ResNet-50/Res_01_FINAL.keras",
        "pretrained-models-code/ResNet-50/Res_02_FINAL.keras",
        "pretrained-models-code/ResNet-50/VGG_01_FINAL.keras",
        "pretrained-models-code/ResNet-50/VGG_2_FINAL.h5",
        "pretrained-models-code/ResNet-50/ICV3_FINAL.keras",
        "model/best_pinpoint_model_antisocial.pth"
    ]
    
    all_exist = True
    print("\n📁 Checking model files:")
    
    for file_path in model_files:
        exists = os.path.exists(file_path)
        status = "✅" if exists else "❌"
        size = ""
        if exists:
            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            size = f" ({size_mb:.1f} MB)"
        print(f"  {status} {file_path}{size}")
        if not exists:
            all_exist = False
    
    if all_exist:
        print("\n✅ All model files found!")
    else:
        print("\n⚠️  Some model files are missing!")
    
    return all_exist


def check_dependencies():
    """Check if required dependencies are installed"""
    print("\n" + "="*70)
    print("🔍 TEST 6: Check Dependencies")
    print("="*70)
    
    required_packages = [
        "tensorflow",
        "numpy",
        "opencv-python",
        "torch",
        "fastapi",
        "uvicorn"
    ]
    
    print("\n📦 Checking installed packages:")
    all_installed = True
    
    for package in required_packages:
        try:
            if package == "opencv-python":
                import cv2
                version = cv2.__version__
            else:
                mod = __import__(package.replace("-", "_"))
                version = getattr(mod, "__version__", "unknown")
            
            print(f"  ✅ {package}: {version}")
        except ImportError:
            print(f"  ❌ {package}: NOT INSTALLED")
            all_installed = False
    
    if all_installed:
        print("\n✅ All dependencies installed!")
    else:
        print("\n⚠️  Some dependencies are missing!")
        print("\nTo install missing dependencies:")
        print("  cd app && pip install -r requirements.txt")
    
    return all_installed


def check_gpu():
    """Check GPU availability"""
    print("\n" + "="*70)
    print("🔍 TEST 7: GPU Availability")
    print("="*70)
    
    # Check TensorFlow GPU
    try:
        import tensorflow as tf
        gpus = tf.config.list_physical_devices('GPU')
        print(f"\n🖥️  TensorFlow GPUs: {len(gpus)}")
        for i, gpu in enumerate(gpus):
            print(f"  • GPU {i}: {gpu.name}")
        if len(gpus) == 0:
            print("  ⚠️  No GPU detected for TensorFlow (will use CPU)")
    except Exception as e:
        print(f"  ❌ Error checking TensorFlow GPU: {str(e)}")
    
    # Check PyTorch GPU
    try:
        import torch
        cuda_available = torch.cuda.is_available()
        print(f"\n🖥️  PyTorch CUDA: {cuda_available}")
        if cuda_available:
            print(f"  • Device count: {torch.cuda.device_count()}")
            print(f"  • Current device: {torch.cuda.current_device()}")
            print(f"  • Device name: {torch.cuda.get_device_name(0)}")
        else:
            print("  ⚠️  CUDA not available for PyTorch (will use CPU)")
    except Exception as e:
        print(f"  ❌ Error checking PyTorch GPU: {str(e)}")


def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("🚀 MULTI-MODEL DEEPFAKE DETECTION - QUICK TEST")
    print("="*70)
    
    # Change to script directory
    os.chdir(Path(__file__).parent)
    
    # Run tests
    results = {}
    
    # Test 1: Dependencies
    results['dependencies'] = check_dependencies()
    
    # Test 2: GPU
    check_gpu()
    
    # Test 3: Model files
    results['model_files'] = verify_model_files()
    
    if not results['dependencies']:
        print("\n⚠️  Please install dependencies first:")
        print("  cd app && pip install -r requirements.txt")
        return
    
    if not results['model_files']:
        print("\n⚠️  Some model files are missing. Please check the paths.")
    
    # Test 4: Model loader
    loader = test_model_loader()
    results['loader'] = loader is not None
    
    if loader:
        # Test 5: Single model
        results['single_model'] = test_single_model(loader)
        
        # Test 6: Ensemble
        results['ensemble'] = test_ensemble(loader)
        
        # Test 7: Model info
        results['model_info'] = test_model_info(loader)
    
    # Print summary
    print("\n" + "="*70)
    print("📊 TEST SUMMARY")
    print("="*70)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status} - {test_name}")
    
    all_passed = all(results.values())
    
    if all_passed:
        print("\n🎉 All tests passed! System is ready.")
        print("\n📝 Next steps:")
        print("  1. Start the FastAPI server:")
        print("     cd app && uvicorn main:app --host 0.0.0.0 --port 8001 --reload")
        print("  2. Test the endpoint:")
        print("     curl http://localhost:8001/health")
        print("  3. Open the analysis notebook:")
        print("     jupyter notebook notebooks/Model_Comparison_Analysis.ipynb")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    print("\n" + "="*70)


if __name__ == "__main__":
    main()
