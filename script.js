/**
 * ============================================
 * SPARKLE HEAVEN - Event Management Platform
 * Shared JavaScript: Celebrations, Animations,
 * Navbar, Mobile Menu, Toast, Modal, Ripple
 * ============================================
 */

// ---- Confetti Celebrations ----
function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#D4AF37', '#C62828', '#E8C547', '#EF5350', '#FF8F00', '#B71C1C', '#FFD700', '#FF6F00'];

    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 8 + 6) + 's';
        piece.style.animationDelay = (Math.random() * 10) + 's';
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
        container.appendChild(piece);
    }
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
        document.body.classList.add('scroll-locked');
    };
    const close = () => {
        menu.classList.remove('open');
        document.body.classList.remove('scroll-locked');
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

    const icons = { success: '✓', error: '✗', info: 'i', warning: '!' };
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


// ---- Smooth Page Transition ----
function initPageTransition() {
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
        a.addEventListener('click', e => {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(8px)';
            document.body.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            setTimeout(() => window.location.href = href, 260);
        });
    });

    // Fix blank page on browser back button (bfcache restores opacity:0)
    window.addEventListener('pageshow', () => {
        document.body.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
}


// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
    // createConfetti(); // Disabled for professional theme
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initRipple();
    initTestimonialCarousel();
    initGallery();
    initWorksCarousel();
    initHeroCollage();
    initPageTransition();

    // Page entrance animation
    document.body.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
});

// ---- Floating WhatsApp Button (Fixed - injected onto body) ----
// wa-float-inject
(function() {
  // Remove any existing #whatsapp-btn from the DOM first
  var existing = document.getElementById('whatsapp-btn');
  if (existing) existing.remove();

  // Create fresh button directly on body to guarantee position:fixed works
  var btn = document.createElement('a');
  btn.id = 'whatsapp-btn';
  btn.href = 'https://wa.me/message/DYZLWD3MPHAHB1';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span class="whatsapp-tooltip">Chat with us!</span>';
  document.body.appendChild(btn);
})();