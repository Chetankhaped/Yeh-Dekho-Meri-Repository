#!/bin/bash
# Quick Setup Script for Multi-Model Deepfake Detection

echo "════════════════════════════════════════════════════════════"
echo "  🚀 Multi-Model Deepfake Detection - Quick Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1: Check Python
echo "📍 Step 1: Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Found: $PYTHON_VERSION"
else
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Step 2: Install dependencies
echo ""
echo "📍 Step 2: Installing dependencies..."
cd app
if pip install -r requirements.txt; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
cd ..

# Step 3: Verify model files
echo ""
echo "📍 Step 3: Verifying model files..."

MODEL_FILES=(
    "pretrained-models-code/EfficientNet-B4/redeepfake_model.h5"
    "pretrained-models-code/ResNet-50/Res_01_FINAL.keras"
    "pretrained-models-code/ResNet-50/VGG_01_FINAL.keras"
    "pretrained-models-code/ResNet-50/ICV3_FINAL.keras"
    "model/best_pinpoint_model_antisocial.pth"
)

ALL_FOUND=true
for file in "${MODEL_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        echo "✅ $file ($SIZE)"
    else
        echo "❌ Missing: $file"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = false ]; then
    echo ""
    echo "⚠️  Some model files are missing!"
    echo "Please ensure all model files are in the correct locations."
    exit 1
fi

# Step 4: Run tests
echo ""
echo "📍 Step 4: Running system tests..."
if python3 test_multi_model.py; then
    echo "✅ All tests passed!"
else
    echo "⚠️  Some tests failed. Check the output above."
fi

# Step 5: Instructions
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Start the server:"
echo "   cd app"
echo "   uvicorn main:app --host 0.0.0.0 --port 8001 --reload"
echo ""
echo "2. Test the health endpoint:"
echo "   curl http://localhost:8001/health"
echo ""
echo "3. Test with a video:"
echo "   curl -X POST 'http://localhost:8001/predict_multi' \\"
echo "     -F 'file=@your_video.mp4' \\"
echo "     -F 'use_ensemble=true'"
echo ""
echo "4. Open the analysis notebook:"
echo "   jupyter notebook notebooks/Model_Comparison_Analysis.ipynb"
echo ""
echo "📖 Documentation:"
echo "   • MULTI_MODEL_INTEGRATION.md - Complete guide"
echo "   • IMPLEMENTATION_COMPLETE.md - Summary"
echo "   • QUICK_REFERENCE.txt - Quick commands"
echo ""
echo "════════════════════════════════════════════════════════════"
