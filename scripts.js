// ===== POPUP FUNCTIONALITY =====
let currentSlide = 0;

// Show popup when page loads
window.addEventListener('load', function() {
    setTimeout(() => {
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay) {
            popupOverlay.classList.add('active');
        }
    }, 1500);
});

// Close popup functionality
const closeBtn = document.getElementById('closeBtn');
const popupOverlay = document.getElementById('popupOverlay');

if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        closePopup();
    });
}

if (popupOverlay) {
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closePopup();
        }
    });
}

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const popupOverlay = document.getElementById('popupOverlay');
        if (popupOverlay && popupOverlay.classList.contains('active')) {
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
    
    if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

// Auto-advance slides
let autoSlideInterval = setInterval(() => {
    const slides = document.querySelectorAll('.popup-slide');
    const popupOverlay = document.getElementById('popupOverlay');
    
    if (popupOverlay && popupOverlay.classList.contains('active')) {
        nextSlide();
        if (currentSlide === slides.length - 1) {
            setTimeout(() => {
                goToSlide(0);
            }, 4000);
        }
    }
}, 8000);

// Pause auto-advance when user interacts
const popupContainer = document.querySelector('.popup-container');
if (popupContainer) {
    popupContainer.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        setTimeout(() => {
            autoSlideInterval = setInterval(() => {
                const slides = document.querySelectorAll('.popup-slide');
                const popupOverlay = document.getElementById('popupOverlay');
                
                if (popupOverlay && popupOverlay.classList.contains('active')) {
                    nextSlide();
                    if (currentSlide === slides.length - 1) {
                        setTimeout(() => {
                            goToSlide(0);
                        }, 4000);
                    }
                }
            }, 8000);
        }, 5000);
    });
}

// Shake animation
window.addEventListener('load', function() {
    setTimeout(() => {
        const popupContainer = document.querySelector('.popup-container');
        if (popupContainer) {
            popupContainer.style.animation = 'gentleShake 0.5s ease-in-out';
        }
    }, 2000);
});

// ===== MAIN FUNCTIONALITY (Wait for DOM) =====
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

    // Tab Navigation - FIXED VERSION
    const tabs = document.querySelectorAll(".tab");
    const sections = document.querySelectorAll(".tab-content section");

    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // Remove active from all tabs
            tabs.forEach((t) => t.classList.remove("active"));
            
            // Remove active from all sections
            sections.forEach((section) => {
                section.classList.remove("active-tab");
                section.classList.add("inactive-tab");
            });
            
            // Add active to clicked tab
            this.classList.add("active");
            
            // Show target section
            const targetSelector = this.dataset.target;
            const target = document.querySelector(targetSelector);
            
            if (target) {
                target.classList.add("active-tab");
                target.classList.remove("inactive-tab");
            }
        });
    });

    // Mobile Menu Toggle - FIXED VERSION
    const hamburger = document.getElementById("hamburger");
    const navbarMenu = document.getElementById("navbar-menu");
    const closeButton = document.getElementById("close-button");

    if (hamburger && navbarMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            navbarMenu.classList.add("active");
        });
    }

    if (closeButton && navbarMenu) {
        closeButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            navbarMenu.classList.remove("active");
        });
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (navbarMenu && 
            navbarMenu.classList.contains("active") && 
            !navbarMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navbarMenu.classList.remove("active");
        }
    });

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
            if (navbarMenu) {
                navbarMenu.classList.remove("active");
            }
            downloadSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Make scrollToDownload globally accessible
    window.scrollToDownload = scrollToDownload;

    const ctaButtons = document.querySelectorAll(".cta-button, .bcta-button");
    ctaButtons.forEach((button) => {
        button.addEventListener("click", scrollToDownload);
    });

    // Close Navbar on Link Click (Mobile)
    const navLinks = document.querySelectorAll(".navbar-menu a");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && 
                pricingDropdown && 
                !pricingDropdown.contains(e.target) && 
                pricingLink && 
                !pricingLink.contains(e.target)) {
                if (navbarMenu) {
                    navbarMenu.classList.remove("active");
                }
            }
        });
    });

    // Testimonial Slider
    const slider = document.querySelector(".testimonial-slider");
    if (slider) {
        let index = 0;
        let interval;

        function nextSlide() {
            index++;
            if (index >= slider.children.length) {
                slider.style.transition = "transform 0.5s ease";
                slider.style.transform = `translateX(-${index * 100}%)`;
                
                setTimeout(() => {
                    slider.style.transition = "none";
                    index = 0;
                    slider.style.transform = `translateX(0)`;
                    setTimeout(() => {
                        slider.style.transition = "transform 0.5s ease";
                    }, 50);
                }, 500);
                return;
            }
            
            slider.style.transition = "transform 0.5s ease";
            slider.style.transform = `translateX(-${index * 100}%)`;
        }

        function startSlider() {
            if (window.innerWidth < 784) {
                slider.style.transition = "transform 0.5s ease";
                if (!interval) {
                    interval = setInterval(nextSlide, 4000); 
                }
            } else {
                clearInterval(interval);
                interval = null;
                index = 0;
                slider.style.transform = "translateX(0)";
            }
        }

        startSlider();
        window.addEventListener("resize", startSlider);
    }

    // Auto Refresh on Viewport Change
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", function () {
        let currentWidth = window.innerWidth;

        if (
            (lastWidth < 768 && currentWidth >= 1024) ||
            (lastWidth >= 1024 && currentWidth < 768)
        ) {
            location.reload();
        }

        lastWidth = currentWidth;
    });
});