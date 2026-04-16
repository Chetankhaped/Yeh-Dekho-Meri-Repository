"""
Comprehensive Model Validation Script
Tests all models in the centralized model folder
"""
import sys
from pathlib import Path

# Add app directory to path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

print("=" * 80)
print("DEEPFAKE DETECTION - MODEL VALIDATION")
print("=" * 80)

# Step 1: Validate model files
print("\n" + "=" * 80)
print("STEP 1: Validating Model Files")
print("=" * 80)

try:
    from models.model_config import validate_models, get_available_models, MODEL_PATHS
    
    status = validate_models()
    
    print(f"\nTotal Models Configured: {len(MODEL_PATHS)}")
    print(f"Models Found: {len([s for s in status.values() if s['exists']])}")
    print(f"Models Missing: {len([s for s in status.values() if not s['exists']])}")
    
    print("\nModel Status:")
    for name, info in status.items():
        status_icon = "✅" if info["exists"] else "❌"
        print(f"  {status_icon} {name.upper()}")
        print(f"     Framework: {info['framework']}")
        print(f"     Path: {info['path']}")
        if info["exists"]:
            print(f"     Size: {info['size_mb']} MB")
        print()
    
    available = get_available_models()
    if not available:
        print("\n❌ ERROR: No models found! Check model folder.")
        sys.exit(1)
    
    print(f"\n✅ {len(available)} models available: {', '.join(available)}")
    
except Exception as e:
    print(f"\n❌ Model validation failed: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Step 2: Test TensorFlow detectors
print("\n" + "=" * 80)
print("STEP 2: Testing TensorFlow Detectors")
print("=" * 80)

try:
    from models.tensorflow_detectors import create_tensorflow_detector
    from models.model_config import MODEL_GROUPS
    
    tf_models = [m for m in MODEL_GROUPS["tensorflow_only"] if m in available]
    
    print(f"\nTensorFlow models to test: {len(tf_models)}")
    
    tf_detectors = {}
    for model_name in tf_models:
        try:
            print(f"\nTesting: {model_name}")
            detector = create_tensorflow_detector(model_name)
            tf_detectors[model_name] = detector
            print(f"  ✅ Successfully loaded {detector.architecture}")
            print(f"     Input size: {detector.input_size}")
            print(f"     Model path: {detector.model_path}")
        except Exception as e:
            print(f"  ❌ Failed: {str(e)}")
    
    print(f"\n✅ Loaded {len(tf_detectors)}/{len(tf_models)} TensorFlow models")
    
except Exception as e:
    print(f"\n⚠️ TensorFlow detector test failed: {str(e)}")
    print("This may be normal if TensorFlow is not installed yet.")
    tf_detectors = {}

# Step 3: Test PyTorch detectors
print("\n" + "=" * 80)
print("STEP 3: Testing PyTorch Detectors")
print("=" * 80)

try:
    from models.pytorch_detectors import create_pinpoint_detector
    
    if "pinpoint" in available:
        print("\nTesting: pinpoint")
        pinpoint = create_pinpoint_detector()
        print(f"  ✅ Successfully loaded Pinpoint Transformer")
        print(f"     Device: {pinpoint.device}")
        print(f"     Model path: {pinpoint.model_path}")
        print(f"     Input size: {pinpoint.pinpoint_config.VIDEO_SIZE}")
        print(f"     Num frames: {pinpoint.pinpoint_config.NUM_FRAMES}")
        pytorch_loaded = True
    else:
        print("\n⚠️ Pinpoint model file not found")
        pytorch_loaded = False
    
except Exception as e:
    print(f"\n❌ PyTorch detector test failed: {str(e)}")
    import traceback
    traceback.print_exc()
    pytorch_loaded = False

# Step 4: Test Ensemble
print("\n" + "=" * 80)
print("STEP 4: Testing Ensemble Predictor")
print("=" * 80)

try:
    from models.ensemble import create_ensemble
    
    # Test different ensemble configs
    configs_to_test = ["default", "fast", "maximum_accuracy"]
    
    for config_name in configs_to_test:
        try:
            print(f"\n Testing '{config_name}' ensemble...")
            ensemble = create_ensemble(config_name)
            
            info = ensemble.get_model_info()
            print(f"  ✅ {config_name.upper()} Ensemble")
            print(f"     Models loaded: {info['num_models']}")
            print(f"     Models: {', '.join([m['name'] for m in info['models']])}")
            
        except Exception as e:
            print(f"  ⚠️ {config_name} ensemble failed: {str(e)}")
    
    print(f"\n✅ Ensemble predictor tests completed")
    
except Exception as e:
    print(f"\n❌ Ensemble test failed: {str(e)}")
    import traceback
    traceback.print_exc()

# Step 5: Summary
print("\n" + "=" * 80)
print("VALIDATION SUMMARY")
print("=" * 80)

print(f"\n✅ Model Files: {len(available)}/{len(MODEL_PATHS)} available")
if tf_detectors:
    print(f"✅ TensorFlow Models: {len(tf_detectors)} loaded successfully")
else:
    print(f"⚠️ TensorFlow Models: Not loaded (install tensorflow>=2.13.0)")

if pytorch_loaded:
    print(f"✅ PyTorch Models: Pinpoint loaded successfully")
else:
    print(f"⚠️ PyTorch Models: Pinpoint not loaded")

print("\n" + "=" * 80)
print("NEXT STEPS")
print("=" * 80)

if len(available) < len(MODEL_PATHS):
    print("\n1. Download missing model files")
    print("   - Check Docs/MULTI_MODEL_IMPLEMENTATION.md for download links")
    print("   - Place all models in: Deepfake_Detection_Engine/model/")

if not tf_detectors:
    print("\n2. Install TensorFlow")
    print("   - Run: pip install tensorflow>=2.13.0")
    print("   - Or rebuild Docker: docker compose up --build")

print("\n3. Update main.py")
print("   - Integrate ensemble predictor into /predict endpoint")
print("   - Update response models to include manipulation_analysis")

print("\n4. Update frontend")
print("   - Add multi-model-visualizations.js to HTML")
print("   - Update app.js to render ensemble results")

print("\n5. Test end-to-end")
print("   - Upload a test video")
print("   - Verify all models run correctly")
print("   - Check visualizations display properly")

print("\n" + "=" * 80)
print("✅ Validation Complete!")
print("=" * 80)
