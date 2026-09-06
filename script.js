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

    // 4. Form Submission Prevention (for demo purposes)
    const bookingForm = document.querySelector('.booking-form');
    if(bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.backgroundColor = '#1A3626'; // primary color
            
            // Simulate network request
            setTimeout(() => {
                btn.textContent = 'Inquiry Sent!';
                btn.style.backgroundColor = '#2c5a40';
                bookingForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
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
