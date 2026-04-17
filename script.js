document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .section h2, .section p');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // ── Projects loader ──
    loadProjects();
});

async function loadProjects() {
    const terminal = document.getElementById('projects-terminal');
    const spinner  = document.getElementById('projects-spinner');
    const grid     = document.getElementById('projects-grid');

    function termLog(text, cls = '') {
        const p = document.createElement('p');
        p.className = 'terminal-line' + (cls ? ' ' + cls : '');
        p.innerHTML = '<span class="terminal-prompt">$</span> ' + escapeHtml(text);
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    }

    try {
        termLog('fetch assets/projects.json');
        const res = await fetch('assets/projects.json');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const projects = await res.json();

        if (spinner) spinner.remove();
        termLog(`Loaded ${projects.length} project(s)`, 'terminal-success');
        termLog('Rendering cards…', 'terminal-muted');

        if (!projects.length) {
            grid.innerHTML = '<p class="projects-empty">No projects found.</p>';
            termLog('warn: manifest is empty', 'terminal-error');
            return;
        }

        const repoBase = 'https://github.com/Chetankhaped/Yeh-Dekho-Meri-Repository/tree/master/';

        projects.forEach((proj, i) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';

            const techHtml = (proj.technologies || [])
                .map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`)
                .join('');

            let linksHtml = `<a class="project-link-source" href="${escapeHtml(repoBase + proj.path)}" target="_blank" rel="noopener"><i class="fas fa-code"></i> Source</a>`;
            if (proj.link) {
                linksHtml += `<a class="project-link-external" href="${escapeHtml(proj.link)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Repo</a>`;
            }

            card.innerHTML = `
                <h3>${escapeHtml(proj.name)}</h3>
                <p class="project-desc">${escapeHtml(proj.description)}</p>
                <div class="project-tech">${techHtml}</div>
                <div class="project-links">${linksHtml}</div>
            `;

            grid.appendChild(card);

            // stagger fade-in
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 80 * i);
        });

        termLog('Done ✓', 'terminal-success');

    } catch (err) {
        if (spinner) spinner.remove();
        termLog('Error: ' + err.message, 'terminal-error');
        grid.innerHTML = '<p class="projects-empty">Failed to load projects. Run the build step first.</p>';
    }
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}