document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
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

    // Synchronize Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // 2. Custom Cursor Follower
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

        // Hover effect for interactive targets
        const targets = document.querySelectorAll('.magnetic-target, .magnetic-target-card, a, button');
        targets.forEach((target) => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }

    // 3. Hero Animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    heroTl.from('.subtitle', {
        y: 20,
        opacity: 0,
        delay: 0.2
    })
    .from('.hero-title', {
        y: 30,
        opacity: 0,
    }, '-=0.6')
    .from('.hero-description', {
        y: 20,
        opacity: 0
    }, '-=0.6')
    .from('.hero-cta', {
        y: 20,
        opacity: 0
    }, '-=0.6');

    // 4. Portfolio Cards Scroll Animation
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

    // 5. About Section Animation
    if (document.querySelector('#about')) {
        gsap.from('.about-image-column', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%'
            },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.from('.about-content-column', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%'
            },
            x: 40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }

    // 6. Services Cards Stagger Animation
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
    // Lightbox Modal Functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalImg) {
        // Open modal on image or wrapper click
        document.querySelectorAll('.card-image-wrapper').forEach((wrapper) => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('img');
                if (img) {
                    modalImg.src = img.src;
                    modalCaption.textContent = img.alt || 'Artwork Preview';
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden'; // Stop page scroll
                }
            });
        });

        // Close modal function
        const closeModal = () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll
        };

        modalClose.addEventListener('click', closeModal);

        // Close when clicking outside image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 7. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu on click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});
// Fetch and render projects dynamically from projects.json
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (portfolioGrid) {
        fetch('projects.json')
            .then(response => response.json())
            .then(projects => {
                portfolioGrid.innerHTML = ''; // Clear container

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

                // Re-bind Lightbox Modal functionality for dynamic images
                initLightbox();
            })
            .catch(error => console.error('Error loading projects:', error));
    }
    // Premium 3D Downward Drop + Lens Flare Lock
window.addEventListener('scroll', () => {
    const photoCard = document.querySelector('.photo-3d-card');
    const lightSweep = document.querySelector('.luxury-light-sweep');
    if (!photoCard) return;

    const parent = photoCard.closest('.about-image-column');
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if element is coming into view
    if (rect.top <= windowHeight && rect.bottom >= 0) {
        // Calculate progress: 1 when entering screen bottom, 0 when centered
        let progress = (rect.top - (windowHeight * 0.25)) / (windowHeight * 0.75);
        progress = Math.max(0, Math.min(1, progress));

        // 1. Physical Motion: Glides 280px DOWN from top into exact 0px
        const translateY = progress * -280;
        
        // 2. Premium 3D Tilt: Tilts backward (-18 deg) and scales up slightly as it descends
        const rotateX = progress * 18;
        const scale = 0.85 + (1 - progress) * 0.15;
        const opacity = 1 - (progress * 0.85);

        // Apply 3D transforms
        photoCard.style.transform = `translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) scale(${scale})`;
        photoCard.style.opacity = opacity;

        // 3. Dynamic Gold Light Flare: Sweeps across the photo surface right as it lands
        if (lightSweep) {
            const sweepX = (1 - progress) * 350; // Moves flare across from -150% to right
            lightSweep.style.transform = `translateX(${sweepX}%) rotate(25deg)`;
        }

        // Glow intensity increases on landing
        if (progress === 0) {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.5)';
            photoCard.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(226, 184, 87, 0.25)';
        } else {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.2)';
            photoCard.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(226, 184, 87, 0.1)';
        }
    }
});
// Synced Motion: Photo Flips in 3D from Top-Right -> Left | Text Glides Up
window.addEventListener('scroll', () => {
    const photoCard = document.querySelector('.photo-3d-card');
    const textColumn = document.querySelector('.about-content-column');
    const lightSweep = document.querySelector('.luxury-light-sweep');

    if (!photoCard || !textColumn) return;

    const parent = photoCard.closest('.about-grid');
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
        // Progress: 1 when section enters viewport, 0 when locked in place
        let progress = (rect.top - (windowHeight * 0.2)) / (windowHeight * 0.8);
        progress = Math.max(0, Math.min(1, progress));

        // 1. PHOTO MOTION (3D Card Flip + Position Translation):
        const photoX = progress * 280;            // Travels from +280px RIGHT to 0px
        const photoY = progress * -220;           // Travels from -220px TOP to 0px
        
        // 3D FLIP: Rotates 180° around Y-axis (sideways flip) and 20° around X-axis for dynamic depth
        const flipY = progress * 180;             
        const flipX = progress * 20;              
        
        const photoScale = 0.85 + (1 - progress) * 0.15; 
        const photoOpacity = 1 - (progress * 0.8);

        // Apply 3D perspective flip
        photoCard.style.transform = `translate3d(${photoX}px, ${photoY}px, 0) rotateY(${flipY}deg) rotateX(${flipX}deg) scale(${photoScale})`;
        photoCard.style.opacity = photoOpacity;

        // 2. TEXT MOTION:
        const textY = progress * 200;             // Glides UP from +200px below to 0px
        const textOpacity = 1 - (progress * 0.85);

        textColumn.style.transform = `translateY(${textY}px)`;
        textColumn.style.opacity = textOpacity;

        // 3. LIGHT SWEEP FLARE ON LANDING:
        if (lightSweep) {
            const sweepX = (1 - progress) * 350;
            lightSweep.style.transform = `translateX(${sweepX}%) rotate(25deg)`;
        }

        // Active border glow
        if (progress === 0) {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.6)';
            photoCard.style.boxShadow = '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(226, 184, 87, 0.3)';
        } else {
            photoCard.style.borderColor = 'rgba(226, 184, 87, 0.35)';
            photoCard.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(226, 184, 87, 0.15)';
        }
    }
});