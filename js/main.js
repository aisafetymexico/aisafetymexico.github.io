// Main JavaScript for AI Safety Mexico website — Mexican Cultural Premium redesign

document.addEventListener('DOMContentLoaded', function () {

    // ── Mobile Menu Toggle ──
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            const open = nav.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
        // Close menu when a link is clicked
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ── Smooth Scrolling for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var headerH = document.querySelector('.site-header');
                var offset = headerH ? headerH.offsetHeight + 16 : 80;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
                // Update active nav
                document.querySelectorAll('.main-nav a').forEach(function (l) { l.classList.remove('active'); });
                this.classList.add('active');
            }
        });
    });

    // ── Active Navigation on Scroll ──
    var sections = document.querySelectorAll('section[id]');
    if (sections.length) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            var headerH = document.querySelector('.site-header');
            var offset = headerH ? headerH.offsetHeight + 50 : 100;

            sections.forEach(function (section) {
                var top = section.offsetTop - offset;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');
                if (scrollY >= top && scrollY < top + height) {
                    document.querySelectorAll('.main-nav a').forEach(function (l) {
                        l.classList.remove('active');
                        if (l.getAttribute('href') === '#' + id) l.classList.add('active');
                    });
                }
            });
            // Top of page
            if (scrollY < 300) {
                document.querySelectorAll('.main-nav a').forEach(function (l) {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#') l.classList.add('active');
                });
            }
        });
    }

    // ── Header Shrink on Scroll ──
    var header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // ── Carousel ──
    var carousel = document.querySelector('.carousel');
    var slides = document.querySelectorAll('.carousel-slide');
    var prevBtn = document.querySelector('.carousel-btn.prev');
    var nextBtn = document.querySelector('.carousel-btn.next');
    var indicatorsWrap = document.querySelector('.carousel-indicators');

    if (carousel && slides.length > 0 && indicatorsWrap) {
        var currentIndex = 0;

        // Build indicator dots
        slides.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.classList.add('carousel-indicator');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () { goToSlide(i); });
            indicatorsWrap.appendChild(dot);
        });

        function updateCarousel() {
            carousel.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            document.querySelectorAll('.carousel-indicator').forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(i) { currentIndex = i; updateCarousel(); }

        if (prevBtn) prevBtn.addEventListener('click', function () {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateCarousel();
        });
        if (nextBtn) nextBtn.addEventListener('click', function () {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        // Auto-advance
        var autoSlide = setInterval(function () {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        }, 5000);

        carousel.parentElement.addEventListener('mouseenter', function () { clearInterval(autoSlide); });
        carousel.parentElement.addEventListener('mouseleave', function () {
            autoSlide = setInterval(function () {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            }, 5000);
        });

        // Keyboard nav
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
                updateCarousel();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
                updateCarousel();
            }
        });
    }

    // ── Lightbox ──
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    var lightboxCloseBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.certificate-img, .member-photo').forEach(function (img) {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                openLightbox(this.src, this.alt);
            });
        });
        if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }
});
