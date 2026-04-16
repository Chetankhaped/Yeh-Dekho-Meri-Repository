// Utilities
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));

const state = {
  engineBase: 'http://localhost:8001',
  engineUploadBase: null,
  creditsBase: 'http://localhost:8003',
  useJwt: false,
  token: null,
  file: null,
  theme: 'light',
  previewUrl: null,
  currentXhr: null,
};

function getTokens(){ try{ const raw=localStorage.getItem('cogTokens'); return raw? JSON.parse(raw): null; }catch{ return null; } }
function getIdToken(){ const t=getTokens(); return t && t.id_token ? t.id_token : null; }
function getAccessToken(){ const t=getTokens(); return t && t.access_token ? t.access_token : null; }
function setUseJwt(val){ state.useJwt = !!val; try{ localStorage.setItem('useJwt', String(state.useJwt)); }catch{} }
function saveBases(){ try{ localStorage.setItem('engineBase', state.engineBase); localStorage.setItem('creditsBase', state.creditsBase); if(state.engineUploadBase) localStorage.setItem('engineUploadBase', state.engineUploadBase); }catch{} }
function loadSaved(){ try{
  const e=localStorage.getItem('engineBase'); if(e) state.engineBase=e;
  const u=localStorage.getItem('engineUploadBase'); if(u) state.engineUploadBase=u;
  const c=localStorage.getItem('creditsBase'); if(c) state.creditsBase=c;
  const uj=localStorage.getItem('useJwt'); if(uj) state.useJwt = uj==='true';
  const th=localStorage.getItem('theme'); if(th) state.theme = th;
}catch{}
}

async function loadRuntime(){
  try{ const r = await fetch('./runtime-config.json', { cache:'no-store' }); if(!r.ok) return; const j = await r.json();
    if(j.engine_base_url) state.engineBase = j.engine_base_url.replace(/\/$/,'');
    if(j.engine_upload_base_url) state.engineUploadBase = j.engine_upload_base_url.replace(/\/$/,'');
    if(j.credits_base_url) state.creditsBase = j.credits_base_url.replace(/\/$/,'');
  }catch{}
}

function authHeaders(){ const h={}; if(state.useJwt){ const at = getAccessToken(); const it = getIdToken(); const token = it || at; if(token) h['Authorization'] = `Bearer ${token}`; }
  return h; }

// Prefer the same base we use for uploads when it differs from API Gateway.
function apiReadBase(){
  const b = (state.engineUploadBase && state.engineUploadBase !== state.engineBase) ? state.engineUploadBase : state.engineBase;
  return (b||'').replace(/\/$/, '');
}

