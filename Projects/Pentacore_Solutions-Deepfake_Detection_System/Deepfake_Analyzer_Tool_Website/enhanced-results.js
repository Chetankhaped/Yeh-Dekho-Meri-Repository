/**
 * Enhanced Results Rendering for Multi-Model Ensemble
 * Shows manipulation percentages, comparisons, and beautiful visualizations
 */

/**
 * Main enhanced results renderer - replaces standard renderResults
 */
function renderEnhancedResults(r) {
    const box = document.getElementById('results');
    const techCard = document.getElementById('technicalDetailsCard');
    
    if (!box) return;
    
    box.innerHTML = '';
    
    if (!r) {
        box.textContent = 'No result';
        // Hide technical details card when no results
        if (techCard) techCard.style.display = 'none';
        return;
    }

    // Enable action buttons
    const dl = document.getElementById('btnDownloadZip');
    if (dl) {
        dl.hidden = false;
        dl.onclick = () => downloadResultZip(r);
    }
    const ex = document.getElementById('btnExplain');
    if (ex) {
        ex.hidden = false;
        ex.onclick = () => openExplainModal(r);
    }

    // Check if we have ensemble data
    const hasEnsemble = r.ensemble_confidence !== undefined && Array.isArray(r.model_predictions) && r.model_predictions.length > 0;

    if (hasEnsemble) {
        renderEnsembleResults(r, box);
    } else {
        // Fallback to single model rendering
        renderSingleModelResults(r, box);
        // Also try to render technical details for single model
        if (techCard) {
            renderTechnicalDetailsCard(r);
        }
    }
}

/**
 * Render results for ensemble (multiple models)
 */
function renderEnsembleResults(r, container) {
    // Show and populate the technical details card
    renderTechnicalDetailsCard(r);
    
    // Create main dashboard layout
    const dashboard = document.createElement('div');
    dashboard.style.cssText = 'max-width: 1400px; margin: 0 auto;';
    
    // 1. Model Comparison Section (Clean Cards)
    // Extract expected models from ensemble_models if available
    const expectedModels = r.ensemble_models || ['pinpoint', 'vgg16_v1', 'vgg16_v2'];
    const comparisonSection = createModelComparisonSection(r.model_predictions, expectedModels, r);
    dashboard.appendChild(comparisonSection);
    
    // 2. Detailed Visualizations (Original analysis) - with model selector
    appendOriginalVisualizations(r, dashboard);
    
    container.appendChild(dashboard);
}

/**
 * Render technical details in the separate card above results
 */
function renderTechnicalDetailsCard(r) {
    const card = document.getElementById('technicalDetailsCard');
    const content = document.getElementById('technicalDetailsContent');
    
    if (!card || !content) return;
    
    // Show the card
    card.style.display = 'block';
    
    // Clear previous content
    content.innerHTML = '';
    
    // Create technical details grid
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        padding: 20px;
    `;
    
    // Collect technical details
    const details = [];
    
    if (r.video_meta) {
        if (r.video_meta.fps) details.push(['FPS', r.video_meta.fps.toFixed(2)]);
        if (r.video_meta.total_frames) details.push(['Total Frames', r.video_meta.total_frames]);
        if (r.video_meta.duration_sec) details.push(['Duration', `${r.video_meta.duration_sec.toFixed(2)} s`]);
        if (r.video_meta.width && r.video_meta.height) {
            details.push(['Resolution', `${r.video_meta.width}×${r.video_meta.height}`]);
        }
    }
    
    if (r.laplacian_pred !== undefined && r.laplacian_pred !== null) {
        // Handle different laplacian_pred formats
        if (typeof r.laplacian_pred === 'number') {
            details.push(['Sharpness Score', r.laplacian_pred.toFixed(2)]);
        } else if (typeof r.laplacian_pred === 'object' && r.laplacian_pred.sharpness_series) {
            // If it's an object with sharpness_series, calculate average
            const series = r.laplacian_pred.sharpness_series;
            if (Array.isArray(series) && series.length > 0) {
                const avg = series.reduce((a, b) => a + b, 0) / series.length;
                details.push(['Avg Sharpness', avg.toFixed(2)]);
            }
        }
    }
    
    if (r.model_predictions && r.model_predictions.length > 0) {
        details.push(['Models Used', r.model_predictions.length]);
    }
    
    if (r.consensus_details) {
        if (r.consensus_details.agreement_count !== undefined) {
            details.push(['Agreement Count', `${r.consensus_details.agreement_count}/${r.model_predictions.length}`]);
        }
        if (r.consensus_details.unanimous !== undefined) {
            details.push(['Unanimous', r.consensus_details.unanimous ? 'Yes' : 'No']);
        }
    }
    
    // Render detail items
    details.forEach(([label, value]) => {
        const item = document.createElement('div');
        item.style.cssText = `
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid rgba(59, 130, 246, 0.1);
        `;
        item.innerHTML = `
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${label}</div>
            <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${value}</div>
        `;
        grid.appendChild(item);
    });
    
    content.appendChild(grid);
}

/**
 * Create dashboard header with ensemble verdict
 */
function createDashboardHeader(r) {
    const header = document.createElement('div');
    header.className = 'card glass';
    header.style.cssText = `
        margin-bottom: 20px;
        padding: 32px;
        text-align: center;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));
    `;
    
    // Handle both percentage (0-100) and decimal (0-1) formats
    const confidenceValue = r.ensemble_confidence > 1 ? r.ensemble_confidence / 100 : r.ensemble_confidence;
    const manipulationPct = (confidenceValue * 100).toFixed(1);
    const isManipulated = confidenceValue > 0.5;
    const confidenceLevel = getConfidenceLevel(confidenceValue);
    const color = getManipulationColorRGB(confidenceValue);
    
    const numModels = r.model_predictions ? r.model_predictions.length : 0;
    
    header.innerHTML = `
        <div style="font-size: 14px; color: #64748b; margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            🤖 Ensemble Analysis (${numModels} Model${numModels !== 1 ? 's' : ''})
        </div>
        <div style="font-size: 64px; font-weight: 800; color: ${color}; margin: 16px 0; line-height: 1;">
            ${manipulationPct}%
        </div>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
            ${isManipulated ? '⚠️ Manipulation Detected' : '✅ Appears Authentic'}
        </div>
        <div style="font-size: 14px; color: #64748b;">
            Confidence: <strong>${confidenceLevel}</strong>
        </div>
    `;
    
    return header;
}

/**
 * Create model comparison section with clean cards
 */
function createModelComparisonSection(predictions, expectedModels, resultData) {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 24px;';
    
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1e293b;';
    title.textContent = '📊 Model Comparison';
    section.appendChild(title);
    
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
    `;
    
    // Create cards for all predictions
    predictions.forEach((pred, index) => {
        const card = createModelCard(pred, index);
        grid.appendChild(card);
    });
    
    // Add placeholder cards for missing models (if expected models provided)
    if (expectedModels && expectedModels.length > predictions.length) {
        const presentModels = predictions.map(p => (p.model_name || p.model || '').toLowerCase());
        expectedModels.forEach(modelName => {
            const modelLower = modelName.toLowerCase();
            if (!presentModels.includes(modelLower)) {
                // Check if this model has data in model_pred (like Pinpoint)
                const hasModelPredData = resultData && resultData.model_pred && 
                    (modelLower === 'pinpoint' || modelLower === 'default');
                
                if (hasModelPredData) {
                    // Create a success card with model_pred data
                    const modelPredCard = createModelCard({
                        model_name: modelName,
                        model: modelName,
                        confidence: resultData.ensemble_confidence || 0.5,
                        manipulation_percentage: ((resultData.ensemble_confidence || 0.5) > 1 
                            ? resultData.ensemble_confidence 
                            : (resultData.ensemble_confidence || 0.5) * 100),
                        focus_areas: ['audio_sync', 'attention_patterns', 'mel_analysis']
                    }, predictions.length);
                    grid.appendChild(modelPredCard);
                } else {
                    // Create placeholder/failed card
                    const placeholderCard = createPlaceholderModelCard(modelName);
                    grid.appendChild(placeholderCard);
                }
            }
        });
    }
    
    section.appendChild(grid);
    return section;
}

/**
 * Create individual model card
 */
