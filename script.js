/**
 * ============================================
 * SPARKLE HEAVEN - Event Management Platform
 * Shared JavaScript: Dark Mode, Animations,
 * Navbar, Mobile Menu, Toast, Modal, Ripple
 * ============================================
 */

// ---- Dark Mode ----
const DARK_KEY = 'sh_dark';

function initDarkMode() {
    const saved = localStorage.getItem(DARK_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved !== null ? saved === 'true' : prefersDark;
    setDark(isDark, false);
}

function setDark(on, animate = true) {
    document.body.classList.toggle('dark', on);
    localStorage.setItem(DARK_KEY, on);

    const toggles = document.querySelectorAll('[data-dark-toggle]');
    toggles.forEach(t => {
        t.classList.toggle('active', on);
        const icon = t.querySelector('[data-dark-icon]');
        if (icon) icon.textContent = on ? '☀️' : '🌙';
    });
}

function toggleDark() {
    const isDark = document.body.classList.contains('dark');
    setDark(!isDark);
}

// ---- Navbar Scroll ----
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () =>
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ---- Mobile Menu ----
function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('menu-open');
    const closeBtn = document.getElementById('menu-close');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (!menu) return;

    const open = () => {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ---- Scroll Reveal ----
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach(el => observer.observe(el));
}

// ---- Button Ripple ----
function initRipple() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn');
        if (!btn) return;
        btn.classList.remove('ripple-active');
        void btn.offsetWidth; // reflow
        btn.classList.add('ripple-active');
        setTimeout(() => btn.classList.remove('ripple-active'), 600);
    });
}

// ---- Toast ----
function showToast(message, type = 'info', duration = 3200) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="font-size:18px">${icons[type]}</span><span>${message}</span>
    <button onclick="this.parentElement.remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;font-size:18px;line-height:1">&times;</button>`;

    if (document.body.classList.contains('dark')) toast.classList.add('dark');
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ---- Modal ----
function openModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close modal on backdrop click
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ESC key closes modals
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
});

// ---- Range Slider Gradient ----
function initRangeSliders() {
    document.querySelectorAll('input[type="range"]').forEach(input => {
        const update = () => {
            const min = +input.min || 0;
            const max = +input.max || 100;
            const val = ((+input.value - min) / (max - min)) * 100;
            input.style.setProperty('--val', val + '%');
        };
        input.addEventListener('input', update);
        update();
    });
}

// ---- Ticket Quantity Controls ----
function initQtyControls() {
    document.querySelectorAll('.qty-control').forEach(ctrl => {
        const minus = ctrl.querySelector('[data-minus]');
        const plus = ctrl.querySelector('[data-plus]');
        const num = ctrl.querySelector('.qty-num');
        if (!num) return;

        let qty = parseInt(num.textContent) || 1;
        const min = parseInt(ctrl.dataset.min) || 1;
        const max = parseInt(ctrl.dataset.max) || 99;

        if (minus) minus.addEventListener('click', () => {
            if (qty > min) { qty--; num.textContent = qty; updateTotal(); }
        });
        if (plus) plus.addEventListener('click', () => {
            if (qty < max) { qty++; num.textContent = qty; updateTotal(); }
        });
    });
}

// ---- Pricing Total Update (Event Details) ----
function updateTotal() {
    const priceEl = document.getElementById('ticket-price');
    const qtyEl = document.querySelector('.qty-num');
    const totalEl = document.getElementById('ticket-total');
    if (!priceEl || !qtyEl || !totalEl) return;
    const price = parseFloat(priceEl.dataset.price || priceEl.textContent.replace(/[^0-9.]/g, ''));
    const qty = parseInt(qtyEl.textContent);
    totalEl.textContent = '₹' + (price * qty).toLocaleString('en-IN');
}

// ---- Dashboard Sidebar Toggle ----
function initDashSidebar() {
    const sidebar = document.getElementById('dash-sidebar');
    const toggleBtn = document.getElementById('dash-sidebar-toggle');
    const overlay = document.getElementById('dash-overlay');
    if (!sidebar) return;

    const isMobile = () => window.innerWidth < 768;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isMobile()) {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('hidden');
            } else {
                sidebar.classList.toggle('collapsed');
                document.querySelectorAll('.sidebar-label').forEach(l =>
                    l.classList.toggle('hidden', sidebar.classList.contains('collapsed'))
                );
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.add('hidden');
        });
    }
}

// ---- Dashboard Tab Navigation ----
function initDashTabs() {
    const links = document.querySelectorAll('.sidebar-link[data-section]');
    const sections = document.querySelectorAll('.dash-section');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = link.dataset.section;
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            sections.forEach(s => {
                s.classList.toggle('hidden', s.id !== target);
            });
            // Close mobile sidebar
            const sidebar = document.getElementById('dash-sidebar');
            if (sidebar && window.innerWidth < 768) {
                sidebar.classList.remove('mobile-open');
                const overlay = document.getElementById('dash-overlay');
                if (overlay) overlay.classList.add('hidden');
            }
        });
    });
}

// ---- Skeleton Loading Simulation ----
function simulateLoading(container, delay = 1200) {
    if (!container) return;
    const skeletons = container.querySelectorAll('.skeleton-card');
    const real = container.querySelectorAll('.real-card');
    skeletons.forEach(s => s.classList.remove('hidden'));
    real.forEach(r => r.classList.add('hidden'));
    setTimeout(() => {
        skeletons.forEach(s => s.classList.add('hidden'));
        real.forEach(r => r.classList.remove('hidden'));
    }, delay);
}

// ---- Filter Toggle (Mobile) ----
function initFilterToggle() {
    const btn = document.getElementById('filter-toggle');
    const sidebar = document.getElementById('filter-sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
    });
}

// ---- Testimonial Carousel ----
function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    const dots = document.querySelectorAll('.testi-dot');
    if (!track) return;

    let current = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 380;

    const goTo = (idx) => {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * cardWidth}px)`;
        dots.forEach((d, i) => {
            d.classList.toggle('bg-purple-600', i === current);
            d.classList.toggle('bg-gray-300', i !== current);
        });
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto-play
    let autoPlay = setInterval(() => goTo(current + 1), 4800);
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goTo(current + 1), 4800);
    });

    window.addEventListener('resize', () => {
        cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 380;
        goTo(current);
    });
}

