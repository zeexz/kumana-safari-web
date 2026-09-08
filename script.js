document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Navbar Scroll Effect ───────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });


    // ── 2. Mobile Menu Toggle ─────────────────────────────────────────────────
    const hamburger  = document.querySelector('.hamburger');
    const navLinks   = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    /** Open / close the mobile navigation drawer. */
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    // Keyboard support — activate with Enter or Space (role="button" + tabindex="0")
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close the drawer when any nav link is clicked
    navAnchors.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    // ── 3. Scroll Reveal Animation ────────────────────────────────────────────
    function reveal() {
        const THRESHOLD = 100; // px from bottom of viewport before triggering
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight - THRESHOLD) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // trigger once on initial load


    // ── 4. FAQ Accordion ──────────────────────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');

    /** Collapse a single FAQ item. */
    function closeFaqItem(item) {
        item.classList.remove('open');
        const answer = item.querySelector('.faq-answer');
        const btn    = item.querySelector('.faq-question');
        if (answer) answer.style.maxHeight = null;
        if (btn)    btn.setAttribute('aria-expanded', 'false');
    }

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-question');
        const answer      = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Collapse every other open item first
            faqItems.forEach((other) => {
                if (other !== item && other.classList.contains('open')) {
                    closeFaqItem(other);
                }
            });

            if (isOpen) {
                closeFaqItem(item);
            } else {
                item.classList.add('open');
                answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // ── 5. FAQ Resize Handler ─────────────────────────────────────────────────
    // Recalculate max-height when viewport resizes so open items stay correct
    window.addEventListener('resize', () => {
        const openItem = document.querySelector('.faq-item.open');
        if (!openItem) return;
        const answer = openItem.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
    });

});
