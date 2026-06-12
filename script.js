document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCROLL ACTIONS (HEADER EFFECTS & SCROLL TO TOP)
       ========================================================================== */
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. MOBILE DRAWER NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileDrawer = document.getElementById('mobile-drawer-menu');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function toggleMenu() {
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : 'auto';
    }

    function closeMenu() {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    mobileToggle.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================================================
       3. TYPEWRITER ANIMATION EFFECT
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const wordsArray = JSON.parse(typewriterElement.getAttribute('data-words'));

    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentFullWord = wordsArray[currentWordIndex];

        if (isDeleting) {
            // Subtract character
            typewriterElement.textContent = currentFullWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = 50; // Deleting is faster
        } else {
            // Add character
            typewriterElement.textContent = currentFullWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        // Word typing complete
        if (!isDeleting && currentCharIndex === currentFullWord.length) {
            typeSpeed = 1500; // Pause at full word
            isDeleting = true;
        }
        // Word deleting complete
        else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % wordsArray.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start the typewriter loop
    if (wordsArray.length > 0) {
        setTimeout(typeEffect, 800);
    }

    /* ==========================================================================
       4. INTERSECTION OBSERVER FOR SCROLL REVEAL
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to keep layout performant
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       5. SKILL BAR ANIMATIONS
       ========================================================================== */
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetBar = entry.target;
                const percentage = targetBar.getAttribute('data-progress');
                targetBar.style.width = percentage + '%';
                observer.unobserve(targetBar);
            }
        });
    }, {
        threshold: 0.2
    });

    skillBars.forEach(bar => skillObserver.observe(bar));

    /* ==========================================================================
       6. SCROLL-SPY ACTIVE LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset to trigger highlight slightly before section is fully reached
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Highlight active navbar links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Highlight active drawer menu links
        drawerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       7. CONTACT FORM VALIDATION & SUBMISSION HANDLER
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const formAlert = document.getElementById('form-alert-msg');

    // Validate email layout
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Clear validation status
    function resetValidation(input, errorElement) {
        input.classList.remove('invalid');
        errorElement.style.display = 'none';
    }

    // Trigger input-specific errors
    function triggerValidationError(input, errorElement) {
        input.classList.add('invalid');
        errorElement.style.display = 'block';
    }

    // Input listeners to clear errors in real-time
    nameInput.addEventListener('input', () => resetValidation(nameInput, document.getElementById('name-error')));
    emailInput.addEventListener('input', () => resetValidation(emailInput, document.getElementById('email-error')));
    subjectInput.addEventListener('input', () => resetValidation(subjectInput, document.getElementById('subject-error')));
    messageInput.addEventListener('input', () => resetValidation(messageInput, document.getElementById('message-error')));

    // Submit actions
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Validate name
        if (nameInput.value.trim() === '') {
            triggerValidationError(nameInput, document.getElementById('name-error'));
            isFormValid = false;
        }

        // Validate email
        if (!isValidEmail(emailInput.value.trim())) {
            triggerValidationError(emailInput, document.getElementById('email-error'));
            isFormValid = false;
        }

        // Validate subject
        if (subjectInput.value.trim() === '') {
            triggerValidationError(subjectInput, document.getElementById('subject-error'));
            isFormValid = false;
        }

        // Validate message
        if (messageInput.value.trim() === '') {
            triggerValidationError(messageInput, document.getElementById('message-error'));
            isFormValid = false;
        }

        if (isFormValid) {
            // Prevent double submission
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin btn-icon"></i>';

            // Mock API submission lag
            setTimeout(() => {
                // Success feedback
                formAlert.className = 'form-alert success';
                formAlert.textContent = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. I will get back to you soon.`;

                // Clear Form
                contactForm.reset();

                // Restore button state
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalBtnContent;

                // Remove success box after 5 seconds
                setTimeout(() => {
                    formAlert.style.display = 'none';
                    formAlert.className = 'form-alert';
                }, 5000);

            }, 1500);
        } else {
            // Form validation failed error
            formAlert.className = 'form-alert error';
            formAlert.textContent = 'Please correct the errors in the form above.';
            formAlert.style.display = 'block';

            setTimeout(() => {
                formAlert.style.display = 'none';
                formAlert.className = 'form-alert';
            }, 4000);
        }
    });

    /* ==========================================================================
       8. THEME TOGGLE (LIGHT & DARK MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme preference, otherwise use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
    });

    /* ==========================================================================
       9. PROJECTS CATEGORY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hide');
                    // Tiny entry transition animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================================
       10. STATS COUNTER ANIMATION
       ========================================================================== */
    const counterElements = document.querySelectorAll('.stat-number, .github-stat-val');

    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimals') || '0');
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            // Ease out quad formula
            const easeProgress = progress * (2 - progress);
            const currentValue = easeProgress * target;

            element.textContent = currentValue.toFixed(decimals);

            if (step >= totalSteps) {
                element.textContent = target.toFixed(decimals);
                clearInterval(timer);
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(el => counterObserver.observe(el));

    /* ==========================================================================
       11. GITHUB CONTRIBUTION HEAT MAP GENERATOR
       ========================================================================== */
    const rowIds = ['contribution-row-1', 'contribution-row-2', 'contribution-row-3'];
    const totalCells = 42; // Number of columns (weeks) to show in the mock dashboard

    rowIds.forEach(rowId => {
        const rowElement = document.getElementById(rowId);
        if (rowElement) {
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                // Generate realistic github commits activity profile
                // Mostly level 0-2, with occasional 3-4 spikes
                const rand = Math.random();
                let level = 0;
                if (rand > 0.85) level = 4;
                else if (rand > 0.7) level = 3;
                else if (rand > 0.4) level = 2;
                else if (rand > 0.15) level = 1;

                cell.classList.add(`level-${level}`);

                // Add tooltip with commits data
                let commitsCount = 0;
                if (level === 1) commitsCount = Math.floor(Math.random() * 3) + 1;
                else if (level === 2) commitsCount = Math.floor(Math.random() * 4) + 4;
                else if (level === 3) commitsCount = Math.floor(Math.random() * 4) + 8;
                else if (level === 4) commitsCount = Math.floor(Math.random() * 6) + 12;

                cell.setAttribute('title', commitsCount > 0 ? `${commitsCount} contributions` : 'No contributions');
                rowElement.appendChild(cell);
            }
        }
    });
});