function createModelCard(pred, index) {
    const pct = pred.manipulation_percentage || 0;
    const color = getManipulationColorRGB(pct / 100);
    const modelName = getReadableModelName(pred.model_name || pred.model || `Model ${index + 1}`);
    
    const card = document.createElement('div');
    card.className = 'card glass';
    card.style.cssText = `
        padding: 20px;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    `;
    
    // Add hover effect
    card.onmouseenter = () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    };
    card.onmouseleave = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
    };
    
    // Model name
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-weight: 700; font-size: 16px; margin-bottom: 16px; color: #1e293b;';
    nameDiv.textContent = modelName;
    card.appendChild(nameDiv);
    
    // Percentage display
    const pctDiv = document.createElement('div');
    pctDiv.style.cssText = `
        font-size: 48px;
        font-weight: 800;
        color: ${color};
        margin-bottom: 12px;
        line-height: 1;
    `;
    pctDiv.textContent = `${pct.toFixed(1)}%`;
    card.appendChild(pctDiv);
    
    // Label
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = 'font-size: 14px; color: #64748b; margin-bottom: 16px;';
    labelDiv.textContent = 'Manipulation Probability';
    card.appendChild(labelDiv);
    
    // Progress bar
    const progressBg = document.createElement('div');
    progressBg.style.cssText = `
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: ${color};
        border-radius: 4px;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    progressBg.appendChild(progressBar);
    card.appendChild(progressBg);
    
    // Animate progress bar
    setTimeout(() => {
        progressBar.style.width = `${pct}%`;
    }, 100 + index * 100);
    
    // Focus areas (if available)
    if (pred.focus_areas && pred.focus_areas.length > 0) {
        const areasDiv = document.createElement('div');
        areasDiv.style.cssText = 'font-size: 12px; color: #64748b; line-height: 1.6;';
        areasDiv.innerHTML = pred.focus_areas.map(area => 
            `<span style="display: inline-block; margin-right: 8px;">• ${area}</span>`
        ).join('');
        card.appendChild(areasDiv);
    }
    
    return card;
}

/**
 * Create placeholder card for missing/failed model
 */
function createPlaceholderModelCard(modelName) {
    const readableName = getReadableModelName(modelName);
    
    const card = document.createElement('div');
    card.className = 'card glass';
    card.style.cssText = `
        padding: 20px;
        position: relative;
        overflow: hidden;
        opacity: 0.7;
        border: 2px dashed rgba(239, 68, 68, 0.3);
    `;
    
    // Model name
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-weight: 700; font-size: 16px; margin-bottom: 16px; color: #1e293b;';
    nameDiv.textContent = readableName;
    card.appendChild(nameDiv);
    
    // Error icon and message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        font-size: 48px;
        margin-bottom: 12px;
        line-height: 1;
    `;
    errorDiv.textContent = '⚠️';
    card.appendChild(errorDiv);
    
    // Label
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = 'font-size: 14px; color: #ef4444; margin-bottom: 8px; font-weight: 600;';
    labelDiv.textContent = 'Prediction Failed';
    card.appendChild(labelDiv);
    
    // Description
    const descDiv = document.createElement('div');
    descDiv.style.cssText = 'font-size: 12px; color: #64748b; line-height: 1.5;';
    descDiv.textContent = 'This model encountered an error during analysis. Check logs for details.';
    card.appendChild(descDiv);
    
    return card;
}

/**
 * Create charts section
 */
function createChartsSection(r) {
    const section = document.createElement('div');
    section.className = 'card glass';
    section.style.cssText = 'padding: 24px; margin-bottom: 24px;';
    
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #1e293b;';
    title.textContent = '📈 Visual Analysis';
    section.appendChild(title);
    
    const chartsGrid = document.createElement('div');
    chartsGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
    `;
    
    // Bar Chart Container
    const barChartContainer = document.createElement('div');
    barChartContainer.style.cssText = 'text-align: center;';
    barChartContainer.innerHTML = '<h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #64748b;">Model Predictions</h4>';
    
    const barCanvas = document.createElement('canvas');
    barCanvas.id = 'modelComparisonBars';
    barCanvas.width = 500;
    barCanvas.height = 300;
    barCanvas.style.cssText = 'display: block; margin: 0 auto; max-width: 100%; height: auto;';
    barChartContainer.appendChild(barCanvas);
    chartsGrid.appendChild(barChartContainer);
    
    // Heatmap Container (if multiple models)
    if (r.model_predictions && r.model_predictions.length >= 2 && r.agreement_matrix) {
        const heatmapContainer = document.createElement('div');
        heatmapContainer.style.cssText = 'text-align: center;';
        heatmapContainer.innerHTML = '<h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #64748b;">Model Agreement</h4>';
        
        const heatmapCanvas = document.createElement('canvas');
        heatmapCanvas.id = 'agreementHeatmap';
        heatmapCanvas.width = 400;
        heatmapCanvas.height = 400;
        heatmapCanvas.style.cssText = 'display: block; margin: 0 auto; max-width: 100%; height: auto;';
        heatmapContainer.appendChild(heatmapCanvas);
        chartsGrid.appendChild(heatmapContainer);
    }
    
    section.appendChild(chartsGrid);
    
    // Render charts after DOM insertion
    renderCharts(r);
    
    return section;
}

/**
 * Render charts with proper timing
 */
function renderCharts(r) {
    setTimeout(() => {
        console.log('🎨 Rendering charts...');
        
        // Bar Chart
        const barCanvas = document.getElementById('modelComparisonBars');
        if (barCanvas && r.model_predictions && r.model_predictions.length > 0) {
            try {
                drawBarChart(barCanvas, r.model_predictions);
                console.log('✅ Bar chart rendered');
            } catch (error) {
                console.error('❌ Bar chart error:', error);
            }
        }
        
        // Heatmap
        if (r.agreement_matrix && r.model_predictions && r.model_predictions.length >= 2) {
            const heatmapCanvas = document.getElementById('agreementHeatmap');
            if (heatmapCanvas && typeof drawAgreementHeatmap === 'function') {
                try {
                    const modelNames = r.model_predictions.map(m => m.model_name || m.model);
                    drawAgreementHeatmap(heatmapCanvas, r.agreement_matrix, modelNames);
                    console.log('✅ Heatmap rendered');
                } catch (error) {
                    console.error('❌ Heatmap error:', error);
                }
            }
        }
    }, 200);
}

/**
 * Draw bar chart on canvas
 */
function drawBarChart(canvas, predictions) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const width = 500;
    const height = 300;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    const barHeight = 40;
    const barSpacing = Math.min(70, (chartHeight - barHeight * predictions.length) / (predictions.length + 1));
    
    predictions.forEach((pred, i) => {
        const y = padding + i * (barHeight + barSpacing);
        const pct = pred.manipulation_percentage || 0;
        const barWidth = (pct / 100) * chartWidth;
        
        // Get color
        const color = window.getManipulationColor ? window.getManipulationColor(pct / 100) : '#3b82f6';
        
        // Model name
        ctx.fillStyle = '#475569';
        ctx.font = '14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'left';
        const modelName = getReadableModelName(pred.model_name || pred.model || `Model ${i + 1}`);
        ctx.fillText(modelName, padding, y - 8);
        
        // Background bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(padding, y, chartWidth, barHeight);
        
        // Actual bar with gradient
        const gradient = ctx.createLinearGradient(padding, y, padding + barWidth, y);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, adjustColorBrightness(color, 20));
        ctx.fillStyle = gradient;
        ctx.fillRect(padding, y, barWidth, barHeight);
        
        // Percentage text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${pct.toFixed(1)}%`, padding + Math.max(barWidth / 2, 30), y + barHeight / 2 + 6);
    });
}

/**
 * Adjust color brightness
 */
function adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

/**
 * Create compact technical details
 */
