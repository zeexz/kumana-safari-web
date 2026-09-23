/**
 * Kumana Safari - Main Client Application Script
 * Orchestrates navigation state, scroll-based UI updates, gallery interactions,
 * modal lightbox presentation, and WhatsApp booking query generation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Configuration & Constants
       ========================================================================== */
    /** Primary business WhatsApp number in international format (no leading '+') */
    const WA_NUMBER = '94716716802';


    /* ==========================================================================
       Scroll State Controller
       Batches scroll-dependent DOM updates into a single passive listener to
       prevent layout thrashing across high-frequency scroll events.
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const mobileCta    = document.getElementById('mobileCta');
    const heroSection  = document.querySelector('.hero');

    function onScroll() {
        const scrollY = window.scrollY;

        navbar.classList.toggle('scrolled', scrollY > 50);

        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > window.innerHeight);
        }

        if (mobileCta && heroSection) {
            mobileCta.classList.toggle('visible', heroSection.getBoundingClientRect().bottom < 0);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* ==========================================================================
       Mobile Navigation Drawer
       ========================================================================== */
    const hamburger  = document.querySelector('.hamburger');
    const navLinks   = document.querySelector('.nav-links');
    const navAnchors = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    navAnchors.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    /* ==========================================================================
       Scroll Reveal Animations
       Uses IntersectionObserver to trigger entry transitions on viewport entry.
       ========================================================================== */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));


    /* ==========================================================================
       FAQ Accordion
       Manages single-item expansion with dynamic scrollHeight calculation for
       smooth CSS height transitions.
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

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

            // Enforce single active panel
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

    // Recalculate expanded height when viewport width changes to prevent text clipping
    window.addEventListener('resize', () => {
        const openItem = document.querySelector('.faq-item.open');
        if (!openItem) return;
        const answer = openItem.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
    });


    /* ==========================================================================
       Gallery Category Filtering
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            filterBtns.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            galleryCards.forEach((card) => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                if (shouldShow) {
                    card.classList.remove('hidden');
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


    /* ==========================================================================
       Gallery Lightbox Modal
       Provides modal image preview with preload states and keyboard navigation.
       ========================================================================== */
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxSpinner = document.getElementById('lightboxSpinner');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxLocation = document.getElementById('lightboxLocation');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');

    let currentLightboxList = [];
    let currentLightboxIndex = 0;

    function openLightbox(list, index) {
        if (!lightbox || !list || list.length === 0) return;
        currentLightboxList = list;
        currentLightboxIndex = index;
        updateLightboxContent();

        lightbox.removeAttribute('hidden');
        // Defer class application by a frame so CSS opacity transitions apply after unhiding
        requestAnimationFrame(() => {
            lightbox.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxContent() {
        const item = currentLightboxList[currentLightboxIndex];
        if (!item) return;

        if (lightboxSpinner) {
            lightboxSpinner.classList.remove('loaded');
        }
        lightboxImg.style.opacity = '0';

        const onImgLoad = () => {
            if (lightboxSpinner) lightboxSpinner.classList.add('loaded');
            lightboxImg.style.opacity = '1';
            lightboxImg.removeEventListener('load', onImgLoad);
            lightboxImg.removeEventListener('error', onImgLoad);
        };
        lightboxImg.addEventListener('load', onImgLoad);
        lightboxImg.addEventListener('error', onImgLoad);

        lightboxImg.src = item.src;
        lightboxImg.alt = item.title || 'Kumana Safari Photograph';
        lightboxTitle.textContent = item.title || '';
        lightboxLocation.textContent = item.location || '';
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxList.length}`;
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightbox.setAttribute('hidden', '');
        }, 300);
    }

    function prevLightbox() {
        if (currentLightboxList.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxList.length) % currentLightboxList.length;
        updateLightboxContent();
    }

    function nextLightbox() {
        if (currentLightboxList.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxList.length;
        updateLightboxContent();
    }

    // Attach click and keyboard triggers to all visible gallery cards
    galleryCards.forEach((card) => {
        const triggerOpen = () => {
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

    // Support lightbox previews for guest-submitted review images
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

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

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


    /* ==========================================================================
       Booking Form & WhatsApp Inquiry Generator
       Compiles user selection, date formatting, and customizable chips into
       a pre-filled WhatsApp message URL.
       ========================================================================== */
    const bookingForm = document.getElementById('bookingForm');
    const bookingDateInput = document.getElementById('booking-date');
    const bookingNotes = document.getElementById('booking-notes');
    const bookingNotesCounter = document.getElementById('bookingNotesCounter');
    const quickChips = document.querySelectorAll('#bookingQuickChips .quick-chip');

    // Restrict date picker to today onwards
    if (bookingDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        bookingDateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }

    const updateNotesCounter = () => {
        if (bookingNotes && bookingNotesCounter) {
            const count = bookingNotes.value.length;
            const max = bookingNotes.getAttribute('maxlength') || '500';
            bookingNotesCounter.textContent = `${count} / ${max}`;
        }
    };

    const syncChipsWithText = () => {
        if (!bookingNotes || !quickChips.length) return;
        const text = bookingNotes.value.toLowerCase();
        quickChips.forEach(chip => {
            const chipVal = (chip.getAttribute('data-chip') || '').toLowerCase();
            const isPresent = chipVal && text.includes(chipVal);
            chip.classList.toggle('is-active', isPresent);
            chip.setAttribute('aria-pressed', isPresent ? 'true' : 'false');
        });
    };

    // Toggle quick chips into the freeform notes textarea
    if (quickChips.length && bookingNotes) {
        quickChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const chipVal = chip.getAttribute('data-chip');
                if (!chipVal) return;

                const currentText = bookingNotes.value;
                const escaped = chipVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(^|,\\s*)${escaped}(?=\\s*(,|$))`, 'i');

                if (regex.test(currentText)) {
                    let newText = currentText.replace(regex, '');
                    newText = newText.replace(/,\s*,/g, ', ').replace(/^[\s,]+/, '').replace(/[\s,]+$/, '').trim();
                    bookingNotes.value = newText;
                    chip.classList.remove('is-active');
                    chip.setAttribute('aria-pressed', 'false');
                } else {
                    const trimmed = currentText.trim();
                    bookingNotes.value = trimmed.length === 0 ? chipVal : `${trimmed}, ${chipVal}`;
                    chip.classList.add('is-active');
                    chip.setAttribute('aria-pressed', 'true');
                }

                updateNotesCounter();
                bookingNotes.focus();
            });
        });

        bookingNotes.addEventListener('input', () => {
            updateNotesCounter();
            syncChipsWithText();
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const date = formData.get('date');
            const guests = formData.get('guests');
            const safari = formData.get('safari');
            const pickup = formData.get('pickup');
            const notes = (formData.get('notes') || '').toString().trim();

            let dateStr = 'Not specified';
            if (date) {
                const d = new Date(date + 'T00:00:00');
                dateStr = d.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            let guestStr = guests;
            if (guests === '1') {
                guestStr = '1 guest';
            } else if (guests === '7') {
                guestStr = '7 guests';
            } else if (guests === '8+') {
                guestStr = '8+ guests (Group / Multiple Jeeps)';
            } else if (guests && !guests.toString().includes('guest')) {
                guestStr = `${guests} guests`;
            }

            const messageLines = [
                `Hi, I'd like to book a private Kumana safari.`,
                ``,
                `📅 Date: ${dateStr}`,
                `👥 Guests: ${guestStr}`,
                `🌿 Safari: ${safari}`,
                `📍 Pickup: ${pickup}`
            ];

            if (notes) {
                messageLines.push(`📝 Request: ${notes}`);
            }

            messageLines.push(``, `Please confirm availability and rates. Thank you!`);

            const encoded = encodeURIComponent(messageLines.join('\n'));
            const waUrl = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

});