function renderUserBadge(){
  const badge = $('#userBadge');
  const t=getTokens();
  if (t && (t.id_token || t.access_token)){
    // Parse ID token for display name or sub
    try{
      const idt=t.id_token; if(idt){ const body=JSON.parse(atob(idt.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); const name = body['email']||body['cognito:username']||body['username']||body['sub']; badge.textContent = name ? String(name).slice(0,32) : 'Signed In'; return; }
    }catch{}
    badge.textContent = 'Signed In';
  } else {
    badge.textContent = 'Guest';
  }
}

async function pingHealth(){ const el=$('#healthStatus'); const base=state.engineBase.replace(/\/$/,'');
  el.title = `Engine base: ${base}`;
  try{ // Fetch health without auth headers to avoid preflight/CORS issues
    const r = await fetch(base+'/health',{cache:'no-store'});
    el.textContent = r.ok? 'Engine: Healthy' : 'Engine: Unreachable';
    el.classList.toggle('ok', r.ok); el.classList.toggle('bad', !r.ok); }
  catch{ el.textContent='Engine: Unreachable'; el.classList.remove('ok'); el.classList.add('bad'); }
  // Ensemble status card removed - technical details now shown separately
}

async function checkEnsembleStatus(){
  // Function kept for compatibility but no longer renders to UI
  return;
  
  const base = state.engineBase.replace(/\/$/,'');
  try {
    const r = await fetch(base+'/models/info', {cache:'no-store'});
    if (!r.ok) throw new Error('Failed to fetch');
    const data = await r.json();
    
    if (!data.ensemble_enabled) {
      container.innerHTML = '<div class="pill" style="background: rgba(148,163,184,0.2);">❌ Ensemble Disabled - Using single Pinpoint model</div>';
      return;
    }
    
    if (data.status === 'loading') {
      container.innerHTML = `
        <div class="pill" style="background: rgba(59,130,246,0.2); animation: pulse 2s infinite;">
          🔄 Loading ${data.num_models || 4} models in background...
        </div>
        <div class="muted" style="margin-top: 8px; font-size: 12px;">
          This may take 5-10 minutes. The page is fully functional while loading.
        </div>
      `;
    } else if (data.status === 'ready') {
      const models = data.models || [];
      const modelList = models.map(m => `<span class="pill" style="background: rgba(34,197,94,0.2); margin: 4px;">${m.name || m.model_name}</span>`).join('');
      container.innerHTML = `
        <div class="pill" style="background: rgba(34,197,94,0.2);">✅ Ensemble Ready - ${data.num_models} models loaded</div>
        <div style="margin-top: 12px;">
          ${modelList}
        </div>
        <div class="muted" style="margin-top: 8px; font-size: 12px;">
          Multi-model predictions with consensus analysis available
        </div>
      `;
    } else if (data.status === 'error') {
      container.innerHTML = `
        <div class="pill" style="background: rgba(239,68,68,0.2);">⚠️ Ensemble Error</div>
        <div class="muted" style="margin-top: 8px; font-size: 12px;">
          ${data.error || 'Unknown error'} - Falling back to single model
        </div>
      `;
    }
  } catch(e) {
    container.innerHTML = '<div class="pill" style="background: rgba(148,163,184,0.2);">⚠️ Unable to check ensemble status</div>';
  }
}

function wireTabs(){
  $$('.nav-link').forEach(a=>{
    a.addEventListener('click',()=>{
      $$('.nav-link').forEach(x=>x.classList.remove('active'));
      a.classList.add('active');
      const tab = a.getAttribute('data-tab');
      $$('.tab').forEach(t=>t.classList.remove('active'));
      const el = $('#tab-'+tab); if(el) el.classList.add('active');
    });
  });
}

function wireUpload(){
  const drop = $('#drop'); const fi = $('#fileInput'); const btnBrowse = $('#btnBrowse'); const btnAnalyze = $('#btnAnalyze');
  const fileInfo = $('#fileInfo');
  const fileNameEl = $('#fileName');
  function setFile(f){
    // cleanup old preview url
    if(state.previewUrl){ try{ URL.revokeObjectURL(state.previewUrl); }catch{}
      state.previewUrl = null; }
    state.file = f; $('#preview').innerHTML = '';
    if(!f){ btnAnalyze.disabled = true; if(fileInfo) fileInfo.textContent=''; if(fileNameEl) fileNameEl.textContent = 'No file selected'; return; }
    btnAnalyze.disabled = false;
    const isImage = /\.(jpg|jpeg|png|bmp|webp)$/i.test(f.name);
    const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(f.name);
    if(fileNameEl){ fileNameEl.textContent = f.name; }
    if(fileInfo){
      const support = (isImage||isVideo) ? 'Supported' : 'Possibly unsupported format';
      const previewable = isImage ? 'Preview available' : 'Preview not available';
      fileInfo.textContent = `${support} • ${previewable} • ${f.name} (${(f.size/1024/1024).toFixed(2)} MB)`;
    }
    if(isImage){
      const url = URL.createObjectURL(f); state.previewUrl = url;
      const img = new Image(); img.src = url; img.style.maxWidth = '220px'; img.style.borderRadius = '12px';
      $('#preview').appendChild(img);
    } else {
      const div = document.createElement('div'); div.className='thumb'; div.textContent = f.name; $('#preview').appendChild(div);
    }
  }
  btnBrowse.addEventListener('click', ()=> fi.click());
  fi.addEventListener('change', ()=> setFile(fi.files[0]||null));
  drop.addEventListener('dragover', (e)=>{ e.preventDefault(); drop.classList.add('drag'); });
  drop.addEventListener('dragleave', ()=> drop.classList.remove('drag'));
  drop.addEventListener('drop', (e)=>{ e.preventDefault(); drop.classList.remove('drag'); const f = e.dataTransfer.files && e.dataTransfer.files[0]; setFile(f||null); });
}

async function analyze(){
  const file = state.file; const st = $('#analyzeStatus'); st.textContent = '';
  if(!file){ st.textContent='Choose a file first'; return; }
  const isImage = /\.(jpg|jpeg|png|bmp|webp)$/i.test(file.name);
  // Build endpoint carefully: some gateways only accept one upload route; prefer engineBase unless engineUploadBase differs
  const baseUpload = (state.engineUploadBase && state.engineUploadBase !== state.engineBase) ? state.engineUploadBase : state.engineBase;
  const endpoint = baseUpload.replace(/\/$/,'') + (isImage? '/predict-image':'/predict');
  const fd = new FormData(); fd.append('file', file); fd.append('explain','true');
  // Do not collect a user id from UI; backend will derive from JWT if enforced.
  const btn = $('#btnAnalyze'); btn.disabled = true; st.textContent='Analyzing…';
  const btnCancel = $('#btnCancelUpload'); if(btnCancel){ btnCancel.hidden = false; btnCancel.disabled = false; }
  // Progress UI elements
  const progWrap = $('#uploadProgress'); const progBar = $('#uploadProgressBar'); const progPct = $('#uploadPercent'); const progPhase = $('#uploadPhase');
  function showProgress(show){ if(!progWrap) return; progWrap.classList.toggle('hidden', !show); progWrap.setAttribute('aria-hidden', show? 'false':'true'); }
  function setProgress(p){ const clamped = Math.max(0, Math.min(100, p)); if(progBar) progBar.style.width = clamped+'%'; if(progPct) progPct.textContent = Math.round(clamped)+'%'; }
  function setPhase(name){ if(progPhase) progPhase.textContent = name; }
  showProgress(true); setPhase('Uploading…'); setProgress(0);

  let analyzeTicker = null; let completed = false;
  function startAnalyzeTicker(startPct){ let pct = Math.max(startPct||90, 0); analyzeTicker = setInterval(()=>{ if(completed) return; pct = Math.min(97, pct + 0.35); setProgress(pct); }, 150); }
  function stopAnalyzeTicker(){ if(analyzeTicker){ clearInterval(analyzeTicker); analyzeTicker=null; } }
  function finalizeProgress(success){ completed = true; stopAnalyzeTicker(); setPhase(success? 'Completed':'Canceled'); setProgress(success? 100 : Math.max(0, parseFloat((progBar && progBar.style.width)||'0'))); setTimeout(()=> showProgress(false), 700); if(btnCancel){ btnCancel.hidden = true; } }

  // Build XHR for real upload progress
  try{
    await new Promise((resolve, reject)=>{
      const xhr = new XMLHttpRequest(); xhr.open('POST', endpoint, true);
      state.currentXhr = xhr;
      const headers = authHeaders(); Object.keys(headers||{}).forEach(k=>{ try{ xhr.setRequestHeader(k, headers[k]); }catch{} });
      // Upload progress up to ~88%
      xhr.upload.onprogress = (e)=>{
        if(e && e.lengthComputable){ const pct = e.total>0 ? (e.loaded/e.total)*88 : 20; setProgress(pct); }
      };
      xhr.upload.onload = ()=>{ setPhase('Analyzing…'); setProgress(90); startAnalyzeTicker(90); };
      xhr.onerror = ()=>{ reject(new Error('Network error')); };
      xhr.onreadystatechange = ()=>{
        if(xhr.readyState === 4){ stopAnalyzeTicker();
          const status = xhr.status; const text = xhr.responseText || '';
          if(status>=200 && status<300){ try{ const body = text ? JSON.parse(text) : {}; const data = body && body.result ? body.result : body; resolve(data); }catch(err){ reject(new Error('Invalid JSON response')); } }
          else if(status===401){ reject(new Error(`Unauthorized (401). Login is required or disable token enforcement for local testing. Details: ${text.slice(0,200)}`)); }
          else if(status===402){ reject(new Error(`Payment Required (402). Ensure credits are enabled and you have balance, or disable credits for local testing. Details: ${text.slice(0,200)}`)); }
          else { reject(new Error(`HTTP ${status}: ${text.slice(0,200)}`)); }
        }
      };
      try{ xhr.send(fd); }catch(err){ reject(err); }
    }).then((data)=>{
      // Success path
      renderResults(data); lastResultCache = data; finalizeProgress(true);
      const uid = currentUserOrGuest(); const list = loadLocalHistory(uid);
      const item = { session_id: uuidv4(), created: Date.now()/1000, name: file.name, type: isImage? 'image':'video', result: slimResult(data) };
      list.unshift(item); while(list.length > 10) list.pop(); saveLocalHistory(uid, list);
      st.textContent = 'Done';
    });
  }catch(e){
    if(String(e).includes('abort') || (state.currentXhr && state.currentXhr.aborted)){ st.textContent = 'Canceled'; finalizeProgress(false); }
    else { st.textContent = String(e); finalizeProgress(false); }
  }
  finally{ btn.disabled = false; state.currentXhr = null; if(btnCancel){ btnCancel.hidden = true; btnCancel.disabled = true; } }
}

function kv(container, k, v){ const row=document.createElement('div'); row.className='kv'; row.innerHTML = `<div class="muted">${k}</div><div>${v}</div>`; container.appendChild(row); }

function getDurationSec(result){
  try{
    if(result && result.video_meta){
      const vm = result.video_meta;
      if(typeof vm.duration_sec === 'number' && isFinite(vm.duration_sec)) return vm.duration_sec;
      if(typeof vm.total_frames === 'number' && typeof vm.fps === 'number' && vm.fps > 0){
        return vm.total_frames / vm.fps;
      }
    }
  }catch{}
  return null;
}

function renderResults(r){
  // Use enhanced renderer if available and ensemble data exists
  if (typeof renderEnhancedResults === 'function' && r && r.ensemble_confidence !== undefined) {
    renderEnhancedResults(r);
    return;
  }
  
  // Fallback to original rendering
  const box = $('#results'); box.innerHTML = '';
  if(!r){ box.textContent='No result'; return; }
  // enable download button when we have a result
  const dl = $('#btnDownloadZip'); if (dl){ dl.hidden = false; dl.onclick = ()=> downloadResultZip(r); }
  const ex = $('#btnExplain'); if (ex){ ex.hidden = false; ex.onclick = ()=> openExplainModal(r); }
  // Handle image-only response shape
  if (r && typeof r.label === 'string' && typeof r.sharpness_value === 'number'){
    // Charts block (image-only -> Laplacian gauge only)
    const charts = document.createElement('div'); charts.className = 'charts';
    const fakeApprox = (typeof r.sharpness_value==='number' && typeof r.sharpness_threshold==='number') ? (r.sharpness_value < r.sharpness_threshold ? 1 - r.sharpness_value/r.sharpness_threshold : 0) : (r.label==='fake'?1:0);
    const gLap = createGaugeCard('Laplacian', r.label, r.sharpness_value, r.sharpness_threshold, fakeApprox, /*fakeScoreFallback*/ null, /*isImage*/ true);
    charts.appendChild(gLap);
    box.appendChild(charts);

    // Summary card
    const realPct = 1 - fakeApprox;
    const sumItems = [
      { label:'Laplacian Real', value: `${(realPct*100).toFixed(1)}%` },
      { label:'Sharpness', value: `${Number(r.sharpness_value).toFixed(1)}`, hint: `thresh ${Number(r.sharpness_threshold).toFixed(0)}` },
    ];
    if(r.explain){ sumItems.push({ label:'Explain', value: r.explain }); }
    const summary = createSummaryCard(sumItems, 'Session Summary'); box.appendChild(summary);

    // Side-by-side images: Original (if available) and Heatmap
    if(state.previewUrl || r.heatmap){
      const grid = document.createElement('div'); grid.className='image-results';
      if(state.previewUrl){
        const card = document.createElement('div'); card.className='image-card';
        const cap = document.createElement('div'); cap.className='image-cap'; cap.textContent = 'Original';
        const img = new Image(); img.src = state.previewUrl; img.className='image-view';
        card.append(cap, img); grid.appendChild(card);
      }
      if(r.heatmap){
        const card = document.createElement('div'); card.className='image-card';
        const cap = document.createElement('div'); cap.className='image-cap'; cap.textContent = 'Laplacian Heatmap';
        const img=new Image(); img.src='data:image/png;base64,'+r.heatmap; img.className='image-view'; card.append(cap, img); grid.appendChild(card);
      }
      box.appendChild(grid);
    }
    return;
  }
  // Build Session Summary (video)
  let modelScore = null; let lapScore = null; let modelSection = null; let lapSection = null;
  if(r.model_pred){ modelSection = r.model_pred; if(typeof modelSection.score==='number') modelScore = modelSection.score; }
  if(r.laplacian_pred){ lapSection = r.laplacian_pred; if(typeof lapSection.score==='number') lapScore = lapSection.score; }
  const items = [];
  if(r.video_meta){
    if(typeof r.video_meta.fps==='number') items.push({label:'FPS', value: Number(r.video_meta.fps).toFixed(2)});
    if(typeof r.video_meta.total_frames==='number') items.push({label:'Frames', value: r.video_meta.total_frames});
    if(typeof r.video_meta.duration_sec==='number') items.push({label:'Duration', value: `${Number(r.video_meta.duration_sec).toFixed(2)} s`});
  }
  if(modelScore!=null){ items.push({label:'Model Real', value: `${((1-modelScore)*100).toFixed(1)}%`}); }
  if(modelSection && typeof modelSection.sync_metric==='number'){ items.push({label:'AV Sync Metric', value: modelSection.sync_metric.toFixed(3)}); }
  if(lapScore!=null){ items.push({label:'Laplacian Real', value: `${((1-lapScore)*100).toFixed(1)}%`}); }
  if(lapSection && lapSection.explain){ items.push({label:'Explain', value: lapSection.explain}); }
  if(items.length){ const summary = createSummaryCard(items, 'Session Summary'); box.appendChild(summary); }
  // Charts row (gauges + sparklines)
  const charts = document.createElement('div'); charts.className = 'charts';
  let modelSparkData = null; let lapSparkData = null;
  if(modelSection){ modelSparkData = Array.isArray(modelSection.per_frame_scores) ? modelSection.per_frame_scores : null; }
  if(lapSection){ lapSparkData = Array.isArray(lapSection.sharpness_series) ? lapSection.sharpness_series : null; }

  // Build gauge cards if available
  if (modelScore !== null) charts.appendChild(createGaugeCard('Model', r.model_pred.label, null, null, modelScore, /*fakeScoreFallback*/ null));
  if (lapScore !== null) charts.appendChild(createGaugeCard('Laplacian', r.laplacian_pred.label, r.laplacian_pred.sharpness_mean, (r.laplacian_pred && r.laplacian_pred.sharpness_threshold), lapScore, /*fakeScoreFallback*/ null));
  if (charts.children.length) box.prepend(charts);

  // Sparklines row
  const sparks = document.createElement('div'); sparks.className = 'sparklines';
  if (modelSparkData && modelSparkData.length){
    sparks.appendChild(createSparklineCard('Per-frame Attention (Model)', modelSparkData, {color:'#38bdf8', xLabel:'Frames', yLabel:'Attention'}));
  }
  if (lapSparkData && lapSparkData.length){
    sparks.appendChild(createSparklineCard('Frame Sharpness (Laplacian)', lapSparkData, {color:'#a78bfa', xLabel:'Frames', yLabel:'Sharpness'}));
  }
  if (sparks.children.length){
    if (charts.parentNode === box){
      box.insertBefore(sparks, charts.nextSibling);
    } else {
      box.appendChild(sparks);
    }
  }

  // Structured results grid with sections
  const grid = document.createElement('div'); grid.className = 'result-grid';
  // Model: Per-frame attention energy (sparkline) + Attention heatmap
  if(modelSection){
    if (Array.isArray(modelSection.per_frame_scores) && modelSection.per_frame_scores.length){
      const sec = createSectionCard('Per-frame Attention Energy (Model)');
  const canv = document.createElement('canvas'); canv.width=520; canv.height=120; canv.className='spark-canvas';
  sec.body.appendChild(canv);
  drawSparkline(canv, modelSection.per_frame_scores, { color:'#38bdf8', xLabel:'Frames', yLabel:'Attention', xTicks:[0, Math.floor((modelSection.per_frame_scores.length-1)/2), modelSection.per_frame_scores.length-1] });
  enableSparklineHover(canv, modelSection.per_frame_scores, { color:'#38bdf8', xLabel:'Frames', yLabel:'Attention' });
  const lg = document.createElement('div'); lg.className='muted'; lg.textContent = 'X: Frames • Y: Attention'; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.attention_map) && modelSection.attention_map.length){
      const sec = createSectionCard('Attention Map (Audio × Video)');
  const canv = document.createElement('canvas'); canv.width=520; canv.height=160; canv.className='heatmap-canvas';
  sec.body.appendChild(canv);
  drawHeatmapMatrix(canv, modelSection.attention_map, { xLabel:'Frames', yLabel:'Audio steps', palette:'magma' });
  const lg = document.createElement('div'); lg.className='muted'; lg.textContent = 'X: Frames • Y: Audio steps'; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.mel_spectrogram) && modelSection.mel_spectrogram.length){
      const sec = createSectionCard('Mel Spectrogram');
  const canv = document.createElement('canvas'); canv.width=520; canv.height=200; canv.className='heatmap-canvas';
  sec.body.appendChild(canv);
  const dur = r && r.video_meta && typeof r.video_meta.duration_sec==='number' ? r.video_meta.duration_sec : null;
  drawHeatmapMatrix(canv, modelSection.mel_spectrogram, { xLabel:'Time', yLabel:'Mel bins', palette:'turbo', durationSec: getDurationSec(r) });
  const lg = document.createElement('div'); lg.className='muted'; lg.textContent = 'X: Time (s) • Y: Mel bins'; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.waveform) && modelSection.waveform.length){
      const sec = createSectionCard('Waveform');
  const canv = document.createElement('canvas'); canv.width=520; canv.height=120; canv.className='spark-canvas';
  sec.body.appendChild(canv);
  const wf = downsample(modelSection.waveform, 1500);
  const dur = getDurationSec(r);
  drawSparkline(canv, wf, { color:'#60a5fa', xLabel:'Time', yLabel:'Amplitude', yClampPercentiles:[0.01,0.99], durationSec: dur });
  enableSparklineHover(canv, wf, { color:'#60a5fa', xLabel:'Time', yLabel:'Amplitude', yClampPercentiles:[0.01,0.99], durationSec: dur });
  const lg = document.createElement('div'); lg.className='muted'; lg.textContent = 'X: Time (s) • Y: Amplitude'; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.sync_series_audio) && Array.isArray(modelSection.sync_series_mouth)){
      const sec = createSectionCard('Sync Series (Audio RMS vs Mouth Openness)');
      const canv = document.createElement('canvas'); canv.width=520; canv.height=140; canv.className='spark-canvas';
      sec.body.appendChild(canv);
  const s1 = modelSection.sync_series_audio; const s2 = modelSection.sync_series_mouth; const dur2 = getDurationSec(r);
  drawSparklineMulti(canv, [s1, s2], { labels:['Audio RMS','Mouth openness'], colors:['#22d3ee','#f472b6'], xLabel: dur2? 'Time':'Frames', yLabel:'Normalized', durationSec: dur2 });
  enableSparklineHoverMulti(canv, [s1, s2], { labels:['Audio RMS','Mouth openness'], colors:['#22d3ee','#f472b6'], xLabel: dur2? 'Time':'Frames', yLabel:'Normalized' });
      if (typeof modelSection.sync_metric === 'number'){
        const meta = document.createElement('div'); meta.className='muted'; meta.textContent = `Sync metric (corr): ${modelSection.sync_metric.toFixed(3)} (higher means better sync)`; sec.body.appendChild(meta);
      }
      const lg = document.createElement('div'); lg.className='muted'; lg.textContent = `X: ${dur2? 'Time (s)':'Frames'} • Y: Normalized`; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.heatmaps) && modelSection.heatmaps.length){
      const sec = createSectionCard('Model Heatmaps (Grad-CAM)');
      const imgs = createImagesGrid(modelSection.heatmaps, 'Model Grad-CAM'); sec.body.appendChild(imgs); grid.appendChild(sec.wrap);
    }
    if (Array.isArray(modelSection.lip_heatmaps) && modelSection.lip_heatmaps.length){
      const sec = createSectionCard('Lip Region Overlays');
      const imgs = createImagesGrid(modelSection.lip_heatmaps, 'Lip overlay'); sec.body.appendChild(imgs); grid.appendChild(sec.wrap);
    }
  }
  // Laplacian: per-frame sharpness and heatmaps
  if(lapSection){
    if (Array.isArray(lapSection.sharpness_series) && lapSection.sharpness_series.length){
      const sec = createSectionCard('Per-frame Sharpness (Variance of Laplacian)');
  const canv = document.createElement('canvas'); canv.width=520; canv.height=120; canv.className='spark-canvas';
  sec.body.appendChild(canv);
  drawSparkline(canv, lapSection.sharpness_series, { color:'#a78bfa', xLabel:'Frames', yLabel:'Variance', yLines: [lapSection.sharpness_threshold] });
  enableSparklineHover(canv, lapSection.sharpness_series, { color:'#a78bfa', xLabel:'Frames', yLabel:'Variance' });
      const meta = document.createElement('div'); meta.className='muted'; meta.textContent = `Threshold: ${Number(lapSection.sharpness_threshold).toFixed(0)} • Mean: ${Number(lapSection.sharpness_mean).toFixed(1)}`; sec.body.appendChild(meta);
  const lg = document.createElement('div'); lg.className='muted'; lg.textContent = 'X: Frames • Y: Variance'; sec.body.appendChild(lg);
      grid.appendChild(sec.wrap);
    }
    if (Array.isArray(lapSection.overlay_heatmaps) && lapSection.overlay_heatmaps.length){
      const sec = createSectionCard('Laplacian Heatmaps');
      const imgs = createImagesGrid(lapSection.overlay_heatmaps, 'Laplacian overlay'); sec.body.appendChild(imgs); grid.appendChild(sec.wrap);
    }
  }
  if (grid.children.length) box.appendChild(grid);
  
  // Render ensemble visualizations if multi-model data is present
  if (typeof window.renderEnsembleVisualizations === 'function') {
    window.renderEnsembleVisualizations(r);
  }
}

// ---------------- Chart helpers ----------------
function createGaugeCard(title, verdictLabel, sharpnessValue, sharpnessThreshold, fakeScore, fakeScoreFallback, isImage){
  const card = document.createElement('div'); card.className='gauge-card';
  const hdr = document.createElement('div'); hdr.className='gauge-title'; hdr.textContent = title;
  const canvas = document.createElement('canvas'); canvas.width=200; canvas.height=200; canvas.className='gauge-canvas';
  const sub = document.createElement('div'); sub.className='gauge-sub';
  // Center label composition
  const fakePct = clamp01(typeof fakeScore === 'number' ? fakeScore : (typeof fakeScoreFallback === 'number' ? fakeScoreFallback : 0));
  const realPct = 1 - fakePct;
  sub.innerHTML = `<span class=\"badge ${verdictLabel==='fake'?'bad':'ok'}\">${verdictLabel||''}</span>` + (typeof sharpnessValue==='number' && typeof sharpnessThreshold==='number' ? ` <span class=\"muted\">• sharp ${sharpnessValue.toFixed(1)} vs ${sharpnessThreshold.toFixed(0)}</span>` : '');
  card.append(hdr, canvas, sub);
  // Draw animated gauge
  drawGauge(canvas, realPct, {
    mainText: `${(realPct*100).toFixed(1)}%`,
    subText: '',
    color: verdictLabel==='fake' ? '#f97316' : '#10b981'
  });
  return card;
}

function createSparklineCard(title, series, opts){
  const wrap = document.createElement('div'); wrap.className='spark-card';
  const hdr = document.createElement('div'); hdr.className='spark-title'; hdr.textContent=title;
  const canvas = document.createElement('canvas'); canvas.width=360; canvas.height=80; canvas.className='spark-canvas';
  wrap.append(hdr, canvas);
  drawSparkline(canvas, series, opts||{});
  return wrap;
}

function clamp01(x){ return Math.max(0, Math.min(1, x)); }

function drawGauge(canvas, value, options){
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio||1;
  const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1) || 200));
  const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1) || 200));
  canvas.style.width = cssW+'px'; canvas.style.height = cssH+'px';
  canvas.width = Math.max(1, Math.floor(cssW * dpr)); canvas.height = Math.max(1, Math.floor(cssH * dpr));
  ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
  const w = cssW, h = cssH; const cx=w/2, cy=h/2, r=Math.min(w,h)/2 - 12, lw=16;
  const bgTrack = 'rgba(148,163,184,0.25)';
  const col = (options && options.color) || '#60a5fa';
  const start = -Math.PI*0.75; const end = Math.PI*0.75; const span = end - start;
  const ease = t=>1 - Math.pow(1-t,3);
  let t0; const target = clamp01(value);
  function frame(ts){ if(t0==null) t0=ts; const p = Math.min(1, (ts-t0)/900); const v = ease(p)*target; ctx.clearRect(0,0,w,h);
    // track
    ctx.beginPath(); ctx.strokeStyle=bgTrack; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.arc(cx,cy,r,start,end,false); ctx.stroke();
    // progress
    ctx.beginPath(); ctx.strokeStyle=col; ctx.lineWidth=lw; ctx.lineCap='round'; ctx.arc(cx,cy,r,start,start+span*v,false); ctx.stroke();
    // text
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#0b1220';
    ctx.font='700 22px Inter, system-ui, -apple-system, Segoe UI, Roboto'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(options?.mainText || `${Math.round(v*100)}%`, cx, cy-6);
    ctx.font='500 12px Inter, system-ui, -apple-system, Segoe UI, Roboto'; ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.fillText(options?.subText || '', cx, cy+16);
    if(p<1) requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function drawSparkline(canvas, series, {color, xLabel, yLabel, yClampPercentiles, xTicks, yTicks, xTickFormatter, yTickFormatter, durationSec}){
  const ctx = canvas.getContext('2d'); const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1) || 360)); const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1) || 80)); canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px'; canvas.width=Math.max(1, Math.floor(cssW*dpr)); canvas.height=Math.max(1, Math.floor(cssH*dpr)); ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr); let w=cssW, h=cssH;
  const opts = arguments[2] || {}; const pad=28; const n = series.length; if(!n){ return; }
  // robust min/max with optional percentile clamping
  let min = Math.min(...series), max = Math.max(...series);
  if (opts && Array.isArray(opts.yClampPercentiles) && opts.yClampPercentiles.length===2){
    const [pLow, pHigh] = opts.yClampPercentiles; const sorted = series.slice().sort((a,b)=>a-b);
    const q = (arr,p)=> arr[Math.max(0, Math.min(arr.length-1, Math.floor(p*(arr.length-1))))];
    const qMin = q(sorted, Math.max(0, Math.min(1, pLow)));
    const qMax = q(sorted, Math.max(0, Math.min(1, pHigh)));
    if(isFinite(qMin) && isFinite(qMax) && qMax>qMin){ min=qMin; max=qMax; }
  }
  const span = (max-min) || 1;
  // line path
  ctx.clearRect(0,0,w,h);
  // axes lines
  const axisCol = 'rgba(148,163,184,0.6)';
  const x0 = pad, y0 = h - pad; // origin (bottom-left)
  ctx.strokeStyle = axisCol; ctx.lineWidth = 1;
  // Y axis
  ctx.beginPath(); ctx.moveTo(x0, pad-4); ctx.lineTo(x0, y0); ctx.stroke();
  // X axis
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(w - pad + 4, y0); ctx.stroke();
  // ticks
  const fmtNum = (v)=> (Math.abs(v) >= 1000 ? v.toFixed(0) : (Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)));
  // adaptive tick counts
  const idealXTicks = Math.max(2, Math.floor((w - 2*pad) / 120));
  const idealYTicks = Math.max(2, Math.floor((h - 2*pad) / 40));
  const defaultXTicks = (function(){ const a=[]; if(n<=1){ a.push(0); return a; } const steps = Math.min(idealXTicks-1, n-1); const step = Math.max(1, Math.floor((n-1)/steps)); for(let i=0;i<=n-1;i+=step){ a.push(i); } if(a[a.length-1] !== n-1){ a[a.length-1] = n-1; } return a; })();
  const defaultYTicks = (function(){ const a=[]; const ticks = idealYTicks; for(let i=0;i<ticks;i++){ a.push(min + (span)*(i/(ticks-1))); } return a; })();
  const xTickPos = (xIndex)=> x0 + (w - 2*pad) * (xIndex / Math.max(1,(n-1)));
  const yTickPos = (yVal)=> y0 - (h - 2*pad) * ((yVal - min) / span);
  const fmtX = (i)=> xTickFormatter ? xTickFormatter(i, {n, durationSec}) : (xLabel==='Time' && durationSec ? `${(durationSec * (i/Math.max(1,(n-1)))).toFixed(2)}s` : String(i));
  const fmtY = (v)=> yTickFormatter ? yTickFormatter(v) : fmtNum(v);
  ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '500 10px Inter, system-ui, Segoe UI, Roboto'; ctx.textAlign='center'; ctx.textBaseline='top';
  (xTicks||defaultXTicks).forEach(ix=>{ const xx = xTickPos(ix); ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx, y0+4); ctx.stroke(); ctx.fillText(fmtX(ix), xx, y0+6); });
  ctx.textAlign='right'; ctx.textBaseline='middle';
  (yTicks||defaultYTicks).forEach(v=>{ const yy = yTickPos(v); ctx.beginPath(); ctx.moveTo(x0-4, yy); ctx.lineTo(x0, yy); ctx.stroke(); ctx.fillText(fmtY(v), x0-6, yy); });

  ctx.lineWidth=2; ctx.strokeStyle=color||'#22d3ee'; ctx.beginPath();
  for(let i=0;i<n;i++){
    const x = pad + (w-2*pad)*(i/(n-1)); const val = Math.max(min, Math.min(max, series[i])); const y = h-pad - (h-2*pad)*((val-min)/span);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  // last point dot
  const x = pad + (w-2*pad); const lastVal = Math.max(min, Math.min(max, series[n-1])); const y = h-pad - (h-2*pad)*((lastVal-min)/span);
  ctx.fillStyle = color||'#22d3ee'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
  // axis legends (place away from edges to avoid overlap)
  ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '500 11px Inter, system-ui, Segoe UI, Roboto';
  // Y label near left-center
  ctx.textAlign='left'; ctx.textBaseline='bottom'; if (yLabel){ ctx.fillText(`${yLabel}`, 4, pad-6); }
  // X label near bottom-center
  ctx.textAlign='right'; ctx.textBaseline='bottom'; if (xLabel){ ctx.fillText(`${xLabel}`, w-6, h-2); }
  // optional horizontal reference lines
  if (opts && Array.isArray(opts.yLines)){
    ctx.save(); ctx.setLineDash([4,4]); ctx.lineWidth=1; ctx.strokeStyle='rgba(148,163,184,0.6)';
    opts.yLines.forEach(val=>{ const yy = h-pad - (h-2*pad)*((val-min)/span); ctx.beginPath(); ctx.moveTo(pad,yy); ctx.lineTo(w-pad,yy); ctx.stroke(); });
    ctx.restore();
  }
}

function enableSparklineHover(canvas, series, {color, xLabel, yLabel, yClampPercentiles, durationSec}){
  const pad = 16;
  function redraw(idx){
    drawSparkline(canvas, series, {color, xLabel, yLabel, yClampPercentiles, durationSec});
    if(idx==null) return;
    const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1))); const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1))); const w = cssW, h = cssH;
    const ctx = canvas.getContext('2d'); const n = series.length; 
    // recompute min/max with optional clamp to match draw
    let min = Math.min(...series), max = Math.max(...series);
    if (Array.isArray(yClampPercentiles) && yClampPercentiles.length===2){
      const [pLow, pHigh] = yClampPercentiles; const sorted = series.slice().sort((a,b)=>a-b);
      const q = (arr,p)=> arr[Math.max(0, Math.min(arr.length-1, Math.floor(p*(arr.length-1))))];
      const qMin = q(sorted, Math.max(0, Math.min(1, pLow)));
      const qMax = q(sorted, Math.max(0, Math.min(1, pHigh)));
      if(isFinite(qMin) && isFinite(qMax) && qMax>qMin){ min=qMin; max=qMax; }
    }
    const span = (max-min)||1;
    const x = pad + (w-2*pad)*(idx/(n-1)); const y = h-pad - (h-2*pad)*((series[idx]-min)/span);
    ctx.save();
    ctx.strokeStyle='rgba(148,163,184,0.6)'; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, h-pad); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = color||'#22d3ee'; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
  const xVal = (xLabel==='Time' && durationSec) ? `${(durationSec * (idx/Math.max(1,(n-1)))).toFixed(2)}s` : String(idx);
  const label = `${yLabel||'Value'}: ${Number(series[idx]).toFixed(3)}  (${xLabel||'Idx'} ${xVal})`;
    ctx.font='600 11px Inter, system-ui'; ctx.textAlign='left'; ctx.textBaseline='top';
    const tw = ctx.measureText(label).width + 10; const th = 18; const bx = Math.min(Math.max(8, x - tw/2), w - tw - 8); const by = 6;
    ctx.fillStyle='rgba(15,23,42,0.85)'; ctx.fillRect(bx, by, tw, th); ctx.fillStyle='#e2e8f0'; ctx.fillText(label, bx+5, by+3);
    ctx.restore();
  }
  function handle(evt){ const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1))); const x = (evt.clientX - rect.left); const n=series.length; let idx = Math.round(((x - 16) / (cssW - 32)) * (n - 1)); idx = Math.max(0, Math.min(n-1, idx)); redraw(idx); }
  canvas.addEventListener('mousemove', handle);
  canvas.addEventListener('mouseleave', ()=> redraw(null));
}

function drawSparklineMulti(canvas, seriesArr, {labels, colors, xLabel, yLabel, xTicks, yTicks, durationSec}){
  const ctx = canvas.getContext('2d'); const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1) || 520)); const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1) || 140)); canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px'; canvas.width=Math.max(1, Math.floor(cssW*dpr)); canvas.height=Math.max(1, Math.floor(cssH*dpr)); ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr); let w=cssW, h=cssH;
  const pad=28; const n = Math.max(...seriesArr.map(a=>a.length)); if(!n){return;}
  const all = seriesArr.flat(); const min = Math.min(...all); const max = Math.max(...all); const span = (max-min)||1;
  ctx.clearRect(0,0,w,h);
  // axes
  const x0 = pad, y0 = h - pad; const axisCol = 'rgba(148,163,184,0.6)'; ctx.strokeStyle=axisCol; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x0, pad-4); ctx.lineTo(x0, y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(w - pad + 4, y0); ctx.stroke();
  const idealXTicks = Math.max(2, Math.floor((w - 2*pad) / 120));
  const idealYTicks = Math.max(2, Math.floor((h - 2*pad) / 40));
  const defaultXTicks = (function(){ const a=[]; if(n<=1){ a.push(0); return a; } const steps = Math.min(idealXTicks-1, n-1); const step = Math.max(1, Math.floor((n-1)/steps)); for(let i=0;i<=n-1;i+=step){ a.push(i); } if(a[a.length-1] !== n-1){ a[a.length-1] = n-1; } return a; })();
  const defaultYTicks = (function(){ const a=[]; const ticks = idealYTicks; for(let i=0;i<ticks;i++){ a.push(min + (span)*(i/(ticks-1))); } return a; })();
  const xTickPos = (xIndex)=> x0 + (w - 2*pad) * (xIndex / Math.max(1,(n-1)));
  const yTickPos = (yVal)=> y0 - (h - 2*pad) * ((yVal - min) / span);
  const fmtNum = (v)=> (Math.abs(v) >= 1000 ? v.toFixed(0) : (Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)));
  ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '500 10px Inter, system-ui'; ctx.textAlign='center'; ctx.textBaseline='top';
  (xTicks||defaultXTicks).forEach(ix=>{ const xx=xTickPos(ix); ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx, y0+4); ctx.stroke(); const lab = (xLabel==='Time' && durationSec) ? `${(durationSec * (ix/Math.max(1,(n-1)))).toFixed(2)}s` : String(ix); ctx.fillText(lab, xx, y0+6); });
  ctx.textAlign='right'; ctx.textBaseline='middle';
  (yTicks||defaultYTicks).forEach(v=>{ const yy=yTickPos(v); ctx.beginPath(); ctx.moveTo(x0-4, yy); ctx.lineTo(x0, yy); ctx.stroke(); ctx.fillText(fmtNum(v), x0-6, yy); });
  // draw each series
  seriesArr.forEach((series, idx)=>{
    const col = colors && colors[idx] || ['#22d3ee','#f472b6','#10b981'][idx%3];
    ctx.lineWidth=2; ctx.strokeStyle=col; ctx.beginPath();
    const len = series.length;
    for(let i=0;i<len;i++){
      const x = pad + (w-2*pad)*(i/(n-1)); const y = h-pad - (h-2*pad)*((series[i]-min)/span);
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  });
  // legends
  if(labels && labels.length){
    const legend = labels.map((t,i)=>({t, c: (colors && colors[i]) || ['#22d3ee','#f472b6','#10b981'][i%3]}));
    let lx = pad, ly = 6; ctx.font='500 11px Inter, system-ui'; legend.forEach(item=>{ ctx.fillStyle=item.c; ctx.beginPath(); ctx.arc(lx, ly+3, 3, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(148,163,184,0.95)'; ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText(item.t, lx+8, ly); lx += ctx.measureText(item.t).width + 28; });
  }
  // axes labels (centered to avoid edge overlap)
  ctx.fillStyle = 'rgba(148,163,184,0.9)'; ctx.font = '500 11px Inter, system-ui, Segoe UI, Roboto';
  ctx.textAlign='left'; ctx.textBaseline='bottom'; if (yLabel){ ctx.fillText(`${yLabel}`, 4, pad-6); }
  ctx.textAlign='right'; ctx.textBaseline='bottom'; if (xLabel){ ctx.fillText(`${xLabel}`, w-6, h-2); }
}

function enableSparklineHoverMulti(canvas, seriesArr, {labels, colors, xLabel, yLabel, durationSec}){
  const pad = 16; const all = seriesArr.flat(); const min = Math.min(...all); const max = Math.max(...all); const span=(max-min)||1; const n = Math.max(...seriesArr.map(a=>a.length));
  function redraw(idx){
    drawSparklineMulti(canvas, seriesArr, {labels, colors, xLabel, yLabel, durationSec});
    if(idx==null) return; const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1))); const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1))); const w = cssW, h = cssH; const ctx = canvas.getContext('2d');
    const x = pad + (w-2*pad)*(idx/(n-1));
    ctx.save(); ctx.strokeStyle='rgba(148,163,184,0.6)'; ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, h-pad); ctx.stroke(); ctx.setLineDash([]);
    const cols = colors && colors.length? colors : ['#22d3ee','#f472b6','#10b981']; let y0 = 24; const xVal = (xLabel==='Time' && durationSec) ? `${(durationSec * (idx/Math.max(1,(n-1)))).toFixed(2)}s` : String(idx); let label = `${xLabel||'Idx'} ${xVal}`;
    ctx.font='600 11px Inter, system-ui';
    seriesArr.forEach((series, sidx)=>{
      if(idx < series.length){ const val = series[idx]; const y = h-pad - (h-2*pad)*((val-min)/span); ctx.fillStyle=cols[sidx%cols.length]; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); label += `  • ${labels?labels[sidx]:(`S${sidx+1}`)}: ${Number(val).toFixed(3)}`; }
    });
    const ctx2 = ctx; const tw = ctx2.measureText(label).width + 10; const th=18; const bx = Math.min(Math.max(8, x - tw/2), w - tw - 8); const by = 6; ctx2.fillStyle='rgba(15,23,42,0.85)'; ctx2.fillRect(bx, by, tw, th); ctx2.fillStyle='#e2e8f0'; ctx2.fillText(label, bx+5, by+3);
    ctx.restore();
  }
  function handle(evt){ const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1))); const x = (evt.clientX - rect.left); let idx = Math.round(((x - 16) / (cssW - 32)) * (n - 1)); idx = Math.max(0, Math.min(n-1, idx)); redraw(idx); }
  canvas.addEventListener('mousemove', handle);
  canvas.addEventListener('mouseleave', ()=> redraw(null));
}

function drawHeatmapMatrix(canvas, matrix, {xLabel, yLabel, palette, durationSec}){
  const ctx = canvas.getContext('2d'); const dpr=window.devicePixelRatio||1; const cssW = Math.max(1, Math.floor(canvas.clientWidth || parseFloat(getComputedStyle(canvas).width) || canvas.width/(dpr||1) || 520)); const cssH = Math.max(1, Math.floor(canvas.clientHeight || parseFloat(getComputedStyle(canvas).height) || canvas.height/(dpr||1) || 160)); canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px'; canvas.width=Math.max(1, Math.floor(cssW*dpr)); canvas.height=Math.max(1, Math.floor(cssH*dpr)); ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr); let w=cssW,h=cssH;
  const padL=48, padB=28, padT=12, padR=12; const rows = matrix.length; const cols = (rows? matrix[0].length: 0); if(!rows||!cols){ return; }
  let min=Infinity,max=-Infinity; for(let i=0;i<rows;i++){ for(let j=0;j<cols;j++){ const v=+matrix[i][j]; if(v<min)min=v; if(v>max)max=v; }} const span=(max-min)||1;
  const iw = w - padL - padR; const ih = h - padT - padB;
  const img = ctx.createImageData(iw, ih); let k=0;
  for(let y=0;y<ih;y++){
    const ri = Math.floor(y/ih * rows);
    for(let x=0;x<iw;x++){
      const ci = Math.floor(x/iw * cols);
      const v = (matrix[ri][ci]-min)/span; const [r,g,b]=colormap(palette||'turbo', v);
      img.data[k++] = r; img.data[k++] = g; img.data[k++] = b; img.data[k++] = 255;
    }
  }
  ctx.putImageData(img, padL, padT);
  // axes and ticks
  const axisCol='rgba(148,163,184,0.6)'; ctx.strokeStyle=axisCol; ctx.lineWidth=1;
  // Y axis
  ctx.beginPath(); ctx.moveTo(padL, padT-4); ctx.lineTo(padL, padT+ih); ctx.stroke();
  // X axis
  ctx.beginPath(); ctx.moveTo(padL, padT+ih); ctx.lineTo(padL+iw+4, padT+ih); ctx.stroke();
  const fmtNum = (v)=> (Math.abs(v) >= 1000 ? v.toFixed(0) : (Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)));
  const idealXTicks = Math.max(2, Math.floor(iw / 120));
  const idealYTicks = Math.max(2, Math.floor(ih / 40));
  const xTicks = (function(){ const a=[]; if(cols<=1){ a.push(0); return a; } const steps = Math.min(idealXTicks-1, cols-1); const step = Math.max(1, Math.floor((cols-1)/steps)); for(let i=0;i<=cols-1;i+=step){ a.push(i); } if(a[a.length-1] !== cols-1){ a[a.length-1] = cols-1; } return a; })();
  const yTicks = (function(){ const a=[]; const ticks = idealYTicks; for(let i=0;i<ticks;i++){ a.push(i*(rows-1)/(ticks-1)); } return a; })();
  ctx.fillStyle='rgba(148,163,184,0.9)'; ctx.font='500 10px Inter, system-ui';
  // X tick marks and labels
  ctx.textAlign='center'; ctx.textBaseline='top';
  xTicks.forEach(ix=>{ const xx = padL + (iw)*(ix/Math.max(1,(cols-1))); ctx.beginPath(); ctx.moveTo(xx, padT+ih); ctx.lineTo(xx, padT+ih+4); ctx.stroke(); const label = (xLabel==='Time' && durationSec) ? `${(durationSec * (ix/Math.max(1,(cols-1)))).toFixed(2)}s` : String(ix); ctx.fillText(label, xx, padT+ih+6); });
  // Y tick marks and labels
  ctx.textAlign='right'; ctx.textBaseline='middle';
  yTicks.forEach(iy=>{ const yy = padT + ih - (ih)*(iy/Math.max(1,(rows-1))); ctx.beginPath(); ctx.moveTo(padL-4, yy); ctx.lineTo(padL, yy); ctx.stroke(); ctx.fillText(String(iy), padL-6, yy); });
  // labels
  ctx.fillStyle='rgba(148,163,184,0.9)'; ctx.font='500 11px Inter, system-ui'; ctx.textAlign='left'; ctx.textBaseline='bottom'; if(yLabel){ ctx.fillText(yLabel, 6, padT-6); }
  ctx.textAlign='right'; ctx.textBaseline='bottom'; if(xLabel){ ctx.fillText(xLabel, padL+iw, padT+ih+22); }
}

