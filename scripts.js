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
    ctaButtons.forEach((button) => {
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

    // Testimonial Slider (Auto-Slide on Mobile)
    const slider = document.querySelector(".testimonial-slider");
    let index = 0;
    let interval;
    
    function nextSlide() {
        index++;
        if (index >= slider.children.length) {
            index = 0;
        }
        slider.style.transform = `translateX(-${index * 100}%)`;
    }
    
    function startSlider() {
        if (window.innerWidth < 784) {
            if (!interval) {
                interval = setInterval(nextSlide, 4000); 
            }
        } else {
            clearInterval(interval);
            interval = null;
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
