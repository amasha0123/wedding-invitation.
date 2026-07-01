document.addEventListener('DOMContentLoaded', () => {
    // 0. Mobile Navigation Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 1. Get Guest Name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('name');
    const guestDisplay = document.getElementById('receiverName');
    
    const invitationContent = document.getElementById('invitationContent');
    const shareGenerator = document.querySelector('.share-generator');

    if (guestName) {
        if (guestDisplay) guestDisplay.textContent = decodeURIComponent(guestName);
        if (invitationContent) invitationContent.style.display = 'block';
        if (shareGenerator) shareGenerator.style.display = 'none';
        
        // Force hero section to show immediately and trigger animations
        setTimeout(() => {
            const heroReveal = document.querySelector('.hero-section.reveal');
            if (heroReveal) heroReveal.classList.add('active');
            
            // Trigger scroll to activate other reveals if needed
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    } else {
        if (guestDisplay) guestDisplay.textContent = "Guest";
        if (invitationContent) invitationContent.style.display = 'none';
        if (shareGenerator) {
            shareGenerator.style.display = 'flex';
            shareGenerator.style.minHeight = '100vh';
            shareGenerator.style.alignItems = 'center';
            shareGenerator.style.background = 'var(--bg-white)';
        }
    }

    // 1.5. Reveal Animations on Scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(section => revealObserver.observe(section));

    // 1.6. Petal Generator
    const petalsContainer = document.getElementById('petals');
    if (petalsContainer) {
        const createPetal = () => {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.animationDuration = Math.random() * 5 + 5 + 's';
            petal.style.width = Math.random() * 10 + 10 + 'px';
            petal.style.height = petal.style.width;
            petalsContainer.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 10000);
        };
        setInterval(createPetal, 500);
    }

    // 1.7. Hero Slideshow Logic
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    let currentSlide = 0;

    const nextSlide = () => {
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    };

    if (slides.length > 1) {
        setInterval(nextSlide, 5000); // Change image every 5 seconds
    }

    // 2. Countdown Timer
    const targetDate = new Date("May 4, 2026 09:00:00").getTime();
    const countdownEl = document.getElementById("countdown");

    const updateCountdown = () => {
        if (!countdownEl) return;
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownEl.innerHTML = "The Wedding Day is Here!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 3. Background Music
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (music && musicBtn) {
        const musicText = musicBtn.querySelector('.music-text');
        let isPlaying = false;

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                music.pause();
                if (musicText) musicText.textContent = "Play Music";
            } else {
                music.play().catch(e => console.log("Music play blocked by browser"));
                if (musicText) musicText.textContent = "Stop Music";
            }
            isPlaying = !isPlaying;
        });
    }

    // 4. Loader
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000);
            }, 1500);
        }
    });

    // 5. Sharing Logic
    const generateBtn = document.getElementById('generateBtn');
    const guestInput = document.getElementById('guestInput');
    const shareStatus = document.getElementById('shareStatus');

    if (generateBtn && guestInput && shareStatus) {
        generateBtn.addEventListener('click', async () => {
            const nameToShare = guestInput.value.trim();
            if (!nameToShare) {
                shareStatus.textContent = "Please enter a guest name.";
                shareStatus.style.color = "red";
                return;
            }

            // Generate URL
            const baseUrl = window.location.origin + window.location.pathname;
            const shareUrl = `${baseUrl}?name=${encodeURIComponent(nameToShare)}`;

            // Exact template requested by user
            const shareText = `🌸 *You're Invited!* 🌸\n\nDear ${nameToShare},\n\nWe joyfully invite you to celebrate our wedding!\n\n📅 Monday, 04 May 2026\n⏰ Function starts at 9:00 AM\n📍 Ella Flower Garden Hotel, Ella\n\nYour personal invitation: ${shareUrl}\n\nWith love, Sara and Yesh 💛`;

            // Configure WhatsApp Button
            const whatsappBtn = document.getElementById('whatsappBtn');
            if (whatsappBtn) {
                whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                whatsappBtn.style.display = 'block';
            }

            if (navigator.share && window.location.protocol === 'https:') {
                try {
                    await navigator.share({
                        title: "Wedding Invitation: Sara & Yesh",
                        text: shareText,
                        url: shareUrl
                    });
                    shareStatus.textContent = "Shared successfully!";
                    shareStatus.style.color = "green";
                } catch (err) {
                    console.log("Share failed or cancelled");
                }
            } else {
                // Fallback to clipboard
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(shareText);
                        shareStatus.innerHTML = `Invitation copied to clipboard! <br><br><a href="${shareUrl}" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline;">Preview Invitation</a>`;
                        shareStatus.style.color = "green";
                    } else {
                        throw new Error("Clipboard API missing");
                    }
                } catch (err) {
                    shareStatus.innerHTML = `Link generated: <br><a href="${shareUrl}" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline;">Preview Invitation</a><br><br>You can also use the WhatsApp button below.`;
                    shareStatus.style.color = "black";
                }
            }
        });
    }
});