function createCompactTechnicalDetails(r) {
    const section = document.createElement('div');
    section.className = 'card glass';
    section.style.cssText = 'margin-bottom: 24px; overflow: hidden;';
    
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 16px 20px;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s ease;
    `;
    header.innerHTML = `
        <span style="font-weight: 600; font-size: 14px;">🔧 Video/Image Technical Details</span>
        <span style="font-size: 18px; transition: transform 0.3s ease;" id="techToggle">▼</span>
    `;
    
    const content = document.createElement('div');
    content.style.cssText = 'max-height: 0; overflow: hidden; transition: max-height 0.3s ease;';
    
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        padding: 0 20px 20px 20px;
    `;
    
    const details = [];
    if (r.video_meta) {
        if (r.video_meta.fps) details.push({label: 'FPS', value: r.video_meta.fps.toFixed(2)});
        if (r.video_meta.total_frames) details.push({label: 'Frames', value: r.video_meta.total_frames});
        if (r.video_meta.duration_sec) details.push({label: 'Duration', value: `${r.video_meta.duration_sec.toFixed(2)}s`});
    }
    if (r.model_predictions) {
        details.push({label: 'Models', value: r.model_predictions.length});
    }
    
    details.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${item.label}</div>
            <div style="font-size: 18px; font-weight: 700;">${item.value}</div>
        `;
        grid.appendChild(itemDiv);
    });
    
    content.appendChild(grid);
    section.appendChild(header);
    section.appendChild(content);
    
    let isOpen = false;
    header.onclick = () => {
        isOpen = !isOpen;
        content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : '0';
        document.getElementById('techToggle').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    };
    
    return section;
}

/**
 * Old function - keeping for compatibility
 */
function createEnsembleVerdictCard(r) {
    const card = document.createElement('div');
    card.className = 'card glass pop';
    card.style.cssText = 'background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)); margin-bottom: 24px; text-align: center;';

    // Handle both percentage (0-100) and decimal (0-1) formats
    const confidenceValue = r.ensemble_confidence > 1 ? r.ensemble_confidence / 100 : r.ensemble_confidence;
    const manipulationPct = (confidenceValue * 100).toFixed(1);
    const isManipulated = confidenceValue > 0.5;
    const confidenceLevel = getConfidenceLevel(confidenceValue);
    
    const color = getManipulationColorRGB(confidenceValue);
    
    card.innerHTML = `
        <div style="padding: 32px 24px;">
            <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; opacity: 0.8;">
                Ensemble Verdict (${r.model_predictions.length} Models)
            </div>
            <div style="font-size: 72px; font-weight: 800; line-height: 1; margin-bottom: 12px; color: ${color};">
                ${manipulationPct}%
            </div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
                ${isManipulated ? '⚠️ Manipulation Detected' : '✅ Likely Authentic'}
            </div>
            <div style="font-size: 14px; opacity: 0.7; margin-bottom: 20px;">
                Confidence: ${confidenceLevel}
            </div>
            ${r.consensus_details && r.consensus_details.agreement_count !== undefined ? `
            <div style="display: inline-block; background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 20px; font-size: 13px;">
                ${r.consensus_details.unanimous ? '✓ Unanimous' : `${r.consensus_details.agreement_count}/${r.model_predictions.length} Agreement`}
            </div>
            ` : `
            <div style="display: inline-block; background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 20px; font-size: 13px;">
                ${r.model_predictions.length} Models Analyzed
            </div>
            `}
        </div>
    `;
    
    return card;
}

/**
 * Create grid of individual model cards for comparison
 */
function createModelComparisonGrid(modelPredictions) {
    const section = document.createElement('div');
    section.style.cssText = 'margin-bottom: 32px;';
    
    const header = document.createElement('h4');
    header.textContent = '🤖 Individual Model Analysis';
    header.style.cssText = 'margin-bottom: 16px; text-align: center;';
    section.appendChild(header);
    
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;';
    
    modelPredictions.forEach(model => {
        const card = createIndividualModelCard(model);
        grid.appendChild(card);
    });
    
    section.appendChild(grid);
    return section;
}

/**
 * Create a single model's prediction card
 */
function createIndividualModelCard(model) {
    // Handle both percentage (0-100) and decimal (0-1) formats
    const confidenceValue = model.confidence > 1 ? model.confidence / 100 : model.confidence;
    const manipulationPct = (confidenceValue * 100).toFixed(1);
    const modelName = formatModelName(model.model_name || model.model);
    const color = getManipulationColorRGB(confidenceValue);
    
    const card = document.createElement('div');
    card.className = 'card glass';
    card.style.cssText = `
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        border: 2px solid rgba(255,255,255,0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: default;
    `;
    
    card.onmouseenter = function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
    };
    card.onmouseleave = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '';
    };
    
    card.innerHTML = `
        <div style="padding: 20px;">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px; opacity: 0.8;">
                ${modelName}
            </div>
            <div style="font-size: 48px; font-weight: 800; line-height: 1; margin-bottom: 8px; color: ${color};">
                ${manipulationPct}%
            </div>
            <div style="font-size: 12px; opacity: 0.6; margin-bottom: 12px;">
                Manipulation Probability
            </div>
            ${model.focus_areas ? `
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;">
                ${model.focus_areas.map(area => `
                    <span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${area.replace(/_/g, ' ')}
                    </span>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

/**
 * Create visualizations section with charts and heatmaps
 */
function createVisualizationsSection(r) {
    const section = document.createElement('div');
    section.className = 'card glass';
    section.style.cssText = 'margin-bottom: 24px; padding: 24px;';
    
    const header = document.createElement('h4');
    header.textContent = '📊 Visual Analysis';
    header.style.cssText = 'margin-bottom: 20px; text-align: center;';
    section.appendChild(header);
    
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 32px;';
    
    // 1. Model Comparison Bar Chart
    const barsContainer = document.createElement('div');
    barsContainer.innerHTML = '<h5 style="margin-bottom: 12px; text-align: center; font-size: 14px;">Model Predictions Comparison</h5>';
    const barsCanvas = document.createElement('canvas');
    barsCanvas.id = 'modelComparisonBars';
    barsCanvas.width = 600;
    barsCanvas.height = 400;
    barsCanvas.style.cssText = 'display: block; margin: 0 auto; max-width: 100%;';
    barsContainer.appendChild(barsCanvas);
    grid.appendChild(barsContainer);
    
    // 2. Agreement Heatmap (if multiple models)
    if (r.agreement_matrix && r.model_predictions.length >= 2) {
        const heatmapContainer = document.createElement('div');
        heatmapContainer.innerHTML = '<h5 style="margin-bottom: 12px; text-align: center; font-size: 14px;">Model Agreement Matrix</h5>';
        const heatmapCanvas = document.createElement('canvas');
        heatmapCanvas.id = 'agreementHeatmap';
        heatmapCanvas.width = 500;
        heatmapCanvas.height = 500;
        heatmapCanvas.style.cssText = 'display: block; margin: 0 auto; max-width: 100%;';
        heatmapContainer.appendChild(heatmapCanvas);
        grid.appendChild(heatmapContainer);
    }
    
    section.appendChild(grid);
    
    // Render visualizations after DOM insertion
    setTimeout(() => {
        console.log('🎨 Attempting to render visualizations...');
        console.log('  renderModelComparisonBars available?', typeof renderModelComparisonBars);
        console.log('  drawAgreementHeatmap available?', typeof drawAgreementHeatmap);
        console.log('  model_predictions:', r.model_predictions);
        console.log('  agreement_matrix:', r.agreement_matrix);
        console.log('  Number of models:', r.model_predictions ? r.model_predictions.length : 0);
        
        // Bar Chart - Model Comparison
        if (typeof renderModelComparisonBars === 'function') {
            const canvas = document.getElementById('modelComparisonBars');
            console.log('  Bar chart canvas found:', !!canvas);
            if (canvas && r.model_predictions && r.model_predictions.length > 0) {
                try {
                    // Call as canvas-based renderer
                    if (canvas.tagName === 'CANVAS') {
                        // Use the canvas drawing function from multi-model-visualizations.js
                        const ctx = canvas.getContext('2d');
                        const dpr = window.devicePixelRatio || 1;
                        canvas.width = 600 * dpr;
                        canvas.height = 400 * dpr;
                        canvas.style.width = '600px';
                        canvas.style.height = '400px';
                        ctx.scale(dpr, dpr);
                        
                        // Clear canvas
                        ctx.clearRect(0, 0, 600, 400);
                        
                        // Draw bars manually
                        const padding = 60;
                        const chartWidth = 600 - 2 * padding;
                        const chartHeight = 400 - 2 * padding;
                        const barHeight = 40;
                        const barSpacing = 60;
                        
                        r.model_predictions.forEach((pred, i) => {
                            const y = padding + i * barSpacing;
                            const pct = pred.manipulation_percentage || 0;
                            const barWidth = (pct / 100) * chartWidth;
                            
                            // Get color based on manipulation percentage
                            const color = window.getManipulationColor ? window.getManipulationColor(pct / 100) : '#3b82f6';
                            
                            // Draw model name
                            ctx.fillStyle = '#e2e8f0';
                            ctx.font = '14px system-ui';
                            ctx.textAlign = 'left';
                            ctx.fillText(pred.model_name || pred.model || `Model ${i+1}`, padding, y - 8);
                            
                            // Draw background bar
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                            ctx.fillRect(padding, y, chartWidth, barHeight);
                            
                            // Draw actual bar
                            ctx.fillStyle = color;
                            ctx.fillRect(padding, y, barWidth, barHeight);
                            
                            // Draw percentage text
                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 16px system-ui';
                            ctx.textAlign = 'center';
                            ctx.fillText(`${pct.toFixed(1)}%`, padding + barWidth / 2, y + barHeight / 2 + 6);
                        });
                        
                        console.log('  ✅ Bar chart rendered successfully');
                    } else {
                        // Original container-based rendering
                        renderModelComparisonBars(canvas, r.model_predictions);
                        console.log('  ✅ Bar chart rendered successfully (container mode)');
                    }
                } catch (error) {
                    console.error('  ❌ Bar chart rendering failed:', error);
                }
            } else {
                console.warn('  ⚠️ Canvas not found or no model predictions');
            }
        } else {
            console.warn('  ⚠️ renderModelComparisonBars function not found');
        }
        
        // Heatmap - Agreement Matrix
        if (r.agreement_matrix && typeof drawAgreementHeatmap === 'function') {
            const canvas = document.getElementById('agreementHeatmap');
            console.log('  Heatmap canvas found:', !!canvas);
            if (canvas) {
                try {
                    const modelNames = r.model_predictions.map(m => m.model_name || m.model);
                    console.log('  Model names for heatmap:', modelNames);
                    drawAgreementHeatmap(canvas, r.agreement_matrix, modelNames);
                    console.log('  ✅ Heatmap rendered successfully');
                } catch (error) {
                    console.error('  ❌ Heatmap rendering failed:', error);
                }
            }
        } else if (!r.agreement_matrix) {
            console.warn('  ⚠️ No agreement_matrix in response');
        } else {
            console.warn('  ⚠️ drawAgreementHeatmap function not found');
        }
    }, 200);
    
    return section;
}

/**
 * Create collapsible technical details section
 */
function createTechnicalDetailsSection(r) {
    const section = document.createElement('div');
    section.className = 'card glass';
    section.style.cssText = 'margin-bottom: 24px;';
    
    const header = document.createElement('div');
    header.style.cssText = 'padding: 16px 20px; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
        <span style="font-weight: 600;">🔧 Video/Image Technical Details</span>
        <span style="font-size: 20px; transition: transform 0.3s;">▼</span>
    `;
    
    const content = document.createElement('div');
    content.style.cssText = 'padding: 0 20px; max-height: 0; overflow: hidden; transition: max-height 0.3s, padding 0.3s;';
    
    let isExpanded = false;
    header.onclick = () => {
        isExpanded = !isExpanded;
        if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.paddingTop = '20px';
            content.style.paddingBottom = '20px';
            header.querySelector('span:last-child').style.transform = 'rotate(180deg)';
        } else {
            content.style.maxHeight = '0';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            header.querySelector('span:last-child').style.transform = 'rotate(0deg)';
        }
    };
    
    // Build technical details content
    const details = [];
    if (r.video_meta) {
        if (r.video_meta.fps) details.push(['FPS', r.video_meta.fps.toFixed(2)]);
        if (r.video_meta.total_frames) details.push(['Total Frames', r.video_meta.total_frames]);
        if (r.video_meta.duration_sec) details.push(['Duration', `${r.video_meta.duration_sec.toFixed(2)} s`]);
    }
    if (r.consensus_details && r.consensus_details.agreement_count !== undefined) {
        details.push(['Agreement Count', `${r.consensus_details.agreement_count}/${r.model_predictions.length}`]);
        details.push(['Unanimous', r.consensus_details.unanimous ? 'Yes' : 'No']);
    } else {
        details.push(['Models Used', r.model_predictions.length]);
    }
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${details.map(([key, value]) => `
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
                    <div style="font-size: 11px; opacity: 0.6; margin-bottom: 4px;">${key}</div>
                    <div style="font-size: 16px; font-weight: 600;">${value}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    section.appendChild(header);
    section.appendChild(content);
    return section;
}

/**
 * Fallback rendering for single model (no ensemble)
 */
function renderSingleModelResults(r, container) {
    // Use existing renderResults logic for single model
    // This maintains backward compatibility
    container.innerHTML = '<div style="text-align: center; padding: 40px; opacity: 0.7;">Single model results (legacy rendering)</div>';
}

/**
 * Helper: Format model names for display
 */
function formatModelName(name) {
    const nameMap = {
        'pinpoint': 'Pinpoint Transformer',
        'efficientnet_b4': 'EfficientNet-B4',
        'resnet50_v1': 'ResNet-50 v1',
        'resnet50_v2': 'ResNet-50 v2',
        'vgg16_v1': 'VGG16 v1',
        'vgg16_v2': 'VGG16 v2',
        'inceptionv3': 'InceptionV3'
    };
    return nameMap[name] || name.toUpperCase();
}

/**
 * Helper: Get confidence level description
 */
function getConfidenceLevel(confidence) {
    const abs = Math.abs(confidence - 0.5);
    if (abs > 0.4) return 'Very High';
    if (abs > 0.3) return 'High';
    if (abs > 0.2) return 'Moderate';
    if (abs > 0.1) return 'Low';
    return 'Very Low';
}

/**
 * Helper: Get color based on manipulation probability
 */
function getManipulationColorRGB(confidence) {
    if (confidence < 0.3) return 'rgb(34, 197, 94)'; // Green
    if (confidence < 0.5) return 'rgb(132, 204, 22)'; // Light green
    if (confidence < 0.7) return 'rgb(251, 191, 36)'; // Yellow
    if (confidence < 0.85) return 'rgb(251, 146, 60)'; // Orange
    return 'rgb(239, 68, 68)'; // Red
}

/**
 * Render VGG16 model information showing analysis parameters and methodology
 */
function renderVGG16ModelInfo(modelData, container) {
    // Debug: Log the model data structure
    console.log('🔍 VGG16 Model Data:', modelData.name);
    console.log('  frame_scores:', modelData.data.frame_scores ? `Array of ${modelData.data.frame_scores.length}` : 'None');
    console.log('  statistics:', modelData.data.statistics);
    console.log('  focus_areas:', modelData.data.focus_areas);
    
    // Define model-specific parameters
    // Note: manipulation_percentage is already 0-100, confidence is 0-1
    const rawConfidence = modelData.data.confidence || 0.5;
    const manipulationPercentage = modelData.data.manipulation_percentage || (rawConfidence * 100);
    
    // Normalize confidence to 0-1 range if it's > 1 (means it's already a percentage)
    const normalizedConfidence = manipulationPercentage > 1 ? manipulationPercentage / 100 : manipulationPercentage;
    
    const modelParams = {
        vgg16_v1: {
            name: 'VGG16 v1',
            confidence: normalizedConfidence,
            manipulation: manipulationPercentage,
            features: [
                { icon: '🎨', name: 'Texture Patterns', key: 'texture_patterns' },
                { icon: '📐', name: 'Edge Detection', key: 'edge_detection' },
                { icon: '🌈', name: 'Color Consistency', key: 'color_consistency' }
            ],
            description: 'VGG16 v1 analyzes visual artifacts through texture pattern recognition, edge detection algorithms, and color consistency analysis across frames.',
            methodology: [
                'Extracts hierarchical texture features using deep convolutional layers',
                'Applies Sobel and Canny edge detection to identify manipulation boundaries',
                'Analyzes color histogram distributions and consistency across temporal sequences',
                'Uses transfer learning from ImageNet to identify unnatural visual patterns'
            ]
        },
        vgg16_v2: {
            name: 'VGG16 v2',
            confidence: normalizedConfidence,
            manipulation: manipulationPercentage,
            features: [
                { icon: '🎨', name: 'Texture Patterns', key: 'texture_patterns' },
                { icon: '📊', name: 'Gradient Analysis', key: 'gradient_analysis' },
                { icon: '🔍', name: 'Artifacts Detection', key: 'artifacts' }
            ],
            description: 'VGG16 v2 focuses on gradient-based anomaly detection, texture analysis, and compression artifact identification to detect manipulations.',
            methodology: [
                'Analyzes spatial gradients to detect unnatural transitions and blending',
                'Identifies JPEG compression artifacts and re-compression patterns',
                'Examines texture discontinuities using Gabor filters and Local Binary Patterns',
                'Detects frequency domain anomalies indicating digital manipulation'
            ]
        }
    };
    
    const params = modelParams[modelData.name] || modelParams.vgg16_v1;
    
    // Create main info card
    const infoCard = document.createElement('div');
    infoCard.className = 'card glass';
    infoCard.style.cssText = 'margin-bottom: 20px; padding: 24px;';
    
    // Model header
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; gap: 16px; text-align: center;';
    
    const titleSection = document.createElement('div');
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 8px 0; font-size: 24px; color: #3b82f6; font-weight: 700;';
    title.innerHTML = `🔍 ${params.name} Analysis`;
    titleSection.appendChild(title);
    
    const subtitle = document.createElement('p');
    subtitle.style.cssText = 'margin: 0; color: #64748b; font-size: 14px; max-width: 600px;';
    subtitle.textContent = params.description;
    titleSection.appendChild(subtitle);
    
    // Confidence badge
    const confidenceBadge = document.createElement('div');
    confidenceBadge.style.cssText = `
        background: linear-gradient(135deg, ${getManipulationColorRGB(params.confidence)}, ${getManipulationColorRGB(params.confidence)}dd);
        color: #1e293b;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        text-align: center;
        min-width: 120px;
    `;
    confidenceBadge.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 4px; font-weight: 800;">${params.manipulation.toFixed(1)}%</div>
        <div style="font-size: 12px; opacity: 0.8; font-weight: 600;">Manipulation</div>
    `;
    
    header.appendChild(titleSection);
    header.appendChild(confidenceBadge);
    infoCard.appendChild(header);
    
    // Analysis Features
    const featuresTitle = document.createElement('h4');
    featuresTitle.style.cssText = 'margin: 24px 0 16px 0; font-size: 16px; color: #1e293b;';
    featuresTitle.textContent = '📊 Analysis Features';
    infoCard.appendChild(featuresTitle);
    
    const featuresGrid = document.createElement('div');
    featuresGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px;';
    
    params.features.forEach(feature => {
        const featureCard = document.createElement('div');
        featureCard.style.cssText = `
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
        `;
        featureCard.innerHTML = `
            <div style="font-size: 28px;">${feature.icon}</div>
            <div>
                <div style="font-weight: 600; color: #1e293b; font-size: 14px;">${feature.name}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Active</div>
            </div>
        `;
        featuresGrid.appendChild(featureCard);
    });
    
    infoCard.appendChild(featuresGrid);
    
    // Methodology
    const methodologyTitle = document.createElement('h4');
    methodologyTitle.style.cssText = 'margin: 24px 0 16px 0; font-size: 16px; color: #1e293b;';
    methodologyTitle.textContent = '🔬 Detection Methodology';
    infoCard.appendChild(methodologyTitle);
    
    const methodologyList = document.createElement('div');
    methodologyList.style.cssText = 'background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;';
    
    params.methodology.forEach((step, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.style.cssText = 'display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start;';
        if (idx === params.methodology.length - 1) stepDiv.style.marginBottom = '0';
        
        stepDiv.innerHTML = `
            <div style="background: #3b82f6; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0;">${idx + 1}</div>
            <div style="color: #475569; font-size: 14px; line-height: 1.6; padding-top: 2px;">${step}</div>
        `;
        methodologyList.appendChild(stepDiv);
    });
    
    infoCard.appendChild(methodologyList);
    
    // Technical Details
    const techDetails = document.createElement('div');
    techDetails.style.cssText = 'margin-top: 24px; padding-top: 24px; border-top: 2px solid #e2e8f0;';
    
    const techTitle = document.createElement('h4');
    techTitle.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; color: #1e293b;';
    techTitle.textContent = '⚙️ Technical Specifications';
    techDetails.appendChild(techTitle);
    
    const techGrid = document.createElement('div');
    techGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;';
    
    const techSpecs = [
        { label: 'Architecture', value: 'VGG16 (16 layers)' },
        { label: 'Input Resolution', value: '224×224 pixels' },
        { label: 'Feature Extraction', value: 'Convolutional Layers' },
        { label: 'Classification', value: 'Fully Connected Layers' },
        { label: 'Training Dataset', value: 'Deepfake Detection Corpus' },
        { label: 'Manipulation Probability', value: `${params.manipulation.toFixed(1)}%` }
    ];
    
    techSpecs.forEach(spec => {
        const specDiv = document.createElement('div');
        specDiv.style.cssText = 'display: flex; flex-direction: column;';
        specDiv.innerHTML = `
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${spec.label}</div>
            <div style="font-size: 14px; font-weight: 600; color: #1e293b;">${spec.value}</div>
        `;
        techGrid.appendChild(specDiv);
    });
    
    techDetails.appendChild(techGrid);
    infoCard.appendChild(techDetails);
    
    container.appendChild(infoCard);
    
    // Add Frame Scores Visualization (Time Series)
    if (modelData.data.frame_scores && Array.isArray(modelData.data.frame_scores) && modelData.data.frame_scores.length > 0) {
        const frameCard = document.createElement('div');
        frameCard.className = 'card glass';
        frameCard.style.cssText = 'margin-bottom: 20px; padding: 24px;';
        
        const frameTitle = document.createElement('h4');
        frameTitle.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; color: #1e293b;';
        frameTitle.textContent = '📈 Per-Frame Manipulation Scores';
        frameCard.appendChild(frameTitle);
        
        const frameDesc = document.createElement('p');
        frameDesc.style.cssText = 'color: #64748b; font-size: 14px; margin-bottom: 16px;';
        frameDesc.textContent = 'Frame-by-frame analysis showing manipulation probability over time. Higher values indicate greater likelihood of manipulation.';
        frameCard.appendChild(frameDesc);
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 200;
        canvas.style.cssText = 'width: 100%; height: auto; max-width: 800px; display: block; margin: 0 auto;';
        frameCard.appendChild(canvas);
        
        // Draw frame scores chart
        const ctx = canvas.getContext('2d');
        const scores = modelData.data.frame_scores;
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Draw grid lines
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw line chart
        ctx.strokeStyle = getManipulationColorRGB(params.confidence);
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const xStep = chartWidth / (scores.length - 1);
        scores.forEach((score, idx) => {
            const x = padding + idx * xStep;
            const y = canvas.height - padding - (score * chartHeight);
            if (idx === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Fill area under curve
        ctx.fillStyle = getManipulationColorRGB(params.confidence).replace('rgb', 'rgba').replace(')', ', 0.1)');
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fill();
        
        // Draw labels
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Frame Index', canvas.width / 2, canvas.height - 10);
        
        ctx.save();
        ctx.translate(15, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Manipulation Score', 0, 0);
        ctx.restore();
        
        // Add statistics below chart
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0;';
        
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const max = Math.max(...scores);
        const min = Math.min(...scores);
        const variance = scores.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);
        
        [
            { label: 'Average Score', value: (avg * 100).toFixed(1) + '%' },
            { label: 'Max Score', value: (max * 100).toFixed(1) + '%' },
            { label: 'Min Score', value: (min * 100).toFixed(1) + '%' },
            { label: 'Std Deviation', value: (stdDev * 100).toFixed(1) + '%' },
            { label: 'Total Frames', value: scores.length.toString() }
        ].forEach(stat => {
            const statItem = document.createElement('div');
            statItem.innerHTML = `
                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${stat.label}</div>
                <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${stat.value}</div>
            `;
            statsDiv.appendChild(statItem);
        });
        
        frameCard.appendChild(statsDiv);
        container.appendChild(frameCard);
    }
    
    // Add Statistics Visualization
    if (modelData.data.statistics) {
        const statsCard = document.createElement('div');
        statsCard.className = 'card glass';
        statsCard.style.cssText = 'margin-bottom: 20px; padding: 24px;';
        
        const statsTitle = document.createElement('h4');
        statsTitle.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; color: #1e293b;';
        statsTitle.textContent = '📊 Statistical Analysis';
        statsCard.appendChild(statsTitle);
        
        const statsGrid = document.createElement('div');
        statsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;';
        
        Object.entries(modelData.data.statistics).forEach(([key, value]) => {
            const statItem = document.createElement('div');
            statItem.style.cssText = 'background: linear-gradient(135deg, #f8fafc, #f1f5f9); border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px;';
            
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const displayValue = typeof value === 'number' ? value.toFixed(3) : value;
            
            statItem.innerHTML = `
                <div style="font-size: 12px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">${label}</div>
                <div style="font-size: 20px; font-weight: 700; color: #1e293b;">${displayValue}</div>
            `;
            statsGrid.appendChild(statItem);
        });
        
        statsCard.appendChild(statsGrid);
        container.appendChild(statsCard);
    }
    
    // Add heatmap visualizations if available (fallback for models that have them)
    if (modelData.data.heatmaps && Array.isArray(modelData.data.heatmaps) && modelData.data.heatmaps.length > 0) {
        const heatmapCard = document.createElement('div');
        heatmapCard.className = 'card glass';
        heatmapCard.style.cssText = 'margin-bottom: 20px; padding: 24px;';
        
        const heatmapTitle = document.createElement('h4');
        heatmapTitle.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; color: #1e293b;';
        heatmapTitle.textContent = '🎨 Model Heatmaps (Grad-CAM)';
        heatmapCard.appendChild(heatmapTitle);
        
        const heatmapDesc = document.createElement('p');
        heatmapDesc.style.cssText = 'color: #64748b; font-size: 14px; margin-bottom: 16px;';
        heatmapDesc.textContent = 'Gradient-weighted Class Activation Mapping highlights the regions of the image that most influenced the model\'s decision. Warmer colors (red/yellow) indicate higher importance.';
        heatmapCard.appendChild(heatmapDesc);
        
        const heatmapGrid = document.createElement('div');
        heatmapGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;';
        
        modelData.data.heatmaps.forEach((heatmapBase64, idx) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;';
            
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${heatmapBase64}`;
            img.alt = `Grad-CAM #${idx + 1}`;
            img.style.cssText = 'width: 100%; height: auto; display: block;';
            img.title = `Grad-CAM heatmap ${idx + 1} - Click to enlarge`;
            img.style.cursor = 'pointer';
            
            // Add click to view fullscreen
            img.onclick = () => {
                const modal = document.createElement('div');
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; cursor: pointer;';
                const fullImg = document.createElement('img');
                fullImg.src = img.src;
                fullImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 8px;';
                modal.appendChild(fullImg);
                modal.onclick = () => modal.remove();
                document.body.appendChild(modal);
            };
            
            imgContainer.appendChild(img);
            
            const label = document.createElement('div');
            label.style.cssText = 'padding: 8px; background: #f8fafc; text-align: center; font-size: 12px; color: #64748b; font-weight: 600;';
            label.textContent = `Grad-CAM #${idx + 1}`;
            imgContainer.appendChild(label);
            
            heatmapGrid.appendChild(imgContainer);
        });
        
        heatmapCard.appendChild(heatmapGrid);
        container.appendChild(heatmapCard);
    }
    
    // Add lip heatmap visualizations if available
    if (modelData.data.lip_heatmaps && Array.isArray(modelData.data.lip_heatmaps) && modelData.data.lip_heatmaps.length > 0) {
        const lipCard = document.createElement('div');
        lipCard.className = 'card glass';
        lipCard.style.cssText = 'margin-bottom: 20px; padding: 24px;';
        
        const lipTitle = document.createElement('h4');
        lipTitle.style.cssText = 'margin: 0 0 16px 0; font-size: 16px; color: #1e293b;';
        lipTitle.textContent = '👄 Lip Region Overlays';
        lipCard.appendChild(lipTitle);
        
        const lipDesc = document.createElement('p');
        lipDesc.style.cssText = 'color: #64748b; font-size: 14px; margin-bottom: 16px;';
        lipDesc.textContent = 'Focused analysis on the lip/mouth region where deepfake artifacts are most commonly visible, especially for face-swap and lip-sync manipulations.';
        lipCard.appendChild(lipDesc);
        
        const lipGrid = document.createElement('div');
        lipGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;';
        
        modelData.data.lip_heatmaps.forEach((lipBase64, idx) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = 'border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white;';
            
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${lipBase64}`;
            img.alt = `Lip overlay #${idx + 1}`;
            img.style.cssText = 'width: 100%; height: auto; display: block;';
            img.title = `Lip region overlay ${idx + 1} - Click to enlarge`;
            img.style.cursor = 'pointer';
            
            // Add click to view fullscreen
            img.onclick = () => {
                const modal = document.createElement('div');
                modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; cursor: pointer;';
                const fullImg = document.createElement('img');
                fullImg.src = img.src;
                fullImg.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 8px;';
                modal.appendChild(fullImg);
                modal.onclick = () => modal.remove();
                document.body.appendChild(modal);
            };
            
            imgContainer.appendChild(img);
            
            const label = document.createElement('div');
            label.style.cssText = 'padding: 8px; background: #f8fafc; text-align: center; font-size: 12px; color: #64748b; font-weight: 600;';
            label.textContent = `Lip Overlay #${idx + 1}`;
            imgContainer.appendChild(label);
            
            lipGrid.appendChild(imgContainer);
        });
        
        lipCard.appendChild(lipGrid);
        container.appendChild(lipCard);
    }
}

