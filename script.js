// ===== 1. Paper <-> Carbon Theme Switcher =====
function initThemeSwitcher() {
    const html = document.documentElement;
    const btn = document.getElementById('themeSwitch');
    const label = document.getElementById('themeLabel');
    const saved = localStorage.getItem('ad-theme') || 'paper';

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (label) {
            label.textContent = theme === 'paper' ? 'Carbon' : 'Paper';
        }
        localStorage.setItem('ad-theme', theme);
    }

    applyTheme(saved);

    if (btn) {
        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') === 'carbon' ? 'paper' : 'carbon';
            applyTheme(current);
        });
    }
}

// ===== 2. Sliding Underline Navbar Indicator =====
function initNavIndicator() {
    const navItems = document.getElementById('navItems');
    const indicator = document.getElementById('navIndicator');
    const links = document.querySelectorAll('.nav-link');
    if (!navItems || !indicator || !links.length) return;

    function moveIndicator(el) {
        if (!el) return;
        const parentRect = navItems.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        indicator.style.width = `${rect.width - 16}px`;
        indicator.style.transform = `translateX(${rect.left - parentRect.left + 8}px)`;
    }

    const activeLink = document.querySelector('.nav-link.active') || links[0];
    moveIndicator(activeLink);

    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveIndicator(link));
    });

    navItems.addEventListener('mouseleave', () => {
        const currentActive = document.querySelector('.nav-link.active') || links[0];
        moveIndicator(currentActive);
    });

    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.nav-link.active') || links[0];
        moveIndicator(currentActive);
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 220;
            if (window.scrollY >= top) {
                current = sec.getAttribute('id');
            }
        });

        if (current) {
            links.forEach(l => {
                l.classList.toggle('active', l.getAttribute('data-section') === current);
            });
            const nowActive = document.querySelector('.nav-link.active');
            if (nowActive) moveIndicator(nowActive);
        }
    }, { passive: true });
}

// ===== 3. Interactive Terminal Tabs with Sliding Glider =====
const tabMetaMap = {
    nexgate: "Java 21 • <1.8ms P99",
    tinylite: "Python Asyncio • RESP2/3",
    queue: "Redis • Exp Backoff + DLQ"
};

function initTerminalTabs() {
    const tabs = document.querySelectorAll('.term-tab');
    const panes = document.querySelectorAll('.term-pane');
    const glider = document.getElementById('termTabGlider');
    const metaBadge = document.getElementById('termMeta');
    if (!tabs.length) return;

    function positionGlider(tab) {
        if (!glider || !tab) return;
        const parentRect = tab.parentElement.getBoundingClientRect();
        const rect = tab.getBoundingClientRect();
        glider.style.width = `${rect.width}px`;
        glider.style.transform = `translateX(${rect.left - parentRect.left}px)`;
    }

    positionGlider(document.querySelector('.term-tab.active') || tabs[0]);
    window.addEventListener('resize', () => {
        positionGlider(document.querySelector('.term-tab.active') || tabs[0]);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            positionGlider(tab);

            const targetPane = document.getElementById(`pane-${target}`);
            if (targetPane) targetPane.classList.add('active');
            if (metaBadge && tabMetaMap[target]) {
                metaBadge.textContent = tabMetaMap[target];
            }
        });
    });
}

// ===== 4. Smooth Architecture Accordion Drawers =====
function initArchitectureDrawers() {
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, idx) => {
        const toggle = item.querySelector('.arch-toggle');
        if (!toggle) return;

        if (idx === 0) {
            item.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
        }

        toggle.addEventListener('click', () => {
            const isOpen = item.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    });
}

// ===== 5. Category Filter =====
function initWorkFilter() {
    const chips = document.querySelectorAll('.filter-chip');
    const items = document.querySelectorAll('.work-item');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            items.forEach(item => {
                const cat = item.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    item.classList.remove('is-filtered-out');
                } else {
                    item.classList.add('is-filtered-out');
                }
            });
        });
    });
}

// ===== 6. Scroll Reveal & Top Progress Bar =====
function initScrollChoreography() {
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        if (!progressBar) return;
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = `${scrolled}%`;
    }, { passive: true });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(section => {
        revealObserver.observe(section);
    });
}

// ===== 7. One-Click Copy Email Buttons =====
function initCopyButtons() {
    document.querySelectorAll('.copy-trigger').forEach(btn => {
        btn.addEventListener('click', async () => {
            const email = btn.getAttribute('data-email') || 'ayushdixitvsecpanki@gmail.com';
            const label = btn.querySelector('.copy-label');
            if (!label) return;
            const prev = label.textContent;
            try {
                await navigator.clipboard.writeText(email);
                label.textContent = 'Copied to clipboard!';
                setTimeout(() => { label.textContent = prev; }, 2000);
            } catch (_) {
                window.location.href = `mailto:${email}`;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initNavIndicator();
    initTerminalTabs();
    initArchitectureDrawers();
    initWorkFilter();
    initScrollChoreography();
    initCopyButtons();
});
