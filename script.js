document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Text Scramble Effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_$%&|~@';
            this.update = this.update.bind(this);
            this.colors = [
                '#4A90E2', // Bright Blue
                '#50C878', // Emerald Green
                '#FFB347', // Pastel Orange
                '#87CEEB', // Sky Blue
                '#DDA0DD', // Plum
                '#F0E68C', // Khaki
                '#98FB98', // Pale Green
                '#FFA07A', // Light Salmon
                '#B0C4DE', // Light Steel Blue
                '#DEB887', // Burlywood
                '#9370DB', // Medium Purple
                '#F08080'  // Light Coral
            ];
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 30);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.5) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    const color = this.getRandomColor();
                    const glow = this.getGlowEffect(color);
                    const transform = this.getRandomTransform();
                    output += `<span class="scramble-char" style="color: ${color}; text-shadow: ${glow}; transform: ${transform}; display: inline-block;">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }

        getRandomColor() {
            return this.colors[Math.floor(Math.random() * this.colors.length)];
        }

        getGlowEffect(color) {
            return `0 0 5px ${color}, 0 0 10px ${color}, 0 0 15px ${color}`;
        }

        getRandomTransform() {
            const rotate = Math.random() * 30 - 15;
            const scale = 0.8 + Math.random() * 0.4;
            return `rotate(${rotate}deg) scale(${scale})`;
        }
    }

    // Initialize scramble effect immediately
    const scrambleText = document.querySelector('.scramble-text');
    if (scrambleText) {
        const fx = new TextScramble(scrambleText);
        const startScramble = () => {
            fx.setText('Dev Kakadia').then(() => {
                setTimeout(startScramble, 5000);
            });
        };
        startScramble(); // Start immediately
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Spotlight effect
    const spotlightCards = document.querySelectorAll('.spotlight-effect');
    
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            
            card.style.setProperty('--x', `${x}%`);
            card.style.setProperty('--y', `${y}%`);
        });
    });

    // Timeline scroll reveal
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                
                // Add parallax effect on mouse move
                entry.target.addEventListener('mousemove', (e) => {
                    const rect = entry.target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const xRotation = ((y - rect.height / 2) / rect.height) * 10;
                    const yRotation = ((x - rect.width / 2) / rect.width) * 10;
                    
                    entry.target.style.transform = `
                        perspective(1000px)
                        rotateX(${-xRotation}deg)
                        rotateY(${yRotation}deg)
                        translateZ(20px)
                    `;
                });
                
                // Reset transform on mouse leave
                entry.target.addEventListener('mouseleave', () => {
                    entry.target.style.transform = 'none';
                });
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, timelineObserverOptions);

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Clone cards for infinite scroll
    const track = document.querySelector('.infinite-cards-track');
    if (track) {
        const cards = track.querySelectorAll('.skill-card');
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });
    }

    // Pause animation on hover
    const container = document.querySelector('.infinite-cards-container');
    if (container) {
        container.addEventListener('mouseenter', () => {
            const track = container.querySelector('.infinite-cards-track');
            track.style.animationPlayState = 'paused';
        });

        container.addEventListener('mouseleave', () => {
            const track = container.querySelector('.infinite-cards-track');
            track.style.animationPlayState = 'running';
        });
    }

    // Expandable cards functionality
    const expandableCards = document.querySelectorAll('.expandable-card');
    
    expandableCards.forEach(card => {
        card.addEventListener('click', () => {
            // Close any other expanded cards
            expandableCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    otherCard.classList.remove('expanded');
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
            
            // Scroll into view if expanded
            if (card.classList.contains('expanded')) {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
    
    // Close expanded card when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.expandable-card')) {
            expandableCards.forEach(card => {
                card.classList.remove('expanded');
            });
        }
    });

    // Text reveal animation
    const textElements = document.querySelectorAll('.fade-in-text');
    const textObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, textObserverOptions);

    textElements.forEach(el => textObserver.observe(el));

    // Lens effect
    const lensEffects = document.querySelectorAll('.lens-effect');
    lensEffects.forEach(lens => {
        lens.addEventListener('mousemove', (e) => {
            const rect = lens.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            lens.style.setProperty('--x', `${x}px`);
            lens.style.setProperty('--y', `${y}px`);
        });
    });

    // Add class to all section headings and paragraphs
    document.querySelectorAll('section h2, section p').forEach(el => {
        if (!el.classList.contains('fade-in-text')) {
            el.classList.add('fade-in-text');
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations
    const scrollObserverOptions = {
        threshold: 0.1,
        rootMargin: '20px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // Smooth loading for images
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
        img.addEventListener('load', function() {
            this.classList.add('fade-in');
        });
    });

    // Add smooth transitions for hover states
    document.querySelectorAll('.hover-effect').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Performance optimization for scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                // Your scroll-based animations here
                ticking = false;
            });
            ticking = true;
        }
    });
});