document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Smooth Scroll Setup (Lenis + GSAP ScrollTrigger Integration)
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    /* ==========================================================================
       2. Custom Cursor Follower
       ========================================================================== */
    const cursor = document.getElementById('cursor');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out'
            });
        });

        const bindCursorHover = () => {
            const targets = document.querySelectorAll('.magnetic-target, .magnetic-target-card, a, button, .card-image-wrapper');
            targets.forEach((target) => {
                target.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
                target.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
            });
        };
        bindCursorHover();
    }

    /* ==========================================================================
       3. Hero Entrance Timeline
       ========================================================================== */
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    heroTl.from('.subtitle', { y: 20, opacity: 0, delay: 0.2 })
          .from('.hero-title', { y: 30, opacity: 0 }, '-=0.6')
          .from('.hero-description', { y: 20, opacity: 0 }, '-=0.6')
          .from('.hero-cta', { y: 20, opacity: 0 }, '-=0.6');

    /* ==========================================================================
       4. Static Section Scroll Animations
       ========================================================================== */
    // Portfolio Initial Grid Animation
    const cards = document.querySelectorAll('.portfolio-card');
    if (cards.length > 0) {
        gsap.from(cards, {
            scrollTrigger: {
                trigger: '.portfolio-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }

    // Services Cards Stagger Animation
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        gsap.from(serviceCards, {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    /* ==========================================================================
       5. Dynamic Projects Fetch & Render
       ========================================================================== */
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (portfolioGrid) {
        fetch('projects.json')
            .then(response => response.json())
            .then(projects => {
                portfolioGrid.innerHTML = '';

                projects.forEach(project => {
                    const card = document.createElement('article');
                    card.className = 'portfolio-card magnetic-target-card';
                    card.innerHTML = `
                        <div class="card-image-wrapper">
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                            <div class="card-overlay">
                                <span class="arrow-icon"><i class="fa-solid fa-arrow-up-right"></i></span>
                            </div>
                        </div>
                        <div class="card-info">
                            <span class="card-category">${project.category}</span>
                            <h3 class="card-title">${project.title}</h3>
                            <p class="card-description">${project.description}</p>
                        </div>
                    `;
                    portfolioGrid.appendChild(card);
                });

                // Re-bind modal triggers for dynamically loaded items
                initLightbox();
            })
            .catch(error => console.error('Error loading projects:', error));
    }

    /* ==========================================================================
       6. Lightbox Image Modal Functionality
       ========================================================================== */
    function initLightbox() {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image') || document.getElementById('modal-img');
        const modalCaption = document.getElementById('modal-caption');
        const modalClose = document.getElementById('modal-close') || document.querySelector('.modal-close');

        if (!modal || !modalImg) return;

        const openModal = (imageSrc, captionText) => {
            modalImg.src = imageSrc;
            if (modalCaption) modalCaption.textContent = captionText || 'Artwork Preview';
            modal.classList.add('active', 'show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active', 'show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        // Delegate click for portfolio images & profile card
        document.addEventListener('click', (e) => {
            const wrapper = e.target.closest('.card-image-wrapper');
            const profileImg = e.target.closest('.photo-3d-card img');

            if (wrapper) {
                const img = wrapper.querySelector('img');
                if (img) openModal(img.src, img.alt);
            } else if (profileImg) {
                openModal(profileImg.src, profileImg.alt || 'Profile Image');
            }
        });

        // Close listeners
        if (modalClose) modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && (modal.classList.contains('active') || modal.classList.contains('show'))) {
                closeModal();
            }
        });
    }

    // Initialize Lightbox for initial DOM elements
    initLightbox();

    /* ==========================================================================
       7. Mobile Navigation Toggle
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link, .nav-item').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

/* ==========================================================================
   8. Synchronized 3D Card Flip & Text Motion Scroll Effect
   ========================================================================== */
window.addEventListener('scroll', () => {
    const photoCard = document.querySelector('.photo-3d-card');
    const textColumn = document.querySelector('.about-content-column');
    const lightSweep = document.querySelector('.luxury-light-sweep');

    if (!photoCard || !textColumn) return;

    const parent = photoCard.closest('.about-grid') || photoCard.closest('.about-image-column');
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
        let progress = (rect.top - (windowHeight * 0.2)) / (windowHeight * 0.8);
        progress = Math.max(0, Math.min(1, progress));

        // 1. Photo Card Transforms (3D Flip from top-right down to position)
        const photoX = progress * 280;
        const photoY = progress * -220;
        const flipY = progress * 180;
        const flipX = progress * 20;
        const photoScale = 0.85 + (1 - progress) * 0.15;
        const photoOpacity = 1 - (progress * 0.8);

        photoCard.style.transform = `translate3d(${photoX}px, ${photoY}px, 0) rotateY(${flipY}deg) rotateX(${flipX}deg) scale(${photoScale})`;
        photoCard.style.opacity = photoOpacity;

        // 2. Text Column Glide Motion
        const textY = progress * 200;
        const textOpacity = 1 - (progress * 0.85);

        textColumn.style.transform = `translateY(${textY}px)`;
        textColumn.style.opacity = textOpacity;

        // 3. Gold Lens Flare / Light Sweep Animation
        if (lightSweep) {
            const sweepX = (1 - progress) * 350;
            lightSweep.style.transform = `translateX(${sweepX}%) rotate(25deg)`;
        }

        // Active Glow State on Landing
        if (progress === 0) {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.6)';
            photoCard.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(226, 184, 87, 0.3)';
        } else {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.35)';
            photoCard.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(226, 184, 87, 0.15)';
        }
    }
});