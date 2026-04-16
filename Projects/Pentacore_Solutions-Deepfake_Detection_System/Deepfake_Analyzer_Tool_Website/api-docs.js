const qs = (s)=>document.querySelector(s);
const healthStatus = qs('#healthStatus');
const yearEl = qs('#year');
const useJwtEl = qs('#useJwt');
const jwtStatusEl = qs('#jwtStatus');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple toast for Health legend (mobile)
function showToast(msg){
  try{
    let t = document.getElementById('__toast');
    if (!t){
      t = document.createElement('div');
      t.id='__toast';
      Object.assign(t.style, {
        position:'fixed', bottom:'14px', left:'50%', transform:'translateX(-50%)',
        background:'rgba(15,23,42,0.9)', color:'#e2e8f0', padding:'8px 12px', borderRadius:'8px',
        fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize:'12px', zIndex:'10000',
        boxShadow:'0 4px 14px rgba(0,0,0,0.35)', opacity:'0', transition:'opacity .2s ease, transform .2s ease'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
    clearTimeout(showToast.__timer); showToast.__timer = setTimeout(()=>{ t.style.opacity='0'; }, 2000);
  }catch{}
}

// Internal bases (no inputs on page)
let ENGINE_BASE = 'http://localhost:8001';
let CREDITS_BASE = 'http://localhost:8003';

let healthTimer;
let busy=false;
// Load website runtime config if present
async function loadRuntime(){
  try{
    const res = await fetch('./runtime-config.json', { cache: 'no-store' });
    if (!res.ok) return;
    const cfg = await res.json();
    if (cfg && cfg.engine_base_url) ENGINE_BASE = cfg.engine_base_url.replace(/\/$/,'');
    if (cfg && cfg.credits_base_url) CREDITS_BASE = cfg.credits_base_url.replace(/\/$/,'');
  }catch{}
}

async function ping(){
  if (busy) return;
  busy=true;
  // Ping engine health and credits (via /health if present, else /price)
  const headers = {};
  const token = getAuthToken();
  if (useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
  const engineUrl = `${ENGINE_BASE.replace(/\/$/,'')}/health`;
  let engineOk=false;
  try{
    const r = await fetch(engineUrl, { cache:'no-store', headers });
    engineOk = r.ok;
  }catch{}
  const msg = `Engine: ${engineOk?'Healthy':'Unreachable'}`;
  healthStatus.textContent = msg;
  healthStatus.style.color = engineOk ? '#14532d' : '#7f1d1d';
  busy=false;
}
function start(){ clearInterval(healthTimer); ping(); healthTimer=setInterval(ping,1500); }

// Mobile legend: tap dot to show text
if (healthStatus){
  const mql = window.matchMedia('(max-width: 640px)');
  function onTap(){ if (mql.matches){ const msg = healthStatus.textContent || 'Health status'; showToast(msg); } }
  healthStatus.addEventListener('click', onTap);
  healthStatus.addEventListener('touchstart', onTap, { passive:true });
}

// API key helpers
const apiKeyEl = qs('#apiKey');
const btnGenKey = qs('#btnGenKey');
const btnCopyKey = qs('#btnCopyKey');
const keyStatus = qs('#keyStatus');
const btnQuickTry = qs('#btnQuickTry');
const quickTryStatus = qs('#quickTryStatus');
const btnQuickCredits = qs('#btnQuickCredits');
const quickCreditsStatus = qs('#quickCreditsStatus');
const btnDownloadPostman = qs('#btnDownloadPostman');
const postmanStatus = qs('#postmanStatus');

function genKey(){
  // Simple 24-char base36 token
  return 'key_' + Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 14);
}

function renderTemplates(){
  const BASE=ENGINE_BASE.replace(/\/$/,'');
  const CREDITS=CREDITS_BASE.replace(/\/$/,'');
  const USER_ID=(apiKeyEl?.value||'YOUR_API_KEY');
  const token = getAuthToken();
  const useAuth = !!(useJwtEl && useJwtEl.checked && token);
  const AUTH_CURL = useAuth ? ` -H \"Authorization: Bearer ${token}\"` : '';
  const AUTH_FETCH = useAuth ? `, headers: { Authorization: 'Bearer ${token}' }` : '';
  const AUTH_NODE = useAuth ? `, Authorization: 'Bearer ${token}'` : '';
  document.querySelectorAll('.tmpl').forEach(el=>{
    const tpl = el.getAttribute('data-template');
    if (!tpl) return;
    // rudimentary conditional for Python examples
    let out = tpl
      .replaceAll('{{BASE}}', BASE||'http://localhost:8001')
      .replaceAll('{{CREDITS_BASE}}', CREDITS||'http://localhost:8003')
      .replaceAll('{{USER_ID}}', USER_ID)
      .replaceAll('{{AUTH_CURL}}', AUTH_CURL)
      .replaceAll('{{AUTH_FETCH}}', AUTH_FETCH)
      .replaceAll('{{AUTH_NODE}}', AUTH_NODE);
    if (useAuth) {
      out = out.replaceAll('{{#IF_AUTH}}', '').replaceAll('{{/IF_AUTH}}', '');
      out = out.replaceAll('TOKEN', token);
    } else {
      // remove conditional lines entirely
      out = out.replace(/\{\{#IF_AUTH}}[\s\S]*?\{\{\/IF_AUTH}}/g, '');
    }
    el.textContent = out;
  });
}

if (btnGenKey) btnGenKey.addEventListener('click', ()=>{ apiKeyEl.value = genKey(); try{ localStorage.setItem('api_docs_user_id', apiKeyEl.value);}catch{} keyStatus.textContent = 'Generated'; renderTemplates(); setTimeout(()=>keyStatus.textContent='',2000); });
if (btnCopyKey) btnCopyKey.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(apiKeyEl.value||''); keyStatus.textContent='Copied'; setTimeout(()=>keyStatus.textContent='',2000);}catch{ keyStatus.textContent='Copy failed'; }});
if (apiKeyEl) apiKeyEl.addEventListener('input', ()=>{ try{ localStorage.setItem('api_docs_user_id', apiKeyEl.value);}catch{} renderTemplates(); });
// No inputs; templates re-render on key or JWT toggle

// Quick Try: ping /health and show status inline
if (btnQuickTry){
  btnQuickTry.addEventListener('click', async ()=>{
    try{
      if (quickTryStatus){ quickTryStatus.textContent='Pinging...'; quickTryStatus.style.color='#334155'; }
  const headers={}; const token=getAuthToken(); if (useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${ENGINE_BASE.replace(/\/$/,'')}/health`, { headers, cache:'no-store' });
      let msg = `HTTP ${res.status}`; let ok = res.ok;
      try{ const data = await res.json(); msg += ` — ${JSON.stringify(data)}`; }catch{}
      if (quickTryStatus){ quickTryStatus.textContent = msg; quickTryStatus.style.color = ok ? '#14532d' : '#7f1d1d'; }
    }catch(e){ if (quickTryStatus){ quickTryStatus.textContent = String(e); quickTryStatus.style.color='#7f1d1d'; } }
  });
}

// Quick Try Credits Balance
if (btnQuickCredits){
  btnQuickCredits.addEventListener('click', async ()=>{
    const base=CREDITS_BASE.replace(/\/$/,''); const user=(apiKeyEl?.value||'').trim();
    if(!base||!user){ if(quickCreditsStatus){ quickCreditsStatus.textContent='Set Credits Base URL and API Key'; quickCreditsStatus.style.color='#7f1d1d'; } return; }
    try{
      if (quickCreditsStatus){ quickCreditsStatus.textContent='Checking...'; quickCreditsStatus.style.color='#334155'; }
  const headers={}; const token=getAuthToken(); if (useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${base}/credits/${encodeURIComponent(user)}`, { headers, cache:'no-store' });
      let msg = `HTTP ${res.status}`; let ok = res.ok;
      try{ const data = await res.json(); if (typeof data.balance !== 'undefined') msg += ` — Balance: ${data.balance}`; else msg += ` — ${JSON.stringify(data)}`; }catch{}
      if (quickCreditsStatus){ quickCreditsStatus.textContent = msg; quickCreditsStatus.style.color = ok ? '#14532d' : '#7f1d1d'; }
    }catch(e){ if (quickCreditsStatus){ quickCreditsStatus.textContent = String(e); quickCreditsStatus.style.color='#7f1d1d'; } }
  });
}

// Build and download a Postman collection from current config
function buildPostmanCollection(){
  const BASE=ENGINE_BASE.replace(/\/$/,'')||'http://localhost:8001';
  const CBASE=CREDITS_BASE.replace(/\/$/,'')||'http://localhost:8003';
  const USER_ID=(apiKeyEl?.value||'YOUR_API_KEY');
  const token=getAuthToken(); const sendAuth=!!(useJwtEl?.checked && token);
  const auth = sendAuth ? { type: 'bearer', bearer: [{ key:'token', value: token, type:'string' }] } : undefined;
  const asUrl = (full)=>{ try{ const u=new URL(full); return { protocol:u.protocol.replace(':',''), host:u.hostname.split('.'), port:u.port?u.port:undefined, path:u.pathname.replace(/^\//,'').split('/').filter(Boolean) }; }catch{ return { raw: full }; } };
  const items = [
    {
      name: 'Health',
      request: { method:'GET', url: asUrl(`${BASE}/health`), auth }
    },
    {
      name: 'Predict (video)',
      request: {
        method:'POST',
        url: asUrl(`${BASE}/predict`),
        auth,
        body: {
          mode: 'formdata',
          formdata: [
            { key:'file', type:'file', src:['/path/to/video.mp4'] },
            { key:'explain', value:'true', type:'text' },
            { key:'user_id', value: USER_ID, type:'text' }
          ]
        }
      }
    },
    {
      name: 'Predict (image)',
      request: {
        method:'POST', url: asUrl(`${BASE}/predict-image`), auth,
        body: { mode:'formdata', formdata:[
          { key:'file', type:'file', src:['/path/to/image.jpg'] },
          { key:'user_id', value: USER_ID, type:'text' }
        ] }
      }
    },
    {
      name: 'History',
      request: { method:'GET', url: asUrl(`${BASE}/history/${encodeURIComponent(USER_ID)}`), auth }
    },
    {
      name: 'Credits: Register',
      request: { method:'POST', url: asUrl(`${CBASE}/users/register`), auth, body:{ mode:'raw', raw: JSON.stringify({ user_id: USER_ID }, null, 2) , options:{ raw:{ language:'json' } } } }
    },
    {
      name: 'Credits: Balance',
      request: { method:'GET', url: asUrl(`${CBASE}/credits/${encodeURIComponent(USER_ID)}`), auth }
    },
    {
      name: 'Credits: Earn (ad)',
      request: { method:'POST', url: asUrl(`${CBASE}/credits/earn/ad`), auth, body:{ mode:'raw', raw: JSON.stringify({ user_id: USER_ID, ref:'ad-1234' }, null, 2), options:{ raw:{ language:'json' } } } }
    }
  ];
  return {
    info: { name: 'Deepfake Analyzer Collection', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
    item: items,
    variable: [
      { key:'ENGINE_BASE', value: BASE },
      { key:'CREDITS_BASE', value: CBASE },
      { key:'USER_ID', value: USER_ID }
    ]
  };
}

function downloadJsonFile(obj, filename){
  try{
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 5000);
  }catch{}
}

if (btnDownloadPostman){
  btnDownloadPostman.addEventListener('click', ()=>{
    try{ if (postmanStatus){ postmanStatus.textContent='Generating...'; postmanStatus.style.color='#334155'; } const col = buildPostmanCollection(); downloadJsonFile(col, 'deepfake-analyzer.postman_collection.json'); if (postmanStatus){ postmanStatus.textContent='Downloaded'; postmanStatus.style.color='#14532d'; setTimeout(()=>postmanStatus.textContent='',2000); } }
    catch(e){ if (postmanStatus){ postmanStatus.textContent=String(e); postmanStatus.style.color='#7f1d1d'; } }
  });
}

(function wireCreditsButtons(){
  const btnRegisterUser = qs('#btnRegisterUser');
  const btnCheckBalance = qs('#btnCheckBalance');
  const btnEarnAd = qs('#btnEarnAd');
  const creditsOpStatus = qs('#creditsOpStatus');
  function statusMsg(msg, ok=true){ if(!creditsOpStatus) return; creditsOpStatus.textContent=msg; creditsOpStatus.style.color = ok ? '#334155' : '#7f1d1d'; }
  async function doRegister(){
    const base=CREDITS_BASE.replace(/\/$/,''); const user=(apiKeyEl?.value||'').trim();
    if(!base||!user){ statusMsg('Set Credits Base URL and API Key', false); return; }
    try{
  const headers={'Content-Type':'application/json'}; const token=getAuthToken(); if(useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${base}/users/register`, { method:'POST', headers, body: JSON.stringify({ user_id: user }) });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); statusMsg(`Registered. Balance: ${data.balance}${data.awarded?' (+welcome)':''}`);
    }catch(e){ statusMsg(String(e), false); }
  }
  async function doBalance(){
    const base=CREDITS_BASE.replace(/\/$/,''); const user=(apiKeyEl?.value||'').trim();
    if(!base||!user){ statusMsg('Set Credits Base URL and API Key', false); return; }
    try{
  const headers={}; const token=getAuthToken(); if(useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${base}/credits/${encodeURIComponent(user)}`, { headers });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); statusMsg(`Balance: ${data.balance}`);
    }catch(e){ statusMsg(String(e), false); }
  }
  async function doEarn(){
    const base=CREDITS_BASE.replace(/\/$/,''); const user=(apiKeyEl?.value||'').trim();
    if(!base||!user){ statusMsg('Set Credits Base URL and API Key', false); return; }
    try{
      const ref = 'ad-' + Math.random().toString(36).slice(2, 10);
  const headers={'Content-Type':'application/json'}; const token=getAuthToken(); if(useJwtEl?.checked && token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${base}/credits/earn/ad`, { method:'POST', headers, body: JSON.stringify({ user_id: user, ref }) });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); statusMsg(`Earned. Balance: ${data.balance}${data.awarded?' (+1)':''}`);
    }catch(e){ statusMsg(String(e), false); }
  }
  if (btnRegisterUser) btnRegisterUser.addEventListener('click', doRegister);
  if (btnCheckBalance) btnCheckBalance.addEventListener('click', doBalance);
  if (btnEarnAd) btnEarnAd.addEventListener('click', doEarn);
})();

function getAuthToken(){
  try{
    const raw = localStorage.getItem('cogTokens');
    if (!raw) return null; const obj = JSON.parse(raw);
    if (!obj) return null;
    // Prefer id_token for API Gateway JWT authorizer (audience on aud); fall back to access_token
    return obj.id_token || obj.access_token || null;
  }catch{ return null; }
}

function updateJwtStatus(){
  if (!jwtStatusEl || !useJwtEl) return;
  const token = getAuthToken();
  if (useJwtEl.checked){ jwtStatusEl.textContent = token ? 'Token found (preferring id_token): Authorization will be sent' : 'No token found: login on the Home page'; }
  else { jwtStatusEl.textContent = 'Authorization header disabled'; }
}

if (useJwtEl){
  try{ const saved = localStorage.getItem('api_docs_use_jwt'); if (saved) useJwtEl.checked = saved === 'true'; }catch{}
  useJwtEl.addEventListener('change', ()=>{ try{ localStorage.setItem('api_docs_use_jwt', String(useJwtEl.checked)); }catch{} renderTemplates(); updateJwtStatus(); });
}

// Restore saved API key if available
try{ const savedKey = localStorage.getItem('api_docs_user_id'); if (savedKey && apiKeyEl) apiKeyEl.value = savedKey; }catch{}

(async ()=>{
  // subtle page fade-in
  document.body.style.opacity = '0';
  await loadRuntime(); start(); renderTemplates(); updateJwtStatus();
  // Auto-generate API key on first load if empty
  try{
    if (apiKeyEl && (!apiKeyEl.value || !apiKeyEl.value.trim())){
      const newKey = genKey(); apiKeyEl.value = newKey; localStorage.setItem('api_docs_user_id', newKey);
    }
  }catch{}
  renderTemplates();
  requestAnimationFrame(()=>{ document.body.style.transition = 'opacity .35s ease'; document.body.style.opacity = '1'; });
})();

// Enhance code blocks with a small copy button
window.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('pre.code').forEach(pre=>{
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button'); btn.textContent='Copy'; btn.className='btn mini copy-btn'; btn.style.position='absolute'; btn.style.right='8px'; btn.style.top='8px';
    btn.addEventListener('click', async ()=>{
      try{ const code = pre.querySelector('code')?.textContent||''; await navigator.clipboard.writeText(code); btn.textContent='Copied'; setTimeout(()=> btn.textContent='Copy', 1500); }catch{}
    });
    pre.style.position='relative'; pre.appendChild(btn);
  });
});