// ---- Gallery Lightbox ----
function initGallery() {
    document.querySelectorAll('.gallery-item img, .works-img, .works-card-img img').forEach(img => {
        img.addEventListener('click', () => {
            const lightbox = document.createElement('div');
            lightbox.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:20px;';
            lightbox.innerHTML = `<img src="${img.src}" style="max-width:90vw;max-height:90vh;border-radius:16px;box-shadow:0 20px 80px rgba(0,0,0,0.8);">`;
            lightbox.addEventListener('click', () => lightbox.remove());
            document.body.appendChild(lightbox);
        });
    });
}

// ---- Service Tab Switching ----
function switchServiceTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.service-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });
    // Update panels
    document.querySelectorAll('.service-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const target = document.getElementById('panel-' + tabId);
    if (target) {
        target.classList.add('active');
    }
}

// ---- Works Carousel ----
// ---- Hero Collage Auto-Rotation ----
function initHeroCollage() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('hero-slider-dots');
    if (!slides.length || !dotsContainer) return;

    let current = 0;
    const total = slides.length;

    // Set first slide active
    slides[0].classList.add('active');

    // Build dots
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'hero-slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    }

    const goTo = (idx) => {
        if (idx === current) return;
        slides[current].classList.add('leaving');
        slides[current].classList.remove('active');
        dotsContainer.children[current].classList.remove('active');
        setTimeout(() => { slides[current === idx ? 0 : current].classList.remove('leaving'); }, 900);
        current = idx;
        slides[current].classList.add('active');
        dotsContainer.children[current].classList.add('active');
    };

    // Auto-play
    let timer = setInterval(() => goTo((current + 1) % total), 3000);
    const slider = document.querySelector('.hero-slider');
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => {
        timer = setInterval(() => goTo((current + 1) % total), 3000);
    });

    // Touch swipe support
    let startX = 0;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    slider.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo((current + 1) % total);
            else goTo((current - 1 + total) % total);
        }
    });
}

function initWorksCarousel() {
    const track = document.getElementById('works-track');
    const prevBtn = document.getElementById('works-prev');
    const nextBtn = document.getElementById('works-next');
    const dotsContainer = document.getElementById('works-dots');
    if (!track) return;

    let current = 0;
    const cards = track.querySelectorAll('.works-card');
    const total = cards.length;
    const visibleCards = () => Math.floor(track.parentElement.offsetWidth / 320) || 1;
    const maxIdx = () => Math.max(0, total - visibleCards());
    let cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 320;

    // Build dots (show fewer dots for groups)
    const buildDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const groups = Math.ceil(total / visibleCards());
        for (let i = 0; i < Math.min(groups, 8); i++) {
            const dot = document.createElement('div');
            dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-colors ' + (i === 0 ? 'bg-purple-600' : 'bg-gray-300');
            dot.addEventListener('click', () => goTo(i * visibleCards()));
            dotsContainer.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.children;
        const activeGroup = Math.floor(current / visibleCards());
        Array.from(dots).forEach((d, i) => {
            d.classList.toggle('bg-purple-600', i === activeGroup);
            d.classList.toggle('bg-gray-300', i !== activeGroup);
        });
    };

    const goTo = (idx) => {
        current = Math.max(0, Math.min(idx, maxIdx()));
        track.style.transform = `translateX(-${current * cardWidth}px)`;
        updateDots();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-play
    let autoPlay = setInterval(() => goTo(current + 1 > maxIdx() ? 0 : current + 1), 3500);
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => goTo(current + 1 > maxIdx() ? 0 : current + 1), 3500);
    });

    window.addEventListener('resize', () => {
        cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 320;
        buildDots();
        goTo(current);
    });

    buildDots();
}

// ---- Booking Success Modal ----
function bookNow() {
    openModal('booking-success-modal');
    showToast('🎉 Booking confirmed! Check your email.', 'success');
}

// ---- Custom Checkboxes ----
function initCheckboxes() {
    document.querySelectorAll('.custom-check').forEach(box => {
        box.addEventListener('click', () => box.classList.toggle('checked'));
    });
}

// ---- Smooth Page Transition ----
function initPageTransition() {
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
        a.addEventListener('click', e => {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(8px)';
            document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            setTimeout(() => window.location.href = href, 260);
        });
    });
}

// ---- Sticky Mobile Book Button ----
function initStickyBook() {
    const sticky = document.getElementById('mobile-book-sticky');
    if (!sticky) return;
    window.addEventListener('scroll', () => {
        const sidebar = document.getElementById('booking-sidebar-desktop');
        if (!sidebar) return;
        const rect = sidebar.getBoundingClientRect();
        sticky.classList.toggle('hidden', window.innerWidth > 768 || rect.top < window.innerHeight);
    }, { passive: true });
}

// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initRipple();
    initRangeSliders();
    initQtyControls();
    initDashSidebar();
    initDashTabs();
    initFilterToggle();
    initTestimonialCarousel();
    initGallery();
    initWorksCarousel();
    initHeroCollage();
    initCheckboxes();
    initPageTransition();
    initStickyBook();

    // Page entrance animation
    document.body.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
});
