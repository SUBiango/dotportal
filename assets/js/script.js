/**
 * DOT PORTAL — Warm Editorial
 * Theme toggle, scroll reveal, accordion, mobile nav
 */

document.addEventListener('DOMContentLoaded', init);

function init() {
    initTheme();
    initHeader();
    initMobileNav();
    initPhilosophy();
    initSmoothScroll();
    initScrollReveal();
    initFooterYear();
}

function initFooterYear() {
    const footerYear = document.querySelector('.footer-year');
    if (!footerYear) return;

    footerYear.textContent = new Date().getFullYear();
}

// === THEME TOGGLE ===
function initTheme() {
    const html   = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    const saved       = localStorage.getItem('dp-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial     = saved || (prefersDark ? 'dark' : 'light');

    applyTheme(html, initial);
    updateToggleIcon(toggle, initial);

    toggle?.addEventListener('click', () => {
        const isDark   = html.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(html, newTheme);
        updateToggleIcon(toggle, newTheme);
        localStorage.setItem('dp-theme', newTheme);
        const mobileToggle = document.getElementById('mobileThemeToggle');
        if (mobileToggle) {
            updateToggleIcon(mobileToggle, newTheme);
            const span = mobileToggle.querySelector('span');
            if (span) span.textContent = newTheme === 'dark' ? 'Light mode' : 'Dark mode';
        }
    });
}

function applyTheme(html, theme) {
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
}

// The moon/sun SVGs are toggled purely via CSS ([data-theme] selectors);
// here we only keep the accessible label in sync.
function updateToggleIcon(btn, theme) {
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

// === HEADER SCROLL EFFECT ===
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    const handle = () => header.classList.toggle('scrolled', window.scrollY > 80);
    window.addEventListener('scroll', handle, { passive: true });
    handle();
}

// === MOBILE NAVIGATION ===
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    if (!toggle) return;
    let isOpen = false;

    const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const themeLabel   = currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    const themeTxt     = currentTheme === 'dark' ? 'Light mode' : 'Dark mode';

    const moonSvg = '<svg class="icon icon-moon" viewBox="0 0 384 512" aria-hidden="true"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>';
    const sunSvg  = '<svg class="icon icon-sun" viewBox="0 0 512 512" aria-hidden="true"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l108 19.9c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 499c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.setAttribute('role', 'dialog');
    mobileMenu.setAttribute('aria-modal', 'true');
    mobileMenu.innerHTML = `
        <a href="#products"   class="nav-link">Products</a>
        <a href="#philosophy" class="nav-link">Philosophy</a>
        <a href="#contact"    class="nav-link">Get in touch</a>
        <div class="mobile-menu-footer">
            <button class="mobile-theme-toggle" id="mobileThemeToggle" aria-label="${themeLabel}">
                ${moonSvg}${sunSvg}
                <span>${themeTxt}</span>
            </button>
        </div>
    `;
    document.body.appendChild(mobileMenu);

    mobileMenu.querySelector('#mobileThemeToggle')?.addEventListener('click', () => {
        document.getElementById('themeToggle')?.click();
    });

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        toggle.classList.toggle('active', isOpen);
        mobileMenu.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });

    function closeMenu() {
        isOpen = false;
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        toggle.setAttribute('aria-expanded', 'false');
    }
}

// === PHILOSOPHY ACCORDION ===
function initPhilosophy() {
    const items = document.querySelectorAll('.philosophy-item');
    if (!items.length) return;

    function setItemExpanded(item, expanded) {
        const content = item.querySelector('.philosophy-content');
        if (!content) return;

        if (expanded) {
            item.classList.add('active');
            item.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
            item.classList.remove('active');
            item.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = '0px';
        }
    }

    // Sync inline max-heights with any pre-existing active state.
    items.forEach(item => {
        setItemExpanded(item, item.classList.contains('active'));
    });

    items.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => setItemExpanded(i, false));
            if (!isActive) setItemExpanded(item, true);
        });

        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    window.addEventListener('resize', () => {
        items.forEach(item => {
            if (item.classList.contains('active')) {
                setItemExpanded(item, true);
            }
        });
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const header = document.getElementById('header');
            const headerH = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// === SCROLL REVEAL (IntersectionObserver) ===
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}
