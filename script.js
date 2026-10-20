// ===== Terminal Typing Effect =====
const typingTexts = [
    "nexgate --port 8080 --workers 16 --rate-limit redis",
    "tinylite-server --protocol resp --aof-fsync everysec",
    "task-worker --queues high,default --dlq-enabled",
    "os3c-scan --engines nuclei,nmap,subfinder,katana",
    "Building low-latency distributed backend systems"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeText() {
    if (!typingElement) return;
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 28 : 55;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 400;
    }

    setTimeout(typeText, typeSpeed);
}

// ===== Interactive Multi-Tab Code Window =====
const tabMeta = {
    nexgate: {
        metric: "THROUGHPUT: 18,400 req/s • P99: 1.74ms",
        lang: "Java 21 • Netty NIO"
    },
    tinylite: {
        metric: "PROTOCOL: RESP2/3 • EVICTION: O(log n) Heap",
        lang: "Python 3.12 • Asyncio"
    },
    queue: {
        metric: "WORKERS: 8 ACTIVE • RETRY: Exp Backoff + DLQ",
        lang: "Python • Redis Streams"
    }
};

function initCodeTabs() {
    const tabs = document.querySelectorAll('.code-tab');
    const panes = document.querySelectorAll('.code-pane');
    const metricEl = document.getElementById('terminalMetric');
    const langEl = document.getElementById('terminalLang');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const activePane = document.getElementById(`tab-${target}`);
            if (activePane) activePane.classList.add('active');

            if (tabMeta[target]) {
                if (metricEl) metricEl.textContent = tabMeta[target].metric;
                if (langEl) langEl.textContent = tabMeta[target].lang;
            }
        });
    });
}

// ===== Project Category Filter Pills =====
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#projectsGrid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden-card');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    });
}

// ===== One-Click Copy Email Button =====
function initCopyEmail() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const copyText = document.getElementById('copyEmailText');
    if (!copyBtn || !copyText) return;

    copyBtn.addEventListener('click', async () => {
        const email = copyBtn.getAttribute('data-email') || 'ayushdixitvsecpanki@gmail.com';
        try {
            await navigator.clipboard.writeText(email);
            const original = copyText.textContent;
            copyText.textContent = 'Copied to clipboard!';
            copyBtn.style.borderColor = '#10b981';
            setTimeout(() => {
                copyText.textContent = original;
                copyBtn.style.borderColor = '';
            }, 2200);
        } catch (_) {
            window.location.href = `mailto:${email}`;
        }
    });
}

// ===== Ambient Cursor Spotlight =====
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

// ===== Navbar Scroll & Active Section Highlight =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== IntersectionObserver Reveal Animations =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section-header, .about-narrative, .pillar-card, .skill-card, .project-card, .stats-card, .contact-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Initialize Everything on DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    typeText();
    initCodeTabs();
    initProjectFilters();
    initCopyEmail();
    initCursorGlow();
});
