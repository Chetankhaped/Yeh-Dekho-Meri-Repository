# 🏗️ Multi-Model Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER UPLOADS VIDEO                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (/predict)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Extract Frames (64 frames)                           │  │
│  │  2. Extract Audio (MFCC features)                        │  │
│  │  3. Compute Laplacian (blur detection)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          ENSEMBLE PREDICTOR (ensemble.py)                │  │
│  │                                                           │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │  │
│  │   │  Pinpoint   │  │ EfficientNet │  │  ResNet-50  │    │  │
│  │   │ Transformer │  │     B4       │  │             │    │  │
│  │   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │  │
│  │          │                 │                 │           │  │
│  │          │ Audio+Visual    │ Facial          │ Deep      │  │
│  │          │ Sync Analysis   │ Features        │ Features  │  │
│  │          │                 │                 │           │  │
│  │          ▼                 ▼                 ▼           │  │
│  │   ┌──────────────────────────────────────────────┐      │  │
│  │   │     Individual Model Predictions             │      │  │
│  │   │  • manipulation_score (0-1)                  │      │  │
│  │   │  • manipulation_percentage (0-100)           │      │  │
│  │   │  • confidence (very_low to very_high)        │      │  │
│  │   │  • per_frame_scores                          │      │  │
│  │   │  • explanation (text)                        │      │  │
│  │   │  • focus_areas (list)                        │      │  │
│  │   └──────────────────────────────────────────────┘      │  │
│  │                             │                            │  │
│  │                             ▼                            │  │
│  │   ┌──────────────────────────────────────────────┐      │  │
│  │   │        CONSENSUS ALGORITHM                   │      │  │
│  │   │  • Weighted averaging (Pinpoint: 1.2,        │      │  │
│  │   │    EfficientNet: 1.0, ResNet: 0.9)           │      │  │
│  │   │  • Confidence-based weighting                │      │  │
│  │   │  • Agreement calculation (std deviation)     │      │  │
│  │   └──────────────────────────────────────────────┘      │  │
│  │                             │                            │  │
│  │                             ▼                            │  │
│  │   ┌──────────────────────────────────────────────┐      │  │
│  │   │         MANIPULATION ANALYSIS                │      │  │
│  │   │  • consensus_score                           │      │  │
│  │   │  • consensus_percentage                      │      │  │
│  │   │  • confidence level                          │      │  │
│  │   │  • agreement_level                           │      │  │
│  │   │  • model_predictions (array)                 │      │  │
│  │   │  • agreement_matrix                          │      │  │
│  │   │  • detailed_breakdown                        │      │  │
│  │   └──────────────────────────────────────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JSON RESPONSE                               │
│                                                                   │
│  {                                                                │
│    "manipulation_analysis": {                                    │
│      "consensus_percentage": 78.5,                               │
│      "confidence": "high",                                       │
│      "agreement_level": "strong",                                │
│      "model_predictions": [...],                                 │
│      "agreement_matrix": [[...]],                                │
│      "detailed_breakdown": {...}                                 │
│    }                                                             │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND VISUALIZATION                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. CONSENSUS GAUGE (Animated Circular)                  │  │
│  │     ╭─────────╮                                           │  │
│  │    │  78.5%  │  ← Main manipulation percentage           │  │
│  │     ╰─────────╯                                           │  │
│  │     [High Confidence] [Strong Agreement]                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. MODEL COMPARISON BARS                                │  │
│  │                                                           │  │
│  │  Pinpoint    ████████████████░░ 82.3% [HIGH]            │  │
│  │  EfficientNet ██████████████░░░ 75.6% [HIGH]            │  │
│  │  ResNet      ███████████████░░░ 77.0% [HIGH]            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  3. RADAR CHART (Breakdown)                              │  │
│  │                                                           │  │
│  │         Facial (76%)                                     │  │
│  │              △                                            │  │
│  │             ╱ ╲                                           │  │
│  │   Audio ───●───● Compression                             │  │
│  │   (82%)    │   │ (61%)                                   │  │
│  │            ╲ ╱                                            │  │
│  │             ●                                             │  │
│  │       Temporal (74%)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  4. AGREEMENT HEATMAP                                    │  │
│  │                                                           │  │
│  │              Pinpoint  Efficient  ResNet                 │  │
│  │  Pinpoint      100%      93%      95%                    │  │
│  │  Efficient      93%     100%      98%                    │  │
│  │  ResNet         95%      98%     100%                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  5. TIMELINE (Per-Frame Analysis)                        │  │
│  │                                                           │  │
│  │    1.0 ┤                                                 │  │
│  │        │  ╱─╲    ╱──╲                                    │  │
│  │    0.8 ┤ ╱   ╲  ╱    ╲  ╱─╲     ← Pinpoint              │  │
│  │        │      ╲╱      ╲╱   ╲                             │  │
│  │    0.6 ┤  ╱───╲──╱╲────────╲   ← EfficientNet           │  │
│  │        │ ╱     ╲╱  ╲────────╲                            │  │
│  │    0.4 ┤╱                    ╲  ← ResNet                 │  │
│  │        └──────────────────────                           │  │
│  │        0      16     32    48    64 (frames)             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Video File
    │
    ├─→ Frame Extraction ──→ [64 RGB frames (128x128)]
    │                              │
    │                              ├─→ Pinpoint: frames + audio
    │                              ├─→ EfficientNet: frames (224x224)
    │                              └─→ ResNet: frames (224x224)
    │
    └─→ Audio Extraction ──→ [MFCC features]
                                   │
                                   └─→ Pinpoint only


Individual Predictions
    │
    ├─→ Pinpoint:       82.3% (audio-visual desync)
    ├─→ EfficientNet:   75.6% (facial artifacts)
    └─→ ResNet:         77.0% (deep features)
         │
         ▼
    Weighted Consensus
         │
         └─→ Final: 78.5% (high confidence, strong agreement)
```

## Model Specializations

```
┌────────────────────────────────────────────────────────────┐
│                    PINPOINT TRANSFORMER                     │
│  ┌────────────────────────────────────────────────────┐   │
│  │  • Audio-Visual Synchronization                     │   │
│  │  • Lip-Sync Detection                              │   │
│  │  • Temporal Consistency                            │   │
│  │  • Cross-Attention Mechanism                       │   │
│  │                                                     │   │
│  │  Best for: Videos with speech, interviews          │   │
│  │  Weight: 1.2 (highest)                             │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                      EFFICIENTNET-B4                        │
│  ┌────────────────────────────────────────────────────┐   │
│  │  • Face Region Analysis                             │   │
│  │  • Compression Artifacts                           │   │
│  │  • Frequency Domain Anomalies                      │   │
│  │  • Grad-CAM Heatmaps                               │   │
│  │                                                     │   │
│  │  Best for: High-quality face swaps                 │   │
│  │  Weight: 1.0                                       │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                         RESNET-50                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │  • Deep Feature Extraction                          │   │
│  │  • Face Texture Analysis                           │   │
│  │  • Artifact Detection                              │   │
│  │  • Robust to Compression                           │   │
│  │                                                     │   │
│  │  Best for: General detection, fast inference       │   │
│  │  Weight: 0.9                                       │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Consensus Algorithm

```
Step 1: Collect Individual Predictions
┌─────────────┬────────┬────────────┬──────────────────┐
│ Model       │ Score  │ Confidence │ Weighted Score   │
├─────────────┼────────┼────────────┼──────────────────┤
│ Pinpoint    │ 0.823  │ high (1.0) │ 0.823 × 1.2 = 0.988│
│ EfficientNet│ 0.756  │ high (1.0) │ 0.756 × 1.0 = 0.756│
│ ResNet      │ 0.770  │ high (1.0) │ 0.770 × 0.9 = 0.693│
└─────────────┴────────┴────────────┴──────────────────┘

Step 2: Calculate Weighted Average
Consensus = (0.988 + 0.756 + 0.693) / (1.2 + 1.0 + 0.9)
          = 2.437 / 3.1
          = 0.786
          = 78.6%

Step 3: Calculate Agreement
Standard Deviation = std(0.823, 0.756, 0.770) = 0.029
Agreement Level = "strong" (std < 0.1)

Step 4: Calculate Confidence
Distance from 0.5 = |0.786 - 0.5| = 0.286
Confidence Level = "high" (distance > 0.2)
```

## Visualization Components

```
┌─────────────────────────────────────────────────────────────┐
│  drawManipulationGauge()                                    │
│  ├─ Canvas-based circular gauge                             │
│  ├─ Animated from 0 to final percentage                     │
│  ├─ Color-coded (green to red)                              │
│  └─ Shows confidence badges                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  renderModelComparisonBars()                                │
│  ├─ Horizontal bars for each model                          │
│  ├─ Animated width transition                               │
│  ├─ Confidence badges (very_high to very_low)               │
│  └─ Individual explanations                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  drawRadarChart()                                           │
│  ├─ Multi-dimensional breakdown                             │
│  ├─ Facial, Audio, Compression, Temporal                    │
│  ├─ Filled polygon with values                              │
│  └─ Interactive hover (optional)                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  drawAgreementHeatmap()                                     │
│  ├─ Model-to-model agreement matrix                         │
│  ├─ Color-coded cells (red to green)                        │
│  ├─ Percentage labels in each cell                          │
│  └─ Model names on axes                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  drawSparklineMulti()                                       │
│  ├─ Multiple series overlaid                                │
│  ├─ Per-frame scores from each model                        │
│  ├─ Color-coded lines                                       │
│  └─ Interactive hover with values                           │
└─────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
Backend:
main.py
    │
    ├─→ models/ensemble.py
    │       │
    │       ├─→ models/base_detector.py
    │       ├─→ models/pinpoint.py (existing)
    │       ├─→ models/efficientnet_detector.py
    │       └─→ models/resnet_detector.py
    │
    └─→ utils/
            ├─→ video.py (frame extraction)
            ├─→ audio.py (MFCC extraction)
            └─→ visualize.py (Grad-CAM)

Frontend:
deepfake_analyzer_tool.html
    │
    ├─→ multi-model-visualizations.js (NEW)
    │       ├─ drawManipulationGauge()
    │       ├─ renderModelComparisonBars()
    │       ├─ drawRadarChart()
    │       ├─ drawAgreementHeatmap()
    │       └─ drawSparklineMulti()
    │
    ├─→ app.js (modified)
    │       └─ renderMultiModelResults()
    │
    └─→ styles.css (extended)
            └─ Multi-model specific styles
```

---

**Note**: This architecture supports:
- ✅ Multiple models running in parallel
- ✅ Graceful degradation (if a model fails, others continue)
- ✅ Easy addition of new models (implement BaseDeepfakeDetector)
- ✅ Flexible weighting (adjust model_weights in ensemble.py)
- ✅ Comprehensive visualization (5 different chart types)
- ✅ Production-ready (error handling, logging, validation)
