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
        navToggle.addEventListener('click', () => {
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
    }

    // 5. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = 72; // Account for sticky header offset
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
});
