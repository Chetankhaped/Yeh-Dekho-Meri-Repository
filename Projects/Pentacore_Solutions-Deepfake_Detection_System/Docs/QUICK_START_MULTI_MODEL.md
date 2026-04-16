# Multi-Model Deepfake Detection - Quick Start Guide

## ✅ What Has Been Implemented

### Backend Components Created:
1. **`base_detector.py`** - Abstract base class for all detectors
2. **`efficientnet_detector.py`** - EfficientNet-B4 based detector
3. **`resnet_detector.py`** - ResNet-50 based detector  
4. **`ensemble.py`** - Ensemble predictor combining all models

### Key Features:
- ✅ Multiple model predictions
- ✅ Manipulation percentage (0-100%) instead of binary labels
- ✅ Per-frame scores from each model
- ✅ Weighted consensus algorithm
- ✅ Model agreement matrix
- ✅ Confidence levels (very_low to very_high)
- ✅ Detailed breakdown (facial, audio, compression, temporal)
- ✅ Individual explanations per model

## 📊 Available Models

### 1. **Pinpoint Transformer** (Your Existing Model)
- **Focus**: Audio-visual synchronization, lip-sync
- **Best for**: Videos with speech
- **Weight in ensemble**: 1.2 (highest)

### 2. **EfficientNet-B4** (NEW)
- **Focus**: Face region, compression artifacts, frequency domain
- **Best for**: High-quality face swaps
- **Weight in ensemble**: 1.0
- **Source**: Uses `timm` library with ImageNet weights

### 3. **ResNet-50** (NEW)
- **Focus**: Deep features, face textures, artifacts
- **Best for**: General deepfake detection
- **Weight in ensemble**: 0.9
- **Source**: Uses `torchvision` with ImageNet weights

## 🔧 Installation

### 1. Update Dependencies

Add to `requirements.txt`:
```txt
# Existing dependencies...
timm>=0.9.0              # For EfficientNet
```

### 2. Install Dependencies
```bash
pip install timm
```

## 🚀 Usage in Backend (main.py)

### Replace the existing single-model prediction with ensemble:

```python
from models.ensemble import EnsemblePredictor

# Initialize ensemble (once, at startup)
ensemble = EnsemblePredictor(device=_device, use_pinpoint=True)
ensemble.initialize_models(pinpoint_path=MODEL_PATH)

# In predict endpoint:
ensemble_result = ensemble.predict_ensemble(
    frames_rgb=frames_rgb,
    mfcc=mfcc if audio_present else None,
    audio_present=audio_present
)

# Response now includes:
# - consensus_score: overall manipulation score (0-1)
# - consensus_percentage: manipulation % (0-100)
# - confidence: overall confidence level
# - agreement_level: how much models agree
# - model_predictions: list of individual model results
# - agreement_matrix: model-to-model agreement
# - detailed_breakdown: facial, audio, compression, temporal scores
```

## 📱 Frontend Visualization

### New Visualization Components Needed:

#### 1. **Consensus Gauge** (Main Score)
```javascript
// Shows overall manipulation percentage from ensemble
drawCircularGauge(canvas, consensusPercentage, {
    mainText: `${consensusPercentage.toFixed(1)}%`,
    subText: 'Manipulation',
    color: getColorForScore(consensusPercentage)
});
```

#### 2. **Model Comparison Bars**
```javascript
// Horizontal bars showing each model's prediction
function drawModelComparisonBars(container, modelPredictions) {
    modelPredictions.forEach(pred => {
        const bar = createBar(
            pred.model_name,
            pred.manipulation_percentage,
            pred.confidence
        );
        container.appendChild(bar);
    });
}
```

#### 3. **Radar Chart** (Multi-dimensional comparison)
```javascript
// Compare models across multiple dimensions
function drawRadarChart(canvas, data) {
    // Dimensions: Facial, Audio, Compression, Temporal, Overall
    const dimensions = Object.keys(data.detailed_breakdown);
    // Draw pentagon/hexagon with model scores
}
```

#### 4. **Agreement Heatmap**
```javascript
// Show model-to-model agreement matrix
function drawAgreementHeatmap(canvas, agreementMatrix, modelNames) {
    // Color-coded matrix showing which models agree
    // Green = high agreement, Red = low agreement
}
```

#### 5. **Timeline Comparison**
```javascript
// Per-frame scores from all models overlaid
drawSparklineMulti(canvas, [
    model1.per_frame_scores,
    model2.per_frame_scores,
    model3.per_frame_scores
], {
    labels: ['Pinpoint', 'EfficientNet', 'ResNet'],
    colors: ['#22d3ee', '#f472b6', '#10b981']
});
```

## 🎨 Updated API Response Structure

```json
{
    "audio_present": true,
    "video_meta": {...},
    
    "manipulation_analysis": {
        "consensus_score": 0.78,
        "consensus_percentage": 78.5,
        "confidence": "high",
        "agreement_level": "strong",
        
        "model_predictions": [
            {
                "model_name": "Pinpoint Transformer",
                "manipulation_score": 0.823,
                "manipulation_percentage": 82.3,
                "confidence": "high",
                "per_frame_scores": [0.1, 0.2, ...],
                "explanation": "Strong audio-visual desynchronization detected...",
                "focus_areas": ["audio_visual_sync", "lip_sync", "temporal_consistency"]
            },
            {
                "model_name": "EfficientNet-B4",
                "manipulation_score": 0.756,
                "manipulation_percentage": 75.6,
                "confidence": "high",
                "per_frame_scores": [0.15, 0.22, ...],
                "explanation": "Facial region shows compression artifacts...",
                "focus_areas": ["face_region", "compression_artifacts", "frequency_domain"]
            },
            {
                "model_name": "ResNet-50",
                "manipulation_score": 0.770,
                "manipulation_percentage": 77.0,
                "confidence": "high",
                "per_frame_scores": [0.14, 0.21, ...],
                "explanation": "Deep feature analysis reveals inconsistencies...",
                "focus_areas": ["deep_features", "face_textures", "artifacts"]
            }
        ],
        
        "agreement_matrix": [
            [1.0, 0.93, 0.95],
            [0.93, 1.0, 0.98],
            [0.95, 0.98, 1.0]
        ],
        
        "detailed_breakdown": {
            "facial_manipulation": 76.3,
            "audio_manipulation": 82.3,
            "compression_artifacts": 61.0,
            "temporal_consistency": 74.1
        },
        
        "num_models": 3
    },
    
    "laplacian_pred": {...}
}
```

## 🎯 Color Coding for Manipulation Percentage

```javascript
function getColorForManipulation(percentage) {
    if (percentage < 20) return '#10b981';  // Green - Very Low
    if (percentage < 40) return '#84cc16';  // Light Green - Low
    if (percentage < 60) return '#eab308';  // Yellow - Medium
    if (percentage < 80) return '#f97316';  // Orange - High
    return '#ef4444';  // Red - Very High
}

function getConfidenceBadgeColor(confidence) {
    const colors = {
        'very_high': '#059669',
        'high': '#10b981',
        'medium': '#eab308',
        'low': '#f97316',
        'very_low': '#ef4444'
    };
    return colors[confidence] || '#6b7280';
}
```

## 📈 Example Visualization Layout

```html
<div class="manipulation-results">
    <!-- Main Consensus Gauge -->
    <div class="consensus-section">
        <h4>Overall Analysis</h4>
        <canvas id="consensusGauge"></canvas>
        <div class="confidence-badge">Confidence: High</div>
        <div class="agreement-badge">Agreement: Strong</div>
    </div>
    
    <!-- Model Comparison -->
    <div class="models-section">
        <h4>Individual Model Predictions</h4>
        <div id="modelBars"></div>
    </div>
    
    <!-- Detailed Breakdown -->
    <div class="breakdown-section">
        <h4>Manipulation Breakdown</h4>
        <canvas id="radarChart"></canvas>
        <div class="breakdown-list">
            <div class="item">Facial: 76.3%</div>
            <div class="item">Audio: 82.3%</div>
            <div class="item">Compression: 61.0%</div>
            <div class="item">Temporal: 74.1%</div>
        </div>
    </div>
    
    <!-- Agreement Matrix -->
    <div class="agreement-section">
        <h4>Model Agreement</h4>
        <canvas id="agreementHeatmap"></canvas>
    </div>
    
    <!-- Timeline -->
    <div class="timeline-section">
        <h4>Per-Frame Analysis</h4>
        <canvas id="timelineChart"></canvas>
    </div>
</div>
```

## 🔄 Next Steps

### Phase 1: Backend Integration (Priority)
1. ✅ Add `timm` to requirements.txt
2. ✅ Create model detector classes
3. ✅ Create ensemble predictor
4. 🔲 Modify `main.py` to use ensemble
5. 🔲 Update response models (Pydantic)
6. 🔲 Test with sample videos

### Phase 2: Frontend Visualization (Next)
1. 🔲 Add consensus gauge component
2. 🔲 Add model comparison bars
3. 🔲 Add radar chart for breakdown
4. 🔲 Add agreement heatmap
5. 🔲 Update timeline to show multiple models
6. 🔲 Style and polish UI

### Phase 3: Model Weights (Optional)
1. 🔲 Download FaceForensics++ XceptionNet weights
2. 🔲 Download DFDC EfficientNet weights
3. 🔲 Add MesoNet model
4. 🔲 Fine-tune weights on your dataset

## 📝 Benefits of This Approach

1. **More Reliable**: Multiple models reduce false positives/negatives
2. **Explainable**: Each model explains what it detected
3. **Nuanced**: Manipulation percentage instead of binary label
4. **Visual**: Easy to understand with charts and gauges
5. **Confidence**: Users see how confident and how much models agree
6. **Comprehensive**: Different models catch different manipulation types

## ⚠️ Important Notes

- EfficientNet and ResNet currently use ImageNet weights (not deepfake-specific)
- For best results, download pre-trained deepfake weights (see MULTI_MODEL_IMPLEMENTATION.md)
- Even with ImageNet weights, ensemble provides more robust detection than single model
- The Pinpoint model (your existing one) carries highest weight in ensemble
- Models can be individually disabled if they fail to load

## 🧪 Testing

Test the ensemble with different video types:
- ✅ Videos with audio (all 3 models)
- ✅ Videos without audio (EfficientNet + ResNet only)
- ✅ Short clips (~5-10 seconds)
- ✅ Long videos (automatic frame sampling)
- ✅ High quality vs. compressed videos

## 📚 Documentation

See `MULTI_MODEL_IMPLEMENTATION.md` for:
- Detailed model descriptions
- Download links for pre-trained weights
- Advanced configuration options
- Model training/fine-tuning guidance
