/**
 * Profile Page Interactions
 * Handles sticky header, mobile nav, scroll reveals, animated counters, and smooth scrolling.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. DOM Elements
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const reveals = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('[data-count]');
    const pipelineSteps = document.querySelectorAll('.step');
    const yearSpan = document.getElementById('year');

    // Set Footer Year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Sticky Header
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 8) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 4. Mobile Navigation
    if (navToggle && nav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.setAttribute('aria-label', !isExpanded ? 'Close menu' : 'Open menu');
            nav.classList.toggle('open');
        });

        // Close mobile nav when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
            });
        });

        // Close mobile nav when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('open')) {
                if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                    nav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.setAttribute('aria-label', 'Open menu');
                }
            }
        });
    }

    // 5. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 58;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // 6. Active Navigation Highlighting
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 7. Scroll Reveal Animations
    if (prefersReducedMotion) {
        reveals.forEach(el => {
            el.classList.add('in-view');
            el.style.transitionDelay = '0s';
            el.style.transitionDuration = '0s';
        });
    } else {
        // Set optional staggered delays
        reveals.forEach(el => {
            const delay = el.getAttribute('data-delay');
            if (delay) {
                el.style.transitionDelay = delay;
            }
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // One-time animation
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => revealObserver.observe(el));
    }

    // 8. Animated Counters
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        if (isNaN(target)) return;

        if (prefersReducedMotion) {
            el.textContent = prefix + target + suffix;
            return;
        }

        let startTimestamp = null;
        const duration = 2000;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(easeOutExpo(progress) * target);
            
            el.textContent = prefix + currentCount + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = prefix + target + suffix;
            }
        };

        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 9. Pipeline Step Activation
    if (prefersReducedMotion) {
        pipelineSteps.forEach(step => step.classList.add('active'));
    } else {
        const pipelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        pipelineSteps.forEach(step => pipelineObserver.observe(step));
    }

    // 10. Image Lightbox
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('img');
        const lbCaption = lightbox.querySelector('.lightbox-caption');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const triggers = document.querySelectorAll('[data-lightbox]');

        const openLightbox = (src, caption) => {
            lbImg.src = src;
            lbImg.alt = caption || '';
            lbCaption.textContent = caption || '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            lbImg.src = '';
        };

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                openLightbox(trigger.getAttribute('data-lightbox'), trigger.getAttribute('data-caption'));
            });
        });

        lbClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
        });
    }

    // 11. Reading Progress Bar & Back-to-Top Button
    const progressBar = document.getElementById('readingProgress');
    const backToTopBtn = document.getElementById('backToTop');

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 380) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // 12. Copy-to-Clipboard Toast
    const copyToast = document.getElementById('copyToast');
    const toastMsg = document.getElementById('toastMsg');
    let toastTimeout = null;

    const showToast = (text) => {
        if (!copyToast) return;
        if (toastMsg) toastMsg.textContent = text;
        copyToast.classList.add('show');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2500);
    };

    document.querySelectorAll('.copy-btn, [data-copy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied ${textToCopy} to clipboard!`);
                }).catch(() => {
                    showToast('Copied to clipboard!');
                });
            }
        });
    });

    // 13. Radial Progress Rings
    const metricRings = document.querySelectorAll('.metric-ring-fill');
    if (metricRings.length > 0) {
        if (prefersReducedMotion) {
            metricRings.forEach(ring => {
                const percent = parseInt(ring.getAttribute('data-percent') || '0', 10);
                ring.style.strokeDashoffset = 283 - (283 * percent / 100);
            });
        } else {
            const ringObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const ring = entry.target;
                        const percent = parseInt(ring.getAttribute('data-percent') || '0', 10);
                        ring.style.strokeDashoffset = 283 - (283 * percent / 100);
                        observer.unobserve(ring);
                    }
                });
            }, { threshold: 0.1 });
            metricRings.forEach(ring => ringObserver.observe(ring));
        }
    }

    // 14. Interactive Career Timeline
    const phasesContainer = document.querySelector('.phases');
    const phaseCards = document.querySelectorAll('.phase-card');
    if (phasesContainer && phaseCards.length > 0) {
        if (prefersReducedMotion) {
            phasesContainer.classList.add('timeline-active');
            phaseCards.forEach(card => card.classList.add('phase-active'));
        } else {
            const timelineObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        phasesContainer.classList.add('timeline-active');
                        phaseCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('phase-active');
                            }, index * 400);
                        });
                        observer.unobserve(phasesContainer);
                    }
                });
            }, { threshold: 0.2 });
            timelineObserver.observe(phasesContainer);
        }
    }

    // 15. Skill Filter Tabs
    const techFilters = document.querySelector('.tech-filters');
    const techGroups = document.querySelectorAll('.tech-group');
    if (techFilters && techGroups.length > 0) {
        techFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('tech-filter-btn')) {
                // Update active button
                document.querySelectorAll('.tech-filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                
                techGroups.forEach(group => {
                    if (filter === 'all' || group.getAttribute('data-category') === filter) {
                        group.classList.remove('filtered-out');
                    } else {
                        group.classList.add('filtered-out');
                    }
                });
            }
        });
    }

    // 16. Cursor Spotlight Effect on Dark Cards
    if (!prefersReducedMotion) {
        document.querySelectorAll('.dark-section .metric, .dark-section .tech-group').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    }

    // 17. Floating Hire Badge — hide when contact section is visible
    const hireBadge = document.getElementById('hireBadge');
    const contactSection = document.getElementById('contact');
    if (hireBadge && contactSection) {
        const badgeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hireBadge.style.opacity = '0';
                    hireBadge.style.pointerEvents = 'none';
                } else {
                    hireBadge.style.opacity = '';
                    hireBadge.style.pointerEvents = '';
                }
            });
        }, { threshold: 0.2 });
        badgeObserver.observe(contactSection);
    }
});
