// Popup functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.popup-slide');
const dots = document.querySelectorAll('.nav-dot');

// Show popup when page loads
window.addEventListener('load', function() {
    // Check if popup should be shown (not shown in last 24 hours)
    if (!checkPopupCookie()) {
        setTimeout(() => {
            const popupOverlay = document.getElementById('popupOverlay');
            if (popupOverlay) {
                popupOverlay.classList.add('active');
            }
        }, 1500); // Show popup 1.5 seconds after page load
    }
});

// Close popup functionality
const closeBtn = document.getElementById('closeBtn');
const popupOverlay = document.getElementById('popupOverlay');

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        setPopupCookie();
        closePopup();
    });
}

if (popupOverlay) {
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            setPopupCookie();
            closePopup();
        }
    });
}

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay && popupOverlay.classList.contains('active')) {
            setPopupCookie();
            closePopup();
        }
    }
});

function closePopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    if (popupOverlay) {
        popupOverlay.classList.remove('active');
    }
}

// Slide navigation functions
function nextSlide() {
    const slides = document.querySelectorAll('.popup-slide');
    if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.popup-slide');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (slides.length === 0 || dots.length === 0) return;
    
    // Remove active class from current slide and dot
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    // Add active class to new slide and dot
    currentSlide = index;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

// Cookie functions to prevent showing popup too frequently
function setPopupCookie() {
    const expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `pettifyPopupShown=true; expires=${expiryTime.toUTCString()}; path=/`;
}

function checkPopupCookie() {
    return document.cookie.split(';').some((item) => item.trim().startsWith('pettifyPopupShown='));
}

// Auto-advance slides every 10 seconds (optional - you can remove this if you don't want auto-advance)
let autoSlideInterval = setInterval(() => {
    const slides = document.querySelectorAll('.popup-slide');
    const popupOverlay = document.getElementById('popupOverlay');
    
    if (popupOverlay && popupOverlay.classList.contains('active')) {
        nextSlide();
        if (currentSlide === slides.length - 1) {
            setTimeout(() => {
                goToSlide(0);
            }, 5000);
        }
    }
}, 10000);

// Pause auto-advance when user interacts with popup
const popupContainer = document.querySelector('.popup-container');
if (popupContainer) {
    popupContainer.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // FAQ Toggle Functionality
    const questions = document.querySelectorAll(".question");
    const answers = document.querySelectorAll(".answer");

    questions.forEach((question, index) => {
        question.addEventListener("click", () => {
            questions.forEach((q) => q.classList.remove("active"));
            answers.forEach((a) => a.classList.remove("active"));
            question.classList.add("active");
            answers[index].classList.add("active");
        });
    });

    // Tab Navigation
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".tab-content section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            tabs.forEach((tab) => tab.classList.remove("active"));
            sections.forEach((section) => {
                section.classList.remove("active-tab");
                section.classList.add("inactive-tab");
            });
            this.classList.add("active");
            const target = document.querySelector(this.dataset.target);
            if (target) {
                target.classList.add("active-tab");
                target.classList.remove("inactive-tab");
            }
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById("hamburger");
    const navbarMenu = document.getElementById("navbar-menu");
    const closeButton = document.getElementById("close-button");

    if (hamburger && navbarMenu) {
        hamburger.addEventListener("click", () => {
            navbarMenu.classList.toggle("active");
        });
    }

    if (closeButton && navbarMenu) {
        closeButton.addEventListener("click", () => {
            navbarMenu.classList.remove("active");
        });
    }

    // Active Navigation Link Highlight
    document.querySelectorAll(".navbar a").forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    // Pricing Dropdown Toggle
    const pricingLink = document.getElementById("pricing-link");
    const pricingDropdown = document.getElementById("pricing-dropdown");

    if (pricingLink && pricingDropdown) {
        pricingLink.addEventListener("click", (e) => {
            e.preventDefault();
            pricingDropdown.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!pricingLink.contains(e.target) && !pricingDropdown.contains(e.target)) {
                pricingDropdown.classList.remove("active");
            }
        });
    }

    // Footer Pricing Link Scroll
    const footerPricingLink = document.getElementById("footer-pricing-link");

    if (footerPricingLink && pricingLink && pricingDropdown) {
        footerPricingLink.addEventListener("click", (e) => {
            e.preventDefault();
            pricingDropdown.classList.add("active");

            const navbar = document.querySelector(".navbar");
            if (navbar) {
                const navbarHeight = navbar.offsetHeight;
                const offset = navbar.offsetTop - navbarHeight;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth",
                });
            }
        });
    }

    // Scroll to Download Section
    function scrollToDownload() {
        const downloadSection = document.querySelector(".download");
        if (downloadSection) {
            navbarMenu.classList.remove("active");
            downloadSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    const ctaButtons = document.querySelectorAll(".cta-button");
    const ctaButton = document.querySelectorAll(".bcta-button");
    ctaButtons.forEach((button) => {
        button.addEventListener("click", scrollToDownload);
    });
    ctaButton.forEach((button) => {
        button.addEventListener("click", scrollToDownload);
    });

    // Close Navbar on Link Click (Mobile)
    const navLinks = document.querySelectorAll(".navbar-menu a");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && !pricingDropdown.contains(e.target) && !pricingLink.contains(e.target)) {
                navbarMenu.classList.remove("active");
            }
        });
    });

    // Testimonial Slider (Smooth Loop Animation)
    const slider = document.querySelector(".testimonial-slider");
    let index = 0;
    let interval;

    function nextSlide() {
        index++;
        if (index >= slider.children.length) {
            // Instead of immediately jumping back to index 0, animate smoothly
            slider.style.transition = "transform 0.5s ease";
            slider.style.transform = `translateX(-${index * 100}%)`;
            
            // After the transition completes, quickly reset without animation
            setTimeout(() => {
                slider.style.transition = "none";
                index = 0;
                slider.style.transform = `translateX(0)`;
                // Small delay before re-enabling transitions for next slide
                setTimeout(() => {
                    slider.style.transition = "transform 0.5s ease";
                }, 50);
            }, 500);
            return;
        }
        
        // Normal slide transition
        slider.style.transition = "transform 0.5s ease";
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    function startSlider() {
        if (window.innerWidth < 784) {
            // Add initial transition setting
            slider.style.transition = "transform 0.5s ease";
            if (!interval) {
                interval = setInterval(nextSlide, 4000); 
            }
        } else {
            clearInterval(interval);
            interval = null;
            // Reset to first slide when switching to desktop
            index = 0;
            slider.style.transform = "translateX(0)";
        }
    }

    startSlider();
    window.addEventListener("resize", startSlider);

    // Auto Refresh Page on Mobile <-> Desktop Switch
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", function () {
        let currentWidth = window.innerWidth;

        if (
            (lastWidth < 768 && currentWidth >= 1024) || // Mobile to Desktop
            (lastWidth >= 1024 && currentWidth < 768)   // Desktop to Mobile
        ) {
            location.reload(); // Reload page
        }

        lastWidth = currentWidth;
    });
});