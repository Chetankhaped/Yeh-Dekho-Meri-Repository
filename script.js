document.addEventListener('DOMContentLoaded', () => {

    /* ── Theme toggle ── */
    const toggle = document.getElementById('theme-toggle');
    const icon   = toggle.querySelector('i');
    const saved  = localStorage.getItem('theme');
    if (saved) document.body.setAttribute('data-theme', saved);
    syncIcon();

    toggle.addEventListener('click', () => {
        const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        syncIcon();
    });

    function syncIcon() {
        const dark = document.body.getAttribute('data-theme') === 'dark';
        icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }

    /* ── Smooth scroll for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ── Typed text effect ── */
    const phrases = [
        'ls -la ./Projects/',
        'echo "IoT \u00b7 AI \u00b7 Full-Stack \u00b7 Security"',
        'git log --oneline --all',
        'cat README.md | head -5',
    ];
    const typedEl = document.getElementById('typed-text');
    let phraseIdx = 0, charIdx = 0, deleting = false;
    function typeLoop() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typeLoop, 2000);
                return;
            }
            setTimeout(typeLoop, 60 + Math.random() * 40);
        } else {
            typedEl.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(typeLoop, 400);
                return;
            }
            setTimeout(typeLoop, 30);
        }
    }
    typeLoop();

    /* ── Particle background ── */
    initParticles();

    /* ── Load projects ── */
    loadProjects();
});

/* ============================================================
   Particles
   ============================================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const COUNT = 60;
    const MAX_DIST = 140;

    function resize() {
        w = canvas.width  = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
        dots.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5
        });
    }

    function frame() {
        ctx.clearRect(0, 0, w, h);
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const dotColor = isDark ? 'rgba(56,189,248,' : 'rgba(2,132,199,';
        const lineColor = isDark ? 'rgba(56,189,248,' : 'rgba(2,132,199,';

        dots.forEach(d => {
            d.x += d.vx; d.y += d.vy;
            if (d.x < 0 || d.x > w) d.vx *= -1;
            if (d.y < 0 || d.y > h) d.vy *= -1;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = dotColor + '0.5)';
            ctx.fill();
        });

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.strokeStyle = lineColor + (0.15 * (1 - dist / MAX_DIST)) + ')';
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(frame);
    }
    frame();
}

/* ============================================================
   Projects loader
   ============================================================ */
async function loadProjects() {
    const terminal  = document.getElementById('terminal');
    const spinner   = document.getElementById('spinner');
    const grid      = document.getElementById('projects-grid');
    const filterBar = document.getElementById('filter-bar');

    const spinFrames = ['\u280b','\u2819','\u2839','\u2838','\u283c','\u2834'];
    let spinIdx = 0;
    const spinTimer = setInterval(() => {
        if (spinner) spinner.textContent = spinFrames[spinIdx++ % spinFrames.length];
    }, 100);

    function tLog(text, cls) {
        const p = document.createElement('p');
        p.className = 't-line' + (cls ? ' ' + cls : '');
        p.innerHTML = '<span class="t-prompt">\$</span> ' + esc(text);
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    }

    try {
        await delay(400);
        tLog('fetch assets/projects.json');
        const res = await fetch('assets/projects.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const projects = await res.json();

        clearInterval(spinTimer);
        if (spinner) spinner.remove();
        tLog(projects.length + ' project(s) loaded', 't-ok');

        /* stats */
        const allTech = new Set();
        projects.forEach(p => (p.technologies || []).forEach(t => allTech.add(t)));
        animateCounter('stat-projects', projects.length);
        animateCounter('stat-tech', allTech.size);
        animateCounter('stat-lines', '50K+');

        /* filter buttons */
        const techCounts = {};
        projects.forEach(p => (p.technologies || []).forEach(t => {
            techCounts[t] = (techCounts[t] || 0) + 1;
        }));
        const topTech = Object.entries(techCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(e => e[0]);

        const allBtn = mkFilter('All', true);
        filterBar.appendChild(allBtn);
        topTech.forEach(t => filterBar.appendChild(mkFilter(t, false)));

        let activeFilter = 'All';

        function mkFilter(label, active) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (active ? ' active' : '');
            btn.textContent = label;
            btn.addEventListener('click', () => {
                activeFilter = label;
                filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCards(projects, activeFilter);
                tLog('filter --tech="' + label + '"', 't-dim');
            });
            return btn;
        }

        /* initial render */
        renderCards(projects, 'All');
        tLog('render complete \u2713', 't-ok');

    } catch (err) {
        clearInterval(spinTimer);
        if (spinner) spinner.remove();
        tLog('Error: ' + err.message, 't-err');
        grid.innerHTML = '<p class="projects-empty">Failed to load projects.</p>';
    }

    function renderCards(projects, filter) {
        grid.innerHTML = '';
        const repoBase = 'https://github.com/Chetankhaped/Yeh-Dekho-Meri-Repository/tree/master/';
        const filtered = filter === 'All'
            ? projects
            : projects.filter(p => (p.technologies || []).includes(filter));

        if (!filtered.length) {
            grid.innerHTML = '<p class="projects-empty">No projects match this filter.</p>';
            return;
        }

        filtered.forEach((proj, i) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            const techHtml = (proj.technologies || [])
                .map(t => '<span class="tech-pill">' + esc(t) + '</span>')
                .join('');

            let links = '<a class="btn-source" href="' + esc(repoBase + proj.path) + '" target="_blank" rel="noopener"><i class="fas fa-code"></i> Source</a>';
            if (proj.link) {
                links += '<a class="btn-repo" href="' + esc(proj.link) + '" target="_blank" rel="noopener"><i class="fab fa-github"></i> Repo</a>';
            }

            card.innerHTML =
                '<span class="card-index">0' + (i + 1) + '</span>' +
                '<h3>' + esc(proj.name) + '</h3>' +
                '<p class="p-desc">' + esc(proj.description) + '</p>' +
                '<div class="p-tech">' + techHtml + '</div>' +
                '<div class="p-links">' + links + '</div>';

            /* mouse-glow tracking */
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });

            grid.appendChild(card);

            setTimeout(() => {
                card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 80 * i);
        });
    }
}

/* ── helpers ── */
function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function animateCounter(id, target) {
    const el = document.querySelector('#' + id + ' .stat-num');
    if (!el) return;
    if (typeof target === 'string') { el.textContent = target; return; }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current;
    }, 35);
}