/**
 * Append original detailed visualizations (sparklines, heatmaps, spectrograms, etc.)
 * This preserves all the deep analysis visualizations from the original implementation
 */
function appendOriginalVisualizations(r, container) {
    // Check if we have model predictions with details
    let availableModels = [];
    
    console.log('📊 Checking for detailed visualizations...');
    console.log('  r.model_pred:', r.model_pred ? 'Available' : 'Not available');
    console.log('  r.model_predictions count:', Array.isArray(r.model_predictions) ? r.model_predictions.length : 0);
    
    // Collect all models that have detailed data
    if (r.model_pred) {
        // Try to detect which model this is from (usually Pinpoint for ensemble)
        let modelName = 'default';
        let displayName = 'Model Analysis';
        
        // Check if there's a model name in the data
        if (r.model_pred.model_name) {
            modelName = r.model_pred.model_name;
            displayName = getReadableModelName(r.model_pred.model_name);
        } else if (r.model_name) {
            modelName = r.model_name;
            displayName = getReadableModelName(r.model_name);
        } else {
            // For ensemble, model_pred usually comes from Pinpoint
            modelName = 'pinpoint';
            displayName = 'Pinpoint';
        }
        
        // Find confidence from model_predictions array or root level fields
        let confidence;
        
        // First try to find in model_predictions array
        if (Array.isArray(r.model_predictions)) {
            console.log(`  🔍 Looking for confidence for modelName: "${modelName}"`);
            const predMatch = r.model_predictions.find(p => 
                (p.model_name || p.model || '').toLowerCase() === modelName.toLowerCase()
            );
            if (predMatch) {
                confidence = predMatch.confidence;
                console.log(`  ✅ Found confidence in model_predictions: ${confidence}`);
            }
        }
        
        // If not found and this is Pinpoint, check root level fields
        if (confidence === undefined && modelName.toLowerCase() === 'pinpoint') {
            console.log(`  🔍 Pinpoint not in model_predictions, checking root fields...`);
            console.log(`  🔍 r.ensemble_confidence:`, r.ensemble_confidence);
            console.log(`  🔍 r.model_pred.confidence:`, r.model_pred?.confidence);
            console.log(`  🔍 r.confidence:`, r.confidence);
            
            // Try various possible locations for Pinpoint's confidence
            if (r.model_pred && r.model_pred.confidence !== undefined) {
                confidence = r.model_pred.confidence;
                console.log(`  ✅ Found confidence in r.model_pred.confidence: ${confidence}`);
            } else if (r.ensemble_confidence !== undefined) {
                confidence = r.ensemble_confidence;
                console.log(`  ✅ Using ensemble_confidence: ${confidence}`);
            } else if (r.confidence !== undefined) {
                confidence = r.confidence;
                console.log(`  ✅ Using r.confidence: ${confidence}`);
            }
        }
        
        availableModels.push({ 
            name: modelName, 
            data: r.model_pred, 
            displayName: displayName,
            confidence: confidence  // Add confidence from model_predictions array
        });
        console.log(`  ✅ Added model_pred to availableModels as: ${displayName}, confidence: ${confidence}`);
    }
    
    // Always add all model_predictions to dropdown (with or without details)
    if (Array.isArray(r.model_predictions) && r.model_predictions.length > 0) {
        r.model_predictions.forEach((pred, idx) => {
            // Check if model has visualizations (heatmaps, lip_heatmaps, or details)
            const hasVisualizations = pred.details || pred.heatmaps || pred.lip_heatmaps;
            console.log(`  Model ${idx + 1} (${pred.model_name || pred.model}):`, hasVisualizations ? 'Has visualizations' : 'No visualizations');
            
            // Store the prediction data - either details or the entire prediction object
            // VGG16 models store heatmaps/lip_heatmaps at root level, Pinpoint uses details
            const modelObj = {
                name: pred.model_name || pred.model,
                data: pred.details || pred,  // Use details if available, otherwise entire pred object
                displayName: getReadableModelName(pred.model_name || pred.model),
                confidence: pred.confidence  // Store confidence from prediction for header display
            };
            console.log(`  📊 Storing model: ${modelObj.displayName}, confidence: ${modelObj.confidence}`);
            availableModels.push(modelObj);
        });
    }
    
    let lapSection = null;
    if (r.laplacian_pred) {
        lapSection = r.laplacian_pred;
        console.log('  ✅ Laplacian data available');
    }
    
    console.log(`📊 Total available models with details: ${availableModels.filter(m => m.data).length}`);
    
    // Also add expected models that might be missing (like Pinpoint that failed)
    const expectedModels = r.ensemble_models || ['pinpoint', 'vgg16_v1', 'vgg16_v2'];
    const presentModels = availableModels.map(m => (m.name || '').toLowerCase());
    
    if (Array.isArray(r.model_predictions)) {
        const predictedModels = r.model_predictions.map(p => (p.model_name || p.model || '').toLowerCase());
        expectedModels.forEach(expectedModel => {
            const modelLower = expectedModel.toLowerCase();
            // Only add if not already in availableModels AND not in predictions
            if (!predictedModels.includes(modelLower) && !presentModels.includes(modelLower)) {
                console.log(`➕ Adding missing expected model: ${expectedModel}`);
                availableModels.push({
                    name: expectedModel,
                    data: null,
                    displayName: getReadableModelName(expectedModel),
                    failed: true
                });
            } else {
                console.log(`ℹ️ Model ${expectedModel} already present, skipping`);
            }
        });
    }
    
    console.log(`📋 Final available models: ${availableModels.map(m => m.displayName).join(', ')}`);
    
    // If no detailed data at all, skip
    if (availableModels.length === 0 && !lapSection) {
        console.log('ℹ️ No detailed visualization data available');
        return;
    }
    
    // Create a section header for detailed analysis with dropdown
    const detailedHeader = document.createElement('div');
    detailedHeader.className = 'card glass';
    detailedHeader.style.cssText = 'margin: 32px 0 16px 0; padding: 16px 20px;';
    
    const headerContent = document.createElement('div');
    headerContent.style.cssText = 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;';
    
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0; font-size: 18px;';
    title.textContent = '📊 Detailed Analysis & Visualizations';
    headerContent.appendChild(title);
    
    // Add model selector dropdown if multiple models in predictions (even without details)
    if (availableModels.length > 1 || (Array.isArray(r.model_predictions) && r.model_predictions.length > 1)) {
        console.log('🎛️ Creating model selector dropdown');
        
        const selectorContainer = document.createElement('div');
        selectorContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';
        
        const label = document.createElement('label');
        label.textContent = 'Model:';
        label.style.cssText = 'font-size: 14px; font-weight: 600;';
        selectorContainer.appendChild(label);
        
        const select = document.createElement('select');
        select.id = 'modelSelector';
        select.style.cssText = `
            padding: 8px 32px 8px 12px;
            border-radius: 8px;
            border: 2px solid rgba(0, 0, 0, 0.1);
            background: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        // Add "All Models" option first
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Models';
        select.appendChild(allOption);
        
        // Add individual model options
        if (availableModels.length > 0) {
            availableModels.forEach((model, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = model.displayName;
                select.appendChild(option);
            });
        } else if (Array.isArray(r.model_predictions)) {
            // Fallback: add from model_predictions
            r.model_predictions.forEach((pred, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = getReadableModelName(pred.model_name || pred.model);
                select.appendChild(option);
            });
        }
        
        selectorContainer.appendChild(select);
        headerContent.appendChild(selectorContainer);
        console.log(`✅ Dropdown created with ${select.options.length} options:`, Array.from(select.options).map(o => o.textContent));
    } else {
        console.log(`ℹ️ Not creating dropdown: availableModels=${availableModels.length}, model_predictions=${r.model_predictions ? r.model_predictions.length : 0}`);
    }
    
    detailedHeader.appendChild(headerContent);
    container.appendChild(detailedHeader);
    console.log('✅ Detailed header appended to container');
    
    // Create container for visualizations
    const vizContainer = document.createElement('div');
    vizContainer.id = 'detailedVizContainer';
    container.appendChild(vizContainer);
    
    // Get reference to the select element using querySelector on the container
    const selectorElement = container.querySelector('#modelSelector');
    console.log('🔍 Looking for selector element:', selectorElement ? 'Found ✅' : 'Not found ❌');
    
    // Function to render visualizations for selected model
    const renderModelVisualizations = (modelIndex) => {
        vizContainer.innerHTML = '';
        
        if (modelIndex === 'all') {
            // Show all available visualizations
            console.log('🔄 Rendering all models visualizations');
            renderDetailedVisualizationsForModel(r.model_pred || null, lapSection, vizContainer, r, null);
        } else {
            const modelData = availableModels[modelIndex];
            
            // Check if model has detailed frame-by-frame visualizations (Pinpoint style)
            const hasDetailedVisualizations = modelData && modelData.data && (
                modelData.data.attention_series || 
                modelData.data.attention_map ||
                modelData.data.mel_spectrogram
            );
            
            // Check if this is a VGG16 model
            const isVGG16 = modelData && (modelData.name === 'vgg16_v1' || modelData.name === 'vgg16_v2');
            
            if (!modelData || !modelData.data) {
                console.log('⚠️ No data for:', modelData ? modelData.displayName : 'unknown');
                const noDataMsg = document.createElement('div');
                noDataMsg.className = 'card glass';
                noDataMsg.style.cssText = 'padding: 40px; text-align: center; color: #64748b;';
                noDataMsg.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <div style="font-size: 16px; font-weight: 600; color: #ef4444;">Prediction Failed</div>
                    <div style="font-size: 14px; margin-top: 8px;">This model encountered an error during prediction.</div>
                `;
                vizContainer.appendChild(noDataMsg);
                return;
            }
            
            if (isVGG16) {
                // Show VGG16 model parameters and methodology
                console.log(`📊 Rendering VGG16 model info for: ${modelData.displayName}`);
                renderVGG16ModelInfo(modelData, vizContainer);
            } else if (hasDetailedVisualizations) {
                // Show Pinpoint-style detailed visualizations
                console.log(`🔄 Rendering visualizations for: ${modelData.displayName}`);
                renderDetailedVisualizationsForModel(modelData.data, lapSection, vizContainer, r, modelData);
            } else {
                // Generic fallback
                console.log('⚠️ No visualizations for:', modelData.displayName);
                const noDataMsg = document.createElement('div');
                noDataMsg.className = 'card glass';
                noDataMsg.style.cssText = 'padding: 40px; text-align: center; color: #64748b;';
                noDataMsg.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 16px; font-weight: 600; color: #64748b;">No detailed analysis available</div>
                    <div style="font-size: 14px; margin-top: 8px;">This model completed successfully but doesn't provide detailed visualizations.</div>
                `;
                vizContainer.appendChild(noDataMsg);
            }
        }
    };
    
    // Initial render - show "All Models" view or first model
    renderModelVisualizations('all');
    
    // Add event listener for dropdown if it was created
    if (selectorElement) {
        selectorElement.addEventListener('change', (e) => {
            console.log(`📊 Dropdown changed to: ${e.target.value}`);
            const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
            console.log(`🔄 Rendering model index: ${value}`);
            renderModelVisualizations(value);
        });
        console.log('✅ Model selector event listener added to:', selectorElement.id);
    } else {
        console.log('ℹ️ No model selector created (single model or no models)');
    }
}

/**
 * Render detailed visualizations for a specific model
 */
function renderDetailedVisualizationsForModel(modelSection, lapSection, container, resultData, modelData) {
    
    // Add header with model info and percentage if modelData is provided
    if (modelData && modelData.data) {
        // Get manipulation percentage from confidence field (same as model comparison card)
        console.log('🔍 Pinpoint Header - modelData:', modelData);
        console.log('🔍 Pinpoint Header - modelData.confidence:', modelData.confidence);
        console.log('🔍 Pinpoint Header - modelData.data.manipulation_percentage:', modelData.data.manipulation_percentage);
        const confidenceValue = modelData.confidence !== undefined ? modelData.confidence : (modelData.data.manipulation_percentage || 50);
        console.log('🔍 Pinpoint Header - Final confidenceValue:', confidenceValue);
        const normalizedConfidence = confidenceValue > 1 ? confidenceValue / 100 : confidenceValue;
        const manipulationPercentage = (normalizedConfidence * 100);
        console.log('🔍 Pinpoint Header - Display percentage:', manipulationPercentage);
        
        const header = document.createElement('div');
        header.className = 'card glass';
        header.style.cssText = 'margin-bottom: 20px; padding: 24px;';
        
        const headerContent = document.createElement('div');
        headerContent.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center;';
        
        const titleSection = document.createElement('div');
        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0 0 8px 0; font-size: 24px; color: #3b82f6; font-weight: 700;';
        title.innerHTML = `🔍 ${modelData.displayName} Analysis`;
        titleSection.appendChild(title);
        
        const subtitle = document.createElement('p');
        subtitle.style.cssText = 'margin: 0; color: #64748b; font-size: 14px; max-width: 600px;';
        subtitle.textContent = 'Multi-modal deepfake detection using audio-visual synchronization and attention mechanisms.';
        titleSection.appendChild(subtitle);
        
        // Confidence badge
        const confidenceBadge = document.createElement('div');
        confidenceBadge.style.cssText = `
            background: linear-gradient(135deg, ${getManipulationColorRGB(normalizedConfidence)}, ${getManipulationColorRGB(normalizedConfidence)}dd);
            color: #1e293b;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
            min-width: 120px;
        `;
        confidenceBadge.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 4px; font-weight: 800;">${manipulationPercentage.toFixed(1)}%</div>
            <div style="font-size: 12px; opacity: 0.8; font-weight: 600;">Manipulation</div>
        `;
        
        headerContent.appendChild(titleSection);
        headerContent.appendChild(confidenceBadge);
        header.appendChild(headerContent);
        container.appendChild(header);
    }
    
    // Structured results grid with sections
    const grid = document.createElement('div');
    grid.className = 'result-grid';
    
    // Model: Per-frame attention energy (sparkline) + Attention heatmap
    if (modelSection) {
        if (Array.isArray(modelSection.per_frame_scores) && modelSection.per_frame_scores.length) {
            const sec = createSectionCard('Per-frame Attention Energy (Model)');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 200;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'spark-canvas';
            sec.body.appendChild(canv);
            drawSparkline(canv, modelSection.per_frame_scores, {
                color: '#38bdf8',
                xLabel: 'Frames',
                yLabel: 'Attention',
                xTicks: [0, Math.floor((modelSection.per_frame_scores.length - 1) / 2), modelSection.per_frame_scores.length - 1]
            });
            enableSparklineHover(canv, modelSection.per_frame_scores, {
                color: '#38bdf8',
                xLabel: 'Frames',
                yLabel: 'Attention'
            });
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = 'X: Frames • Y: Attention';
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.attention_map) && modelSection.attention_map.length) {
            const sec = createSectionCard('Attention Map (Audio × Video)');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 250;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'heatmap-canvas';
            sec.body.appendChild(canv);
            drawHeatmapMatrix(canv, modelSection.attention_map, {
                xLabel: 'Frames',
                yLabel: 'Audio steps',
                palette: 'magma'
            });
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = 'X: Frames • Y: Audio steps';
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.mel_spectrogram) && modelSection.mel_spectrogram.length) {
            const sec = createSectionCard('Mel Spectrogram');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 300;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'heatmap-canvas';
            sec.body.appendChild(canv);
            drawHeatmapMatrix(canv, modelSection.mel_spectrogram, {
                xLabel: 'Time',
                yLabel: 'Mel bins',
                palette: 'turbo',
                durationSec: getDurationSec(resultData)
            });
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = 'X: Time (s) • Y: Mel bins';
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.waveform) && modelSection.waveform.length) {
            const sec = createSectionCard('Waveform');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 200;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'spark-canvas';
            sec.body.appendChild(canv);
            const wf = downsample(modelSection.waveform, 1500);
            const dur = getDurationSec(resultData);
            drawSparkline(canv, wf, {
                color: '#60a5fa',
                xLabel: 'Time',
                yLabel: 'Amplitude',
                yClampPercentiles: [0.01, 0.99],
                durationSec: dur
            });
            enableSparklineHover(canv, wf, {
                color: '#60a5fa',
                xLabel: 'Time',
                yLabel: 'Amplitude',
                yClampPercentiles: [0.01, 0.99],
                durationSec: dur
            });
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = 'X: Time (s) • Y: Amplitude';
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.sync_series_audio) && Array.isArray(modelSection.sync_series_mouth)) {
            const sec = createSectionCard('Sync Series (Audio RMS vs Mouth Openness)');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 220;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'spark-canvas';
            sec.body.appendChild(canv);
            const s1 = modelSection.sync_series_audio;
            const s2 = modelSection.sync_series_mouth;
            const dur2 = getDurationSec(resultData);
            drawSparklineMulti(canv, [s1, s2], {
                labels: ['Audio RMS', 'Mouth openness'],
                colors: ['#22d3ee', '#f472b6'],
                xLabel: dur2 ? 'Time' : 'Frames',
                yLabel: 'Normalized',
                durationSec: dur2
            });
            enableSparklineHoverMulti(canv, [s1, s2], {
                labels: ['Audio RMS', 'Mouth openness'],
                colors: ['#22d3ee', '#f472b6'],
                xLabel: dur2 ? 'Time' : 'Frames',
                yLabel: 'Normalized'
            });
            if (typeof modelSection.sync_metric === 'number') {
                const meta = document.createElement('div');
                meta.className = 'muted';
                meta.textContent = `Sync metric (corr): ${modelSection.sync_metric.toFixed(3)} (higher means better sync)`;
                sec.body.appendChild(meta);
            }
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = `X: ${dur2 ? 'Time (s)' : 'Frames'} • Y: Normalized`;
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.heatmaps) && modelSection.heatmaps.length) {
            const sec = createSectionCard('Model Heatmaps (Grad-CAM)');
            const imgs = createImagesGrid(modelSection.heatmaps, 'Model Grad-CAM');
            sec.body.appendChild(imgs);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(modelSection.lip_heatmaps) && modelSection.lip_heatmaps.length) {
            const sec = createSectionCard('Lip Region Overlays');
            const imgs = createImagesGrid(modelSection.lip_heatmaps, 'Lip overlay');
            sec.body.appendChild(imgs);
            grid.appendChild(sec.wrap);
        }
    }
    
    // Laplacian: per-frame sharpness and heatmaps
    if (lapSection) {
        if (Array.isArray(lapSection.sharpness_series) && lapSection.sharpness_series.length) {
            const sec = createSectionCard('Per-frame Sharpness (Variance of Laplacian)');
            const canv = document.createElement('canvas');
            canv.width = 800;
            canv.height = 200;
            canv.style.width = '100%';
            canv.style.height = 'auto';
            canv.className = 'spark-canvas';
            sec.body.appendChild(canv);
            drawSparkline(canv, lapSection.sharpness_series, {
                color: '#a78bfa',
                xLabel: 'Frames',
                yLabel: 'Sharpness'
            });
            enableSparklineHover(canv, lapSection.sharpness_series, {
                color: '#a78bfa',
                xLabel: 'Frames',
                yLabel: 'Sharpness'
            });
            const lg = document.createElement('div');
            lg.className = 'muted';
            lg.textContent = 'X: Frames • Y: Sharpness';
            sec.body.appendChild(lg);
            grid.appendChild(sec.wrap);
        }
        
        if (Array.isArray(lapSection.heatmaps) && lapSection.heatmaps.length) {
            const sec = createSectionCard('Laplacian Heatmaps');
            const imgs = createImagesGrid(lapSection.heatmaps, 'Laplacian heatmap');
            sec.body.appendChild(imgs);
            grid.appendChild(sec.wrap);
        }
    }
    
    if (grid.children.length) {
        container.appendChild(grid);
    }
}

/**
 * Get readable model name
 */
function getReadableModelName(name) {
    if (!name) return 'Unknown Model';
    
    const nameMap = {
        'pinpoint': 'Pinpoint',
        'efficientnet_b4': 'EfficientNet-B4',
        'resnet50_v1': 'ResNet-50 v1',
        'resnet50_v2': 'ResNet-50 v2',
        'vgg16_v1': 'VGG16 v1',
        'vgg16_v2': 'VGG16 v2',
        'inceptionv3': 'InceptionV3'
    };
    
    return nameMap[name.toLowerCase()] || name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to get duration in seconds
function getDurationSec(r) {
    return r && r.video_meta && typeof r.video_meta.duration_sec === 'number' ? r.video_meta.duration_sec : null;
}