function colormap(name, t){
  // simple palettes: turbo and magma approximations
  t = Math.max(0, Math.min(1, t));
  if(name==='magma'){
    // approximate grayscale to orange
    const r = Math.round(255*Math.pow(t,0.7)); const g = Math.round(100*Math.pow(t,0.9)); const b = Math.round(150*(1-Math.pow(t,0.6)));
    return [r,g,b];
  }
  // turbo-like
  const r = Math.round(34 + 226*t);
  const g = Math.round(20 + 200*Math.sin(t*Math.PI));
  const b = Math.round(30 + 220*(1-t));
  return [r,g,b];
}

function createSectionCard(title){
  const wrap = document.createElement('div'); wrap.className='section-card';
  const h = document.createElement('div'); h.className='section-title'; h.textContent = title;
  const body = document.createElement('div'); body.className='section-body';
  wrap.append(h, body);
  return { wrap, body };
}

function createImagesGrid(b64List, caption){
  const grid = document.createElement('div'); grid.className='images-grid';
  b64List.forEach((b, idx)=>{ const card = document.createElement('div'); card.className='image-card'; const cap = document.createElement('div'); cap.className='image-cap'; cap.textContent = caption + (b64List.length>1?` #${idx+1}`:''); const img=new Image(); img.src='data:image/png;base64,'+b; img.className='image-view'; card.append(cap,img); grid.appendChild(card); });
  return grid;
}

function downsample(arr, maxLen){ if(arr.length<=maxLen) return arr; const step = arr.length/maxLen; const res=[]; for(let i=0;i<maxLen;i++){ res.push(arr[Math.floor(i*step)]); } return res; }

// ------- Result ZIP download -------
let lastResultCache = null;
async function downloadResultZip(result){
  try{
    const files = await buildResultFiles(result);
    const zipBlob = await buildZipBlob(files);
    const a = document.createElement('a'); a.href = URL.createObjectURL(zipBlob); a.download = `deepfake_results_${new Date().toISOString().replace(/[:.]/g,'-')}.zip`; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }catch(e){ alert('Failed to build ZIP: '+e); }
}

async function buildResultFiles(r){
  const files = [];
  // Raw JSON
  files.push({ path:'result.json', blob: new Blob([JSON.stringify(r, null, 2)], {type:'application/json'}) });
  // Gauges/summary are visual; include key images and matrices if present
  if(r && r.laplacian_pred){
    if(Array.isArray(r.laplacian_pred.overlay_heatmaps)){
      r.laplacian_pred.overlay_heatmaps.forEach((b64,i)=> files.push(b64ToFile(`laplacian/overlay_${i+1}.png`, b64)));
    }
  }
  if(r && r.model_pred){
    if(Array.isArray(r.model_pred.heatmaps)){
      r.model_pred.heatmaps.forEach((b64,i)=> files.push(b64ToFile(`model/gradcam_${i+1}.png`, b64)));
    }
    if(Array.isArray(r.model_pred.lip_heatmaps)){
      r.model_pred.lip_heatmaps.forEach((b64,i)=> files.push(b64ToFile(`model/lip_${i+1}.png`, b64)));
    }
    // Save series as CSV for convenience
    if(Array.isArray(r.model_pred.per_frame_scores)) files.push(textFile('model/per_frame_scores.csv', arrayToCsv(r.model_pred.per_frame_scores)));
    if(Array.isArray(r.model_pred.sync_series_audio)) files.push(textFile('model/sync_series_audio.csv', arrayToCsv(r.model_pred.sync_series_audio)));
    if(Array.isArray(r.model_pred.sync_series_mouth)) files.push(textFile('model/sync_series_mouth.csv', arrayToCsv(r.model_pred.sync_series_mouth)));
    if(Array.isArray(r.model_pred.waveform)) files.push(textFile('model/waveform.csv', arrayToCsv(r.model_pred.waveform)));
    if(Array.isArray(r.model_pred.mel_spectrogram)) files.push(textFile('model/mel_spectrogram.csv', matrixToCsv(r.model_pred.mel_spectrogram)));
    if(Array.isArray(r.model_pred.attention_map)) files.push(textFile('model/attention_map.csv', matrixToCsv(r.model_pred.attention_map)));
  }
  // Image mode heatmap
  if(r && r.heatmap){ files.push(b64ToFile('image/heatmap.png', r.heatmap)); }
  return files;
}

function b64ToFile(path, b64){
  const byteStr = atob(b64); const len = byteStr.length; const arr = new Uint8Array(len); for(let i=0;i<len;i++) arr[i] = byteStr.charCodeAt(i);
  return { path, blob: new Blob([arr], {type:'image/png'}) };
}
function textFile(path, text){ return { path, blob: new Blob([text], {type:'text/csv'}) }; }
function arrayToCsv(arr){ return (arr||[]).map(v=>String(v)).join('\n'); }
function matrixToCsv(m){ return (m||[]).map(row=> row.map(v=>String(v)).join(',')).join('\n'); }

async function buildZipBlob(files){
  // Minimal ZIP builder for stored files (no compression; store method)
  const encoder = new TextEncoder();
  const chunks = []; const central = [];
  let offset = 0; let fileIdx = 0;
  function pushChunk(buf){ chunks.push(buf); offset += buf.byteLength; }
  function crc32(buf){ // simple CRC32
    let c = ~0; const table = crc32.table || (crc32.table = (function(){ let t=[]; for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++){ c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); } t[n]=c; } return t; })());
    const arr = new Uint8Array(buf); for(let i=0;i<arr.length;i++){ c = table[(c ^ arr[i]) & 0xFF] ^ (c >>> 8); }
    return (~c) >>> 0;
  }
  async function fileHeader(path, blob){
    const nameBytes = encoder.encode(path); const data = new Uint8Array(await blob.arrayBuffer());
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30)); // local header without name
    const sig = 0x04034b50;
    local.setUint32(0, sig, true); // signature
    local.setUint16(4, 20, true); // version needed
    local.setUint16(6, 0, true);  // flags
    local.setUint16(8, 0, true);  // compression (store)
    local.setUint16(10, 0, true); // mod time
    local.setUint16(12, 0, true); // mod date
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true); // extra len
    pushChunk(new Uint8Array(local.buffer)); pushChunk(nameBytes); pushChunk(data);
    // central directory entry
    const centralHdr = new DataView(new ArrayBuffer(46));
    centralHdr.setUint32(0, 0x02014b50, true); // signature
    centralHdr.setUint16(4, 20, true); // version made by
    centralHdr.setUint16(6, 20, true); // version needed
    centralHdr.setUint16(8, 0, true); // flags
    centralHdr.setUint16(10, 0, true); // compression
    centralHdr.setUint16(12, 0, true); // mod time
    centralHdr.setUint16(14, 0, true); // mod date
    centralHdr.setUint32(16, crc, true);
    centralHdr.setUint32(20, data.length, true);
    centralHdr.setUint32(24, data.length, true);
    centralHdr.setUint16(28, nameBytes.length, true);
    centralHdr.setUint16(30, 0, true); // extra
    centralHdr.setUint16(32, 0, true); // comment
    centralHdr.setUint16(34, 0, true); // disk number
    centralHdr.setUint16(36, 0, true); // internal attrs
    centralHdr.setUint32(38, 0, true); // external attrs
    centralHdr.setUint32(42, (offset - (30 + nameBytes.length + data.length)), true); // local header offset
    central.push(new Uint8Array(centralHdr.buffer)); central.push(nameBytes);
  }
  for(const f of files){ await fileHeader(f.path, f.blob); }
  const centralSize = central.reduce((a,b)=> a + b.byteLength, 0);
  const centralOffset = offset;
  central.forEach(buf=> pushChunk(buf));
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); // signature
  end.setUint16(4, 0, true); // disk
  end.setUint16(6, 0, true); // start disk
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, centralOffset, true);
  end.setUint16(20, 0, true); // comment len
  pushChunk(new Uint8Array(end.buffer));
  return new Blob(chunks, {type:'application/zip'});
}

// ------- Explanation modal -------
function openExplainModal(r){
  const modal = $('#explainModal'); const body = $('#explainBody'); const closeBtn = $('#btnCloseExplain');
  if(!modal || !body || !closeBtn) return;
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  body.innerHTML = '';
  const sec = (title, html)=>{ const h=document.createElement('h5'); h.textContent=title; const p=document.createElement('div'); p.innerHTML=html; body.append(h,p); };
  sec('Overview', '<p>The analyzer uses a <strong>multi-model ensemble</strong> combining three specialized deep learning models: <strong>Pinpoint</strong> (audiovisual transformer), <strong>VGG16 v1</strong> (texture & edge detection), and <strong>VGG16 v2</strong> (gradient & artifact analysis). Each model provides unique insights that are combined for robust detection.</p>');
  
  sec('🎯 Pinpoint Model (Primary Analysis)', '<p>Advanced transformer-based model providing detailed frame-by-frame analysis:</p><ul><li><strong>Per-frame Attention</strong>: Strength of model focus across frames, detecting temporal inconsistencies.</li><li><strong>Attention Map</strong>: Audio × Video alignment showing cross-modal attention patterns.</li><li><strong>Mel Spectrogram & Waveform</strong>: Audio frequency analysis to detect synthetic speech artifacts.</li><li><strong>Sync Series</strong>: Correlation between audio RMS and mouth openness (higher correlation = better sync).</li><li><strong>Grad-CAM Heatmaps</strong>: Visual regions that most influenced the model\'s decision.</li></ul>');
  
  sec('🔍 VGG16 v1 (Visual Analysis)', '<p>Convolutional neural network specialized in visual artifact detection:</p><ul><li><strong>Texture Patterns</strong>: Hierarchical feature extraction to identify unnatural textures from deep convolutional layers.</li><li><strong>Edge Detection</strong>: Sobel and Canny algorithms to detect manipulation boundaries and inconsistencies.</li><li><strong>Color Consistency</strong>: Analyzes color histogram distributions across frames to find anomalies.</li><li><strong>Transfer Learning</strong>: Leverages ImageNet pre-training to recognize unnatural visual patterns.</li></ul>');
  
  sec('🎨 VGG16 v2 (Gradient & Artifacts)', '<p>Enhanced VGG16 variant focusing on compression artifacts and spatial gradients:</p><ul><li><strong>Texture Patterns</strong>: Uses Gabor filters and Local Binary Patterns to detect texture discontinuities.</li><li><strong>Gradient Analysis</strong>: Examines spatial gradients to identify unnatural transitions and blending.</li><li><strong>Artifacts Detection</strong>: Identifies JPEG compression artifacts and re-compression patterns.</li><li><strong>Frequency Domain</strong>: Detects frequency anomalies indicating digital manipulation.</li></ul>');
  
  sec('Laplacian (Blur Heuristic)', '<ul><li><strong>Per-frame Sharpness</strong>: Variance of Laplacian with threshold guide to detect blur anomalies.</li><li><strong>Heatmaps</strong>: Overlays showing blurry areas that may indicate tampering or defocus.</li></ul>');
  
  sec('📊 Model Dropdown Selector', '<p>In the <strong>Detailed Analysis & Visualizations</strong> section, use the dropdown menu to:</p><ul><li><strong>All Models</strong>: Shows Pinpoint\'s detailed analysis (the most comprehensive).</li><li><strong>Pinpoint</strong>: Frame-by-frame attention, spectrograms, sync analysis, and heatmaps.</li><li><strong>VGG16 v1</strong>: Displays analysis parameters and methodology for texture/edge detection.</li><li><strong>VGG16 v2</strong>: Shows gradient analysis and artifact detection methodology.</li></ul>');
  
  sec('How to Read Results', '<p><strong>Manipulation Probability</strong> shows the likelihood (0-100%) that the media is manipulated. The <strong>Ensemble Analysis</strong> combines all three models for a robust final score. Check the <strong>Model Comparison</strong> section to see individual model predictions and confidence levels.</p>');
  sec('Tips', '<ul><li>Use short, clear clips with frontal face and speech for best results.</li><li>Look for consistency: Grad-CAM focus on face/lips, good AV sync, reasonable sharpness.</li><li>When values disagree, inspect the detailed sections to understand why.</li></ul>');
  if(r && r.laplacian_pred && typeof r.laplacian_pred.sharpness_threshold==='number'){
    sec('Thresholds used', `<p>Laplacian threshold: <code>${Number(r.laplacian_pred.sharpness_threshold).toFixed(0)}</code>. Mean sharpness: <code>${Number(r.laplacian_pred.sharpness_mean).toFixed(1)}</code>.</p>`);
  }
  const backdrop = modal.querySelector('.modal-backdrop');
  function close(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
  closeBtn.onclick = close; if(backdrop){ backdrop.onclick = close; }
}

// Creators modal wiring
function openCreatorsModal(){ const modal=$('#creatorsModal'); const closeBtn=$('#btnCloseCreators'); if(!modal||!closeBtn) return; modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); const backdrop = modal.querySelector('.modal-backdrop'); function close(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); } closeBtn.onclick = close; if(backdrop){ backdrop.onclick = close; } }

function createSummaryCard(items, title){
  const sec = document.createElement('div'); sec.className='section-card summary-card';
  const h = document.createElement('div'); h.className='section-title'; h.textContent = title || 'Session Summary'; sec.appendChild(h);
  const grid = document.createElement('div'); grid.className='summary-grid';
  (items||[]).forEach(it=>{
    if(it==null || it.value==null) return;
    const tile = document.createElement('div'); tile.className='summary-item';
    const k = document.createElement('div'); k.className='k'; k.textContent = it.label || '';
    const v = document.createElement('div'); v.className='v'; v.textContent = String(it.value);
    tile.append(k,v);
    if(it.hint){ const hint = document.createElement('div'); hint.className='hint'; hint.textContent = String(it.hint); tile.appendChild(hint); }
    grid.appendChild(tile);
  });
  sec.appendChild(grid);
  return sec;
}

// -------- Local (guest/fallback) history helpers --------
function uuidv4(){
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8); return v.toString(16);
  });
}
function currentUserOrGuest(){ return deriveUserIdFromToken() || 'guest'; }
function historyKey(uid){ return `dt_history_${uid}`; }
function loadLocalHistory(uid){ try{ const raw=localStorage.getItem(historyKey(uid)); return raw? JSON.parse(raw): []; }catch{ return []; } }
function saveLocalHistory(uid, list){ try{ localStorage.setItem(historyKey(uid), JSON.stringify(list)); }catch{} }
function slimResult(r){
  try{
    // Limit large arrays to keep storage small
    const copy = JSON.parse(JSON.stringify(r));
    if(copy && copy.model_pred){
      if(Array.isArray(copy.model_pred.heatmaps)) copy.model_pred.heatmaps = copy.model_pred.heatmaps.slice(0,1);
      if(Array.isArray(copy.model_pred.lip_heatmaps)) copy.model_pred.lip_heatmaps = copy.model_pred.lip_heatmaps.slice(0,1);
      if(Array.isArray(copy.model_pred.attention_map)) copy.model_pred.attention_map = undefined;
      if(Array.isArray(copy.model_pred.waveform)) copy.model_pred.waveform = undefined;
      if(Array.isArray(copy.model_pred.mel_spectrogram)) copy.model_pred.mel_spectrogram = undefined;
    }
    if(copy && copy.laplacian_pred){
      if(Array.isArray(copy.laplacian_pred.overlay_heatmaps)) copy.laplacian_pred.overlay_heatmaps = copy.laplacian_pred.overlay_heatmaps.slice(0,1);
    }
    if(copy && typeof copy.label === 'string' && copy.heatmap){
      // Image response: keep as-is (single heatmap)
    }
    return copy;
  }catch{ return r; }
}

function deriveUserIdFromToken(){
  try{ const t = getTokens(); if(!t || !t.id_token) return null; const parts=t.id_token.split('.'); if(parts.length<2) return null; const body=JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'))); return body.sub||body['cognito:username']||body.username||null; }catch{ return null; }
}

async function loadHistory(){
  const st=$('#historyStatus'); const ct=$('#history'); ct.innerHTML='';
  const user = deriveUserIdFromToken();
  if(!user){
    // Guest/local mode
    const uid = currentUserOrGuest();
    const list = loadLocalHistory(uid).slice(0,10);
    if(!list.length){ st.textContent='No sessions (guest)'; return; }
    st.textContent = `${list.length} local sessions`;
    for(const s of list){
      const div = document.createElement('div'); div.className='item';
      const left = document.createElement('div'); left.innerHTML = `<div><strong>${s.name||s.session_id}</strong> • <span class='muted'>${new Date((s.created||0)*1000).toLocaleString()}</span></div>`;
      const right = document.createElement('div');
      const btnOpen=document.createElement('button'); btnOpen.className='btn mini'; btnOpen.textContent='Open';
      btnOpen.addEventListener('click', ()=> { $('#results').innerHTML=''; renderResults(s.result); st.textContent = `Opened ${s.name||s.session_id}`; });
      const btnDel=document.createElement('button'); btnDel.className='btn mini danger'; btnDel.textContent='Delete';
      btnDel.addEventListener('click', ()=> { const l = loadLocalHistory(uid).filter(x=>x.session_id!==s.session_id); saveLocalHistory(uid, l); loadHistory(); });
      right.append(btnOpen, btnDel); div.append(left, right); ct.appendChild(div);
    }
    return;
  }
  // Logged-in: request server-side history (S3-backed)
  st.textContent='Loading…';
  try{
    const base = apiReadBase();
    const headers = { ...authHeaders(), 'Accept': 'application/json' };
    const res = await fetch(`${base}/history/${encodeURIComponent(user)}`, { headers });
    if(!res.ok){
      const text = await res.text().catch(()=> '');
      throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
    }
    const ctHeader = (res.headers.get('content-type')||'').toLowerCase();
    if(!ctHeader.includes('application/json')){
      const text = await res.text().catch(()=> '');
      throw new Error(`Expected JSON, got ${ctHeader||'unknown'}: ${text.slice(0,200)}`);
    }
    const data = await res.json();
    if(!data.sessions || !data.sessions.length){ st.textContent='No sessions'; return; }
    st.textContent = `${data.sessions.length} sessions`;
    for(const s of data.sessions){
      const div = document.createElement('div'); div.className='item';
      const left = document.createElement('div'); left.innerHTML = `<div><strong>${s.session_id}</strong> • <span class='muted'>${new Date((s.created||0)*1000).toLocaleString()}</span></div>`;
      const right = document.createElement('div');
      const btnOpen=document.createElement('button'); btnOpen.className='btn mini'; btnOpen.textContent='Open';
      btnOpen.addEventListener('click', ()=> openHistoryDetail(user, s.session_id));
      const btnDel=document.createElement('button'); btnDel.className='btn mini danger'; btnDel.textContent='Delete';
      btnDel.addEventListener('click', ()=> deleteSession(user, s.session_id));
      right.append(btnOpen, btnDel); div.append(left, right); ct.appendChild(div);
    }
  }catch(e){ st.textContent = String(e); }
}

async function openHistoryDetail(user, session){
  const st=$('#historyStatus');
  try{
    const base = apiReadBase();
    const headers = { ...authHeaders(), 'Accept': 'application/json' };
    const res = await fetch(`${base}/history/${encodeURIComponent(user)}/${encodeURIComponent(session)}`, { headers });
    if(!res.ok){
      const text = await res.text().catch(()=> '');
      throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
    }
    const ctHeader = (res.headers.get('content-type')||'').toLowerCase();
    if(!ctHeader.includes('application/json')){
      const text = await res.text().catch(()=> '');
      throw new Error(`Expected JSON, got ${ctHeader||'unknown'}: ${text.slice(0,200)}`);
    }
    const d = await res.json();
    st.textContent = `Opened ${session}`;
    const box = $('#results');
    box.innerHTML = '';
    if(d.result) renderResults(d.result);
    if(d.assets && d.assets.length){
      const wrap = document.createElement('div'); wrap.className='assets';
      d.assets.forEach(a=>{ const link = document.createElement('a'); link.href=a.url; link.target='_blank'; link.textContent=a.name; link.className='btn mini'; wrap.appendChild(link); });
      box.appendChild(wrap);
    }
  }catch(e){ st.textContent = String(e); }
}

async function deleteSession(user, session){
  const st=$('#historyStatus');
  try{
    const base = apiReadBase();
    const headers = { ...authHeaders(), 'Accept': 'application/json' };
    const res = await fetch(`${base}/history/${encodeURIComponent(user)}/${encodeURIComponent(session)}`, { method:'DELETE', headers });
    if(!res.ok){
      const text = await res.text().catch(()=> '');
      throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
    }
    st.textContent = 'Deleted'; loadHistory();
  }catch(e){ st.textContent = String(e); }
}

function wireSettings(){
  $('#engineBase').value = state.engineBase; $('#creditsBase').value = state.creditsBase; $('#useJwtGlobal').checked = state.useJwt;
  $('#btnSaveSettings').addEventListener('click', ()=>{ state.engineBase = $('#engineBase').value.trim()||state.engineBase; state.creditsBase = $('#creditsBase').value.trim()||state.creditsBase; setUseJwt($('#useJwtGlobal').checked); saveBases(); $('#settingsStatus').textContent = 'Saved'; setTimeout(()=>$('#settingsStatus').textContent='',1500); });
}

function wireApiDocs(){
  // Reuse existing api-docs.js behavior on this page too
  const s = document.createElement('script'); s.src = './api-docs.js'; document.body.appendChild(s);
}

function wireActions(){
  const btnRefresh = $('#btnRefreshHistory'); if (btnRefresh) btnRefresh.addEventListener('click', loadHistory);
  $('#btnAnalyze').addEventListener('click', analyze);
  const btnDelAll = $('#btnDeleteAllHistory');
  if(btnDelAll){
    btnDelAll.addEventListener('click', async ()=>{
      const idTok = getIdToken();
      const accessTok = getAccessToken();
      const uid = deriveUserIdFromToken() || currentUserOrGuest();
      // If logged in and JWT use is enabled, call backend delete; else clear local only
      if(state.useJwt && (accessTok || idTok) && deriveUserIdFromToken()){
        try{
          const base = apiReadBase();
          const headers = { ...authHeaders(), 'Accept': 'application/json' };
          const res = await fetch(`${base}/history/${encodeURIComponent(uid)}`, { method:'DELETE', headers });
          if(!res.ok){
            const text = await res.text().catch(()=> '');
            throw new Error(`HTTP ${res.status}: ${text.slice(0,200)}`);
          }
          $('#historyStatus').textContent = 'Deleted from server';
          setTimeout(()=> $('#historyStatus').textContent='', 1200);
          loadHistory();
        }catch(e){ $('#historyStatus').textContent = String(e); setTimeout(()=> $('#historyStatus').textContent='', 1800); }
      } else {
        saveLocalHistory(uid, []); loadHistory(); $('#historyStatus').textContent = 'Cleared (local)'; setTimeout(()=> $('#historyStatus').textContent='', 1200);
      }
    });
  }
  const btnCancel = $('#btnCancelUpload'); if(btnCancel){ btnCancel.addEventListener('click', ()=>{ try{ if(state.currentXhr){ state.currentXhr.aborted = true; state.currentXhr.abort(); } }catch{} }); }
  $('#btnLogout').addEventListener('click', async ()=>{
    try{ localStorage.removeItem('cogTokens'); localStorage.removeItem('useJwt'); }catch{}
    renderUserBadge();
    if(window.__oidc && typeof window.__oidc.signOutRedirect==='function'){
      // Delegate to Cognito Hosted UI logout (includes redirect back to redirect_uri)
      try { await window.__oidc.signOutRedirect(); return; } catch {}
    }
    // Fallback: local logout only
    window.location.href = './index.html';
  });
  // Theme toggle
  const btnTheme = $('#btnTheme');
  function applyTheme(){
    const dark = state.theme === 'dark';
    document.documentElement.classList.toggle('theme-dark', dark);
    btnTheme.textContent = dark ? 'Dark' : 'Light';
  }
  btnTheme.addEventListener('click', ()=>{ state.theme = state.theme === 'dark' ? 'light' : 'dark'; try{ localStorage.setItem('theme', state.theme);}catch{} applyTheme(); });
  applyTheme();
  // About: creators
  const btnCreators = document.getElementById('btnCreators'); if (btnCreators){ btnCreators.addEventListener('click', openCreatorsModal); }
}

function animateBackground(){
  const c = document.getElementById('bg'); const ctx = c.getContext('2d'); let w,h; const px=window.devicePixelRatio||1;
  function resize(){ w=c.width=innerWidth*px; h=c.height=innerHeight*px; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; }
  resize(); addEventListener('resize', resize);
  const N=64; const nodes=Array.from({length:N},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4*px,vy:(Math.random()-.5)*.4*px}));
  function loop(){ ctx.clearRect(0,0,w,h); for(const p of nodes){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; }
    ctx.strokeStyle='rgba(148,163,184,0.08)'; ctx.lineWidth=px; for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){ const a=nodes[i],b=nodes[j]; const dx=a.x-b.x, dy=a.y-b.y, d=dx*dx+dy*dy; if(d<(140*px)**2){ const t = 1 - d/((140*px)**2); ctx.globalAlpha=t*0.7; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
    ctx.globalAlpha=1; requestAnimationFrame(loop); }
  loop();
}

async function init(){
  animateBackground();
  loadSaved(); await loadRuntime();
  // If a token exists but JWT use is off, enable it by default (smoother auth when backend enforces JWT)
  try{ if(!state.useJwt && getIdToken()){ setUseJwt(true); } }catch{}
  // Reflect into Settings UI after runtime merged
  wireSettings(); renderUserBadge(); wireTabs(); wireUpload(); wireApiDocs(); wireActions();
  $('#year').textContent = new Date().getFullYear();
  setInterval(pingHealth, 2000); pingHealth();
}

document.addEventListener('DOMContentLoaded', init);

// Expose a small hook for OIDC to refresh UI state after login/logout
window.updateAuthUI = function(){ try{
  renderUserBadge();
  if(getIdToken() && !state.useJwt){ setUseJwt(true); }
  // Refresh Settings panel checkbox if mounted
  const cb = document.getElementById('useJwtGlobal'); if (cb) cb.checked = state.useJwt;
}catch{} };
