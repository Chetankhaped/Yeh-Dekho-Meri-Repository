// Minimal OIDC wiring using oidc-client-ts
// Configure `authority` and `client_id` below, then use home.html -> Login.
// Note: this script assumes oidc-client-ts is available as an ES module via CDN.
// You can switch to bundling locally if needed.

let userManager = null;

async function loadConfig(){
  try {
    const res = await fetch('./config.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json && json.oidc ? json.oidc : null;
  } catch { return null; }
}

async function initOidc(){
  try{
    const cfg = await loadConfig();
    if (!cfg) throw new Error('Missing OIDC config');
    const authority = cfg.authority;
    const client_id = cfg.client_id;
    const logoutDomain = cfg.logout_domain || '';
    const redirectPath = cfg.redirect_path || window.location.pathname;
    const redirect_uri = window.location.origin + redirectPath;
    const scope = 'email openid profile';

  // Load OIDC client as an ESM bundle (jsDelivr +esm ensures proper module format and CORS headers)
  const mod = await import('https://cdn.jsdelivr.net/npm/oidc-client-ts@2.3.0/+esm');
  const { UserManager } = mod;
    userManager = new UserManager({ authority, client_id, redirect_uri, response_type: 'code', scope });

    // Expose helpers for app.js and index.html
    window.__oidc = {
      signInRedirect: () => userManager.signinRedirect(),
      signOutRedirect: async () => {
        const logoutUri = redirect_uri;
        if (logoutDomain) {
          window.location.href = `${logoutDomain}/logout?client_id=${client_id}&logout_uri=${encodeURIComponent(logoutUri)}`;
        } else {
          await userManager.signoutRedirect();
        }
      },
    };

    // Handle callback if applicable
    const url = new URL(window.location.href);
    if (url.searchParams.has('code')){
      try{
        const user = await userManager.signinCallback();
        if (user && user.id_token){
          localStorage.setItem('cogTokens', JSON.stringify({ id_token: user.id_token, access_token: user.access_token, refresh_token: user.refresh_token, ts: Date.now() }));
          try{ localStorage.setItem('useJwt', 'true'); localStorage.setItem('api_docs_use_jwt','true'); }catch{}
          if (window.updateAuthUI) window.updateAuthUI();
          // After successful login, if we're on landing page redirect to dashboard for better UX
          try{
            const path = window.location.pathname;
            if (/index\.html?$/.test(path) || path === '/' ){ window.location.replace('./deepfake_analyzer_tool.html'); return; }
          }catch{}
        }
        // Clean query params
        const clean = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, clean);
      }catch(e){ console.error('OIDC callback failed', e); }
    }
  }catch(e){
    console.warn('OIDC init skipped:', e);
    // Provide a minimal Hosted UI fallback so Login/Logout still work
    window.__oidc = {
      signInRedirect: async () => {
        try{
          const res = await fetch('./config.json', { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          const cfg = json && json.oidc ? json.oidc : null;
          if (!cfg) throw new Error('Missing OIDC config');
          const client_id = cfg.client_id;
          const redirectPath = cfg.redirect_path || window.location.pathname;
          const redirect_uri = window.location.origin + redirectPath;
          const scope = 'openid email profile';
          const hosted = (cfg.logout_domain || '').replace(/\/$/, '');
          if (!hosted) throw new Error('Missing Hosted UI domain');
          const url = `${hosted}/oauth2/authorize?client_id=${encodeURIComponent(client_id)}&response_type=code&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
          window.location.href = url;
        }catch(err){ console.error(err); alert('Login not configured. Check oidc.js'); }
      },
      signOutRedirect: async () => {
        try{
          const res = await fetch('./config.json', { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          const cfg = json && json.oidc ? json.oidc : null;
          if (!cfg) return;
          const client_id = cfg.client_id;
          const redirectPath = cfg.redirect_path || window.location.pathname;
          const redirect_uri = window.location.origin + redirectPath;
          const hosted = (cfg.logout_domain || '').replace(/\/$/, '');
          if (hosted){ window.location.href = `${hosted}/logout?client_id=${client_id}&logout_uri=${encodeURIComponent(redirect_uri)}`; }
        }catch(err){ console.error(err); }
      },
    };
  }
}

initOidc();
