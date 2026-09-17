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


    // ── 6. Back to Top Button ────────────────────────────────────────────────
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight);
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ── 7. Gallery Category Filter ───────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active button state
            filterBtns.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter cards with smooth opacity transition
            galleryCards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                if (shouldShow) {
                    card.classList.remove('hidden');
                    // Trigger reflow for animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 250);
                }
            });
        });
    });


    // ── 8. Gallery Lightbox Modal ─────────────────────────────────────────────
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    let currentLightboxList = [];
    let currentLightboxIndex = 0;

    /** Open the lightbox modal with a given image item. */
    function openLightbox(list, index) {
        if (!lightbox || !list || list.length === 0) return;
        currentLightboxList = list;
        currentLightboxIndex = index;
        updateLightboxContent();

        lightbox.removeAttribute('hidden');
        // Small delay to allow transition
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
    }

    /** Update current image, text, and counter inside the modal. */
    function updateLightboxContent() {
        const item = currentLightboxList[currentLightboxIndex];
        if (!item) return;

        lightboxImg.src = item.src;
        lightboxImg.alt = item.title || 'Kumana Safari Photograph';
        lightboxTitle.textContent = item.title || '';
        lightboxLocation.textContent = item.location || '';
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxList.length}`;
    }

    /** Close the lightbox modal. */
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightbox.setAttribute('hidden', '');
        }, 300);
    }

    /** Step to previous image. */
    function prevLightbox() {
        if (currentLightboxList.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
        updateLightboxContent();
    }

    /** Step to next image. */
    function nextLightbox() {
        if (currentLightboxList.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
        updateLightboxContent();
    }

    // Attach click and keyboard handlers to all gallery cards
    galleryCards.forEach((card) => {
        const triggerOpen = () => {
            // Get list of all currently visible gallery cards
            const visibleCards = galleryCards.filter((c) => !c.classList.contains('hidden'));
            const cardDataList = visibleCards.map((c) => {
                const img = c.querySelector('img');
                const title = c.querySelector('.gallery-card-meta h3')?.textContent || '';
                const loc = c.querySelector('.gallery-card-meta p')?.textContent || '';
                return {
                    src: img ? img.getAttribute('src') : '',
                    title: title.trim(),
                    location: loc.trim()
                };
            });

            const indexInVisible = visibleCards.indexOf(card);
            openLightbox(cardDataList, indexInVisible >= 0 ? indexInVisible : 0);
        };

        card.addEventListener('click', triggerOpen);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerOpen();
            }
        });
    });

    // Also attach click to review photo thumbnails to preview them
    const reviewThumbs = document.querySelectorAll('.review-photo-thumb');
    reviewThumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
            const img = thumb.querySelector('img');
            if (!img) return;
            const card = thumb.closest('.google-review-card');
            const reviewerName = card?.querySelector('.reviewer-name')?.textContent || 'Guest Safari Photo';
            openLightbox([{
                src: img.getAttribute('src'),
                title: reviewerName,
                location: 'Kumana National Park (Guest Sighting)'
            }], 0);
        });

        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                thumb.click();
            }
        });
    });

    // Close & navigation controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

    // Keyboard navigation for Lightbox
    window.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.hasAttribute('hidden')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevLightbox();
        } else if (e.key === 'ArrowRight') {
            nextLightbox();
        }
    });


    // ── 9. Booking Widget — WhatsApp Message Generator ───────────────────────
    const bookingForm = document.getElementById('bookingForm');
    const bookingDateInput = document.getElementById('booking-date');

    // Set minimum date to today
    if (bookingDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const date = formData.get('date');
            const guests = formData.get('guests');
            const safari = formData.get('safari');
            const pickup = formData.get('pickup');

            // Format date for human readability
            let dateStr = 'Not specified';
            if (date) {
                const d = new Date(date + 'T00:00:00');
                dateStr = d.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            // Build structured WhatsApp message
            const message = [
                `Hi, I'd like to book a private Kumana safari.`,
                ``,
                `📅 Date: ${dateStr}`,
                `👥 Guests: ${guests}`,
                `🌿 Safari: ${safari}`,
                `📍 Pickup: ${pickup}`,
                ``,
                `Please confirm availability and rates. Thank you!`
            ].join('\n');

            const encoded = encodeURIComponent(message);
            const waUrl = `https://wa.me/94716716802?text=${encoded}`;

            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }


    // ── 10. Mobile Persistent CTA Bar ────────────────────────────────────────
    const mobileCta = document.getElementById('mobileCta');
    const heroSection = document.querySelector('.hero');

    if (mobileCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            mobileCta.classList.toggle('visible', heroBottom < 0);
        });
    }

});
