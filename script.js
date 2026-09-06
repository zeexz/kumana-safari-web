document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation
    function reveal() {
        var reveals = document.querySelectorAll('.reveal');

        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100; // threshold

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }

    // Run on load and scroll
    window.addEventListener('scroll', reveal);
    reveal(); // Trigger once on load

    // 4. Booking Form — Formspree AJAX Submission
    const bookingForm = document.getElementById('booking-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (bookingForm && submitBtn && formStatus) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous status
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            // Show sending state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            try {
                const formData = new FormData(bookingForm);

                const response = await fetch(bookingForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formStatus.textContent = '✓ Thank you! Your safari inquiry has been sent. We\'ll get back to you within 24 hours.';
                    formStatus.className = 'form-status success';
                    bookingForm.reset();
                } else {
                    // Server error
                    const data = await response.json();
                    const errorMsg = (data.errors && data.errors.map(err => err.message).join(', '))
                        || 'Something went wrong. Please try again or contact us directly.';
                    formStatus.textContent = '✗ ' + errorMsg;
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                // Network error
                formStatus.textContent = '✗ Network error. Please check your connection and try again, or reach us on WhatsApp.';
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }
        });
    }

    // 5. FAQ Accordion Interaction
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close other accordion items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                    questionBtn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
});
