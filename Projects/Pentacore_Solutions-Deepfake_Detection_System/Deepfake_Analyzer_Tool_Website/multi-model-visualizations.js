/**
 * Advanced Visualization Components for Multi-Model Deepfake Detection
 * 
 * This file contains visualization functions for displaying:
 * 1. Consensus manipulation gauge
 * 2. Model comparison bars
 * 3. Radar chart for breakdown
 * 4. Agreement heatmap
 * 5. Multi-model timeline
 */

// ============================================================================
// 1. CONSENSUS GAUGE (Main manipulation percentage)
// ============================================================================

/**
 * Draw a circular gauge showing manipulation percentage
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} percentage - Manipulation percentage (0-100)
 * @param {object} options - Display options
 */
function drawManipulationGauge(canvas, percentage, options = {}) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas dimensions
    const size = 200;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    const lineWidth = size * 0.08;
    
    // Color based on manipulation level
    const color = getManipulationColor(percentage);
    const bgTrack = 'rgba(148, 163, 184, 0.2)';
    
    // Animation
    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;
    const span = endAngle - startAngle;
    
    let startTime = null;
    const duration = 1200;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const currentValue = eased * percentage;
        
        ctx.clearRect(0, 0, size, size);
        
        // Background track
        ctx.beginPath();
        ctx.strokeStyle = bgTrack;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
        ctx.stroke();
        
        // Progress arc
        const progressAngle = startAngle + span * (currentValue / 100);
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.arc(centerX, centerY, radius, startAngle, progressAngle, false);
        ctx.stroke();
        
        // Center text - percentage
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#0b1220';
        ctx.font = 'bold 32px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(currentValue)}%`, centerX, centerY - 8);
        
        // Subtitle
        ctx.font = '500 14px Inter, system-ui';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
        ctx.fillText(options.subtitle || 'Manipulation', centerX, centerY + 20);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Get color based on manipulation percentage
 */
function getManipulationColor(percentage) {
    if (percentage < 20) return '#10b981';  // Green - Very Low
    if (percentage < 40) return '#84cc16';  // Light Green - Low
    if (percentage < 60) return '#eab308';  // Yellow - Medium
    if (percentage < 80) return '#f97316';  // Orange - High
    return '#ef4444';  // Red - Very High
}

/**
 * Get manipulation level text
 */
function getManipulationLevel(percentage) {
    if (percentage < 20) return 'Very Low';
    if (percentage < 40) return 'Low';
    if (percentage < 60) return 'Medium';
    if (percentage < 80) return 'High';
    return 'Very High';
}

// ============================================================================
// 2. MODEL COMPARISON BARS
// ============================================================================

/**
 * Create horizontal bars comparing model predictions
 * @param {HTMLElement} container - Container element
 * @param {Array} modelPredictions - Array of model prediction objects
 */
function renderModelComparisonBars(container, modelPredictions) {
    container.innerHTML = '';
    container.className = 'model-comparison-bars';
    
    modelPredictions.forEach(pred => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'model-bar-wrapper';
        
        // Model name and confidence
        const header = document.createElement('div');
        header.className = 'model-bar-header';
        
        // Handle confidence as either number or string
        const confidenceValue = typeof pred.confidence === 'number' 
            ? `${pred.confidence.toFixed(1)}%` 
            : (typeof pred.confidence === 'string' ? pred.confidence.replace('_', ' ') : 'N/A');
        
        header.innerHTML = `
            <span class="model-name">${pred.model_name || pred.model || 'Unknown Model'}</span>
            <span class="model-confidence">${confidenceValue}</span>
        `;
        
        // Bar container
        const barContainer = document.createElement('div');
        barContainer.className = 'model-bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'model-bar';
        bar.style.width = '0%';
        bar.style.backgroundColor = getManipulationColor(pred.manipulation_percentage);
        
        // Animate bar
        setTimeout(() => {
            bar.style.width = `${pred.manipulation_percentage}%`;
        }, 100);
        
        // Percentage label
        const label = document.createElement('span');
        label.className = 'model-bar-label';
        label.textContent = `${pred.manipulation_percentage.toFixed(1)}%`;
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        
        // Explanation
        const explanation = document.createElement('div');
        explanation.className = 'model-explanation';
        explanation.textContent = pred.explanation;
        
        barWrapper.appendChild(header);
        barWrapper.appendChild(barContainer);
        barWrapper.appendChild(explanation);
        
        container.appendChild(barWrapper);
    });
}

// ============================================================================
// 3. RADAR CHART (Breakdown comparison)
// ============================================================================

/**
 * Draw radar chart for manipulation breakdown
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {object} breakdown - Breakdown data object
 */
function drawRadarChart(canvas, breakdown) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const size = 300;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    
    // Prepare data
    const dimensions = Object.keys(breakdown);
    const values = Object.values(breakdown);
    const numDimensions = dimensions.length;
    
    ctx.clearRect(0, 0, size, size);
    
    // Draw background grid
    const levels = 5;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    
    for (let level = 1; level <= levels; level++) {
        const levelRadius = radius * (level / levels);
        ctx.beginPath();
        for (let i = 0; i <= numDimensions; i++) {
            const angle = (i / numDimensions) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + Math.cos(angle) * levelRadius;
            const y = centerY + Math.sin(angle) * levelRadius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    for (let i = 0; i < numDimensions; i++) {
        const angle = (i / numDimensions) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
    }
    
    // Draw data polygon
    ctx.beginPath();
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i <= numDimensions; i++) {
        const idx = i % numDimensions;
        const value = values[idx];
        const angle = (i / numDimensions) * Math.PI * 2 - Math.PI / 2;
        const r = radius * (value / 100);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#6366f1';
    for (let i = 0; i < numDimensions; i++) {
        const value = values[i];
        const angle = (i / numDimensions) * Math.PI * 2 - Math.PI / 2;
        const r = radius * (value / 100);
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#0b1220';
    ctx.font = '500 11px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numDimensions; i++) {
        const angle = (i / numDimensions) * Math.PI * 2 - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        const label = dimensions[i].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        ctx.fillText(label, x, y);
        
        // Value
        ctx.font = 'bold 11px Inter, system-ui';
        ctx.fillText(`${values[i].toFixed(0)}%`, x, y + 14);
        ctx.font = '500 11px Inter, system-ui';
    }
}

// ============================================================================
// 4. AGREEMENT HEATMAP
// ============================================================================

/**
 * Draw model agreement heatmap
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array} agreementMatrix - 2D array of agreement scores
 * @param {Array} modelNames - Array of model names
 */
function drawAgreementHeatmap(canvas, agreementMatrix, modelNames) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const width = 400;
    const height = 400;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    const padding = 80;
    const cellSize = (width - padding * 2) / modelNames.length;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw cells
    for (let i = 0; i < modelNames.length; i++) {
        for (let j = 0; j < modelNames.length; j++) {
            const value = agreementMatrix[i][j];
            const x = padding + j * cellSize;
            const y = padding + i * cellSize;
            
            // Color based on agreement
            const color = getAgreementColor(value);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize, cellSize);
            
            // Border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cellSize, cellSize);
            
            // Text
            ctx.fillStyle = value > 0.5 ? '#ffffff' : '#000000';
            ctx.font = 'bold 14px Inter, system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((value * 100).toFixed(0) + '%', x + cellSize / 2, y + cellSize / 2);
        }
    }
    
    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#0b1220';
    ctx.font = '500 12px Inter, system-ui';
    
    // Column labels (top)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let j = 0; j < modelNames.length; j++) {
        const x = padding + j * cellSize + cellSize / 2;
        const y = padding - 10;
        ctx.fillText(getShortModelName(modelNames[j]), x, y);
    }
    ctx.restore();
    
    // Row labels (left)
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < modelNames.length; i++) {
        const x = padding - 10;
        const y = padding + i * cellSize + cellSize / 2;
        ctx.fillText(getShortModelName(modelNames[i]), x, y);
    }
    ctx.restore();
}

/**
 * Get color for agreement value
 */
function getAgreementColor(value) {
    // Red (low agreement) to Green (high agreement)
    if (value >= 0.9) return '#10b981';
    if (value >= 0.8) return '#84cc16';
    if (value >= 0.7) return '#eab308';
    if (value >= 0.6) return '#f97316';
    return '#ef4444';
}

/**
 * Get shortened model name
 */
function getShortModelName(name) {
    const short = {
        'Pinpoint Transformer': 'Pinpoint',
        'EfficientNet-B4': 'EfficientNet',
        'ResNet-50': 'ResNet',
        'XceptionNet': 'Xception',
        'MesoNet': 'Meso'
    };
    return short[name] || name;
}

// ============================================================================
// 5. CSS STYLES (Add to your styles.css)
// ============================================================================

const CSS_STYLES = `
/* Model Comparison Bars */
.model-comparison-bars {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 16px;
}

.model-bar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.model-bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.model-name {
    font-weight: 600;
    color: var(--text);
}

.model-confidence {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
}

.model-confidence.very_high { background: #10b981; color: white; }
.model-confidence.high { background: #84cc16; color: white; }
.model-confidence.medium { background: #eab308; color: #0b1220; }
.model-confidence.low { background: #f97316; color: white; }
.model-confidence.very_low { background: #ef4444; color: white; }

.model-bar-container {
    position: relative;
    height: 32px;
    background: rgba(148, 163, 184, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.model-bar {
    height: 100%;
    border-radius: 8px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.model-bar-label {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    font-size: 14px;
    color: var(--text);
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
}

.model-explanation {
    font-size: 13px;
    color: rgba(148, 163, 184, 0.9);
    padding-left: 4px;
}

/* Consensus Section */
.consensus-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
}

.confidence-badge,
.agreement-badge {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
}

/* Breakdown Section */
.breakdown-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 16px;
}

.breakdown-list .item {
    padding: 12px;
    background: rgba(148, 163, 184, 0.1);
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
}
`;

/**
 * Main function to render all ensemble visualizations from API response
 * @param {Object} response - The API response containing ensemble data
 */
window.renderEnsembleVisualizations = function(response) {
    const ensembleContainer = document.getElementById('ensembleResults');
    
    // Check if ensemble data exists in response
    if (!response || !response.ensemble_confidence || !response.model_predictions) {
        if (ensembleContainer) {
            ensembleContainer.style.display = 'none';
        }
        return;
    }
    
    const numModels = response.model_predictions.length;
    
    // For single model, hide ensemble visualizations (use standard result display)
    if (numModels < 2) {
        if (ensembleContainer) {
            ensembleContainer.style.display = 'none';
        }
        return;
    }
    
    // Show ensemble container for multi-model scenarios
    if (ensembleContainer) {
        ensembleContainer.style.display = 'block';
    }
    
    // 1. Draw Manipulation Gauge
    const gaugeCanvas = document.getElementById('manipulationGauge');
    if (gaugeCanvas && typeof response.ensemble_confidence === 'number') {
        const manipulationPercentage = response.ensemble_confidence * 100;
        drawManipulationGauge(gaugeCanvas, manipulationPercentage);
    }
    
    // 2. Render Model Comparison Bars
    const barsCanvas = document.getElementById('modelComparisonBars');
    if (barsCanvas && Array.isArray(response.model_predictions)) {
        renderModelComparisonBars(barsCanvas, response.model_predictions);
    }
    
    // 3. Draw Agreement Heatmap (only for 2+ models)
    const heatmapCanvas = document.getElementById('agreementHeatmap');
    if (heatmapCanvas && Array.isArray(response.agreement_matrix) && numModels >= 2) {
        const modelNames = response.model_predictions.map(m => m.model_name || m.model);
        drawAgreementHeatmap(heatmapCanvas, response.agreement_matrix, modelNames);
    }
    
    // 4. Draw Radar Chart (Detection Breakdown)
    const radarCanvas = document.getElementById('radarChart');
    if (radarCanvas && response.consensus_details) {
        const breakdown = response.consensus_details;
        drawRadarChart(radarCanvas, breakdown);
    }
};

// Export functions to window object for browser use
window.drawManipulationGauge = drawManipulationGauge;
window.renderModelComparisonBars = renderModelComparisonBars;
window.drawRadarChart = drawRadarChart;
window.drawAgreementHeatmap = drawAgreementHeatmap;
window.getManipulationColor = getManipulationColor;
window.getManipulationLevel = getManipulationLevel;

console.log('✅ Multi-model visualization functions exported to window:', {
    drawManipulationGauge: typeof window.drawManipulationGauge,
    renderModelComparisonBars: typeof window.renderModelComparisonBars,
    drawRadarChart: typeof window.drawRadarChart,
    drawAgreementHeatmap: typeof window.drawAgreementHeatmap
});

// Export functions for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        drawManipulationGauge,
        renderModelComparisonBars,
        drawRadarChart,
        drawAgreementHeatmap,
        getManipulationColor,
        getManipulationLevel,
        renderEnsembleVisualizations: window.renderEnsembleVisualizations
    };
}
