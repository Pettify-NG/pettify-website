(function () {
  "use strict";

  // Auto-inject Font Awesome if missing
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(faLink);
  }

  const onHome = /(?:^|\/)index\.html$/.test(location.pathname) || /\/$/.test(location.pathname);
  const pageLink = function (hash) { return onHome ? hash : "/" + hash; };

  const headerHTML = `
<div class="micro">
  <div class="wrap">
    <div class="micro-left">
      <span>hello@pettify.co</span>
      <span>+234 701 859 0284</span>
    </div>
    <div><a href="blogs">Pet Care Blog</a></div>
  </div>
</div>

<header class="main">
  <div class="wrap header-row">
    <a href="/" class="logo" aria-label="Pettify home">
      <img class="brand-logo" src="images/web_logo.webp" alt="Pettify">
    </a>
    <form class="search-bar" id="site-search" role="search">
      <div class="search-category">
        <button class="search-cat" id="category-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="category-menu">All categories <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        <div class="category-menu" id="category-menu" role="menu" aria-label="Pet categories">
          <div class="category-menu-title">What are you looking for?</div>
          <a class="category-option" href="listings?category=dogs" role="menuitem"><span class="category-emoji">🐶</span><span><b>Dogs</b><small>Puppies and adult dogs</small></span><span class="category-arrow">→</span></a>
          <a class="category-option" href="listings?category=cats" role="menuitem"><span class="category-emoji">🐱</span><span><b>Cats</b><small>Kittens and adult cats</small></span><span class="category-arrow">→</span></a>
          <a class="category-option" href="listings?category=others" role="menuitem"><span class="category-emoji">🐦</span><span><b>Other pets</b><small>Birds, rabbits and more</small></span><span class="category-arrow">→</span></a>
          <a class="category-option" href="listings?category=accessories" role="menuitem"><span class="category-emoji">🦴</span><span><b>Accessories</b><small>Food, toys and essentials</small></span><span class="category-arrow">→</span></a>
          <a class="category-option" href="vet-booking" role="menuitem"><span class="category-emoji">🩺</span><span><b>Vet care</b><small>Book trusted professionals</small></span><span class="category-arrow">→</span></a>
        </div>
      </div>
      <input class="search-input" name="search" type="search" aria-label="Search listings" placeholder="Search breeds, pets, locations, accessories...">
      <button class="search-go" type="submit" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
    </form>
    <div class="help-block">
      <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
      <div class="txt"><b>Need help?</b><span>+234 701 859 0284</span></div>
    </div>
    <div class="icon-cluster">
      <button class="icon-btn account-trigger" type="button" data-app-modal data-modal-context="account" aria-label="Open your Pettify account"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg></button>
      <button class="icon-btn cart-trigger" type="button" data-app-modal data-modal-context="cart" aria-label="Open your Pettify cart"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H5"/></svg></button>
      <button class="burger" type="button" aria-label="Toggle navigation" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
    </div>
    <div class="header-app-btns">
      <a href="https://play.google.com/store/apps/details?id=com.pettify.app" target="_blank" rel="noopener" class="hdr-store-btn" aria-label="Get Pettify on Google Play">
        <i class="fa-brands fa-google-play"></i>
        <span><small>Get it on</small><b>Google Play</b></span>
      </a>
      <a href="https://apps.apple.com/ng/app/pettify/id6757312160" target="_blank" rel="noopener" class="hdr-store-btn" aria-label="Download Pettify on App Store">
        <i class="fa-brands fa-apple"></i>
        <span><small>Download on</small><b>App Store</b></span>
      </a>
    </div>
  </div>
</header>

<div class="navrow" id="global-navigation">
  <div class="mobile-menu-head">
    <a class="mobile-brand" href="/"><img src="images/nav_logo.webp" alt=""><span>Pettify</span></a>
    <button class="menu-close" type="button" aria-label="Close navigation">×</button>
  </div>
  <div class="wrap">
    <nav class="navlinks">
      <a href="/">Home</a>
      <a href="listings">Listings</a>
      <a href="listings?category=dogs">Dogs</a>
      <a href="listings?category=cats">Cats</a>
      <a href="listings?category=accessories">Accessories</a>
      <a href="vet-booking">Vet Booking</a>
      <a href="list-pet">List your pet & accessories</a>
      <a href="blogs">Blog</a>
      <a href="about">About Us</a>
      <a href="https://www.coachli.co/pettify" target="_blank" rel="noopener">Book a Call</a>
    </nav>
    <div class="mobile-menu-extra">
      <p>Find pets, manage purchases and book vet care from the Pettify mobile app.</p>
      <div class="mobile-store-links">
        <a href="https://play.google.com/store/apps/details?id=com.pettify.app" target="_blank" rel="noopener"><i class="fa-brands fa-google-play" style="font-size:18px; margin-right:8px;"></i> Google Play</a>
        <a href="https://apps.apple.com/ng/app/pettify/id6757312160" target="_blank" rel="noopener"><i class="fa-brands fa-apple" style="font-size:20px; margin-right:8px; margin-top:-2px;"></i> App Store</a>
      </div>
    </div>
  </div>
</div>

<div class="stripe">
  <div class="wrap">
    <div class="stripe-left">
      <span>✓ Verified sellers only</span>
      <span>✓ Free to list for life</span>
      <span>✓ Delivery nationwide</span>
    </div>
    <div class="stripe-right">
      <a href="${pageLink("#faq")}">Help</a>
      <a href="#" data-app-modal data-modal-context="account">My Account</a>
    </div>
  </div>
</div>`;

  const footerHTML = `
<footer>
  <div class="wrap">
    <div class="foot-top">
      <h3>Ready to find your pawfect companion?</h3>
      <a href="listings" class="btn btn--orange">Browse pets</a>
    </div>
    <div class="foot-cols">
      <div class="foot-col">
        <a href="/" class="logo shell-footer-logo"><img class="brand-logo" src="images/web_logo.webp" alt="Pettify"></a>
        <p>The leading pet marketplace, connecting buyers with trusted sellers nationwide.</p>
        <div class="foot-app-stores" style="margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="https://play.google.com/store/apps/details?id=com.pettify.app" target="_blank" rel="noopener" class="foot-store-btn" aria-label="Get Pettify on Google Play">
            <i class="fa-brands fa-google-play"></i>
            <span><small>Get it on</small><b>Google Play</b></span>
          </a>
          <a href="https://apps.apple.com/ng/app/pettify/id6757312160" target="_blank" rel="noopener" class="foot-store-btn" aria-label="Download Pettify on App Store">
            <i class="fa-brands fa-apple"></i>
            <span><small>Download on</small><b>App Store</b></span>
          </a>
        </div>
      </div>
      <div class="foot-col">
        <h5>Product</h5>
        <ul>
          <li><a href="listings">Listings</a></li>
          <li><a href="blogs">Blog</a></li>
          <li><a href="about">About us</a></li>
          <li><a href="contact">Contact us</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Legal</h5>
        <ul>
          <li><a href="terms">Terms of use</a></li>
          <li><a href="policy">Privacy policy</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Connect</h5>
        <ul>
          <li><a href="https://www.coachli.co/pettify" target="_blank" rel="noopener">Book a Call (Coachli)</a></li>
          <li><a href="mailto:hello@pettify.co">hello@pettify.co</a></li>
          <li><a href="tel:+2347018590284">+234 701 859 0284</a></li>
        </ul>
        <div class="foot-socials" style="margin-top: 18px; display: flex; gap: 10px; align-items: center;">
          <a href="https://instagram.com/usepettify" target="_blank" rel="noopener" aria-label="Instagram on Instagram" class="social-icon-btn"><i class="fa-brands fa-instagram"></i></a>
          <a href="https://x.com/usepettify" target="_blank" rel="noopener" aria-label="Pettify on X" class="social-icon-btn"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.tiktok.com/@usepettify" target="_blank" rel="noopener" aria-label="Pettify on TikTok" class="social-icon-btn"><i class="fa-brands fa-tiktok"></i></a>
          <a href="https://www.linkedin.com/company/pettify" target="_blank" rel="noopener" aria-label="Pettify on LinkedIn" class="social-icon-btn"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Pettify Global Technologies LTD. All rights reserved.</span>
      <span>Made for pet lovers</span>
    </div>
  </div>
</footer>`;

  const modalHTML = `
<div class="app-modal" id="app-download-modal" aria-hidden="true">
  <div class="app-modal-backdrop" data-modal-close></div>
  <div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="app-modal-title" aria-describedby="app-modal-description" tabindex="-1">
    <button class="app-modal-close" type="button" data-modal-close aria-label="Close app download window">×</button>
    <div class="app-modal-copy">
      <div class="app-modal-icon">🐾</div>
      <div class="app-modal-kicker">Continue with Pettify</div>
      <h2 id="app-modal-title">Your account lives in the app.</h2>
      <p id="app-modal-description">Download Pettify to manage your account, save pets, complete purchases and keep every conversation in one secure place.</p>
      <div class="app-modal-points">
        <span>✓ Verified sellers</span>
        <span>✓ Secure checkout</span>
        <span>✓ Vet booking</span>
      </div>
      <div class="app-modal-store-links">
        <a href="https://play.google.com/store/apps/details?id=com.pettify.app" target="_blank" rel="noopener"><span class="modal-store-icon"><i class="fa-brands fa-google-play"></i></span><span><small>Get it on</small><b>Google Play</b></span></a>
        <a href="https://apps.apple.com/ng/app/pettify/id6757312160" target="_blank" rel="noopener"><span class="modal-store-icon"><i class="fa-brands fa-apple"></i></span><span><small>Download on the</small><b>App Store</b></span></a>
      </div>
    </div>
    <div class="app-modal-qr">
      <div class="qr-frame"><img src="images/pettify-app-qr.webp" alt="QR code for Pettify app download options"></div>
      <div><b>Scan with your phone</b><p>Open Pettify download options instantly.</p></div>
    </div>
  </div>
</div>`;

  function injectShell() {
    // Remove all old header / nav nodes
    document.querySelectorAll(".micro, header.main, .navrow, .stripe, .topbar, .main-header, .global-nav").forEach(function (node) { node.remove(); });
    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    // Remove all old footer / modal nodes
    document.querySelectorAll("body > footer, #app-download-modal, #app-modal").forEach(function (node) { node.remove(); });
    document.body.insertAdjacentHTML("beforeend", footerHTML + modalHTML);
  }

  function initShellInteractions() {
    const search = document.getElementById("site-search");
    const categoryToggle = document.getElementById("category-toggle");
    const categoryMenu = document.getElementById("category-menu");
    const burger = document.querySelector(".burger");
    const nav = document.getElementById("global-navigation");
    const menuClose = document.querySelector(".menu-close");
    const appModal = document.getElementById("app-download-modal");
    const appModalCard = appModal ? appModal.querySelector(".app-modal-card") : null;
    const appModalTitle = document.getElementById("app-modal-title");
    const appModalDescription = document.getElementById("app-modal-description");
    let lastModalTrigger = null;

    function syncOverlayLock() {
      const modalOpen = appModal && appModal.classList.contains("is-open");
      const menuOpen = nav && nav.classList.contains("mobile-open");
      document.body.style.overflow = (modalOpen || menuOpen) ? "hidden" : "";
    }

    function closeCategoryMenu() {
      if (!categoryMenu || !categoryToggle) return;
      categoryMenu.classList.remove("open");
      categoryToggle.setAttribute("aria-expanded", "false");
    }

    function closeMobileMenu() {
      if (!nav || !burger) return;
      nav.classList.remove("mobile-open");
      burger.setAttribute("aria-expanded", "false");
      syncOverlayLock();
    }

    function openAppModal(trigger) {
      if (!appModal || !appModalCard) return;
      const context = (trigger && trigger.dataset && trigger.dataset.modalContext) ? trigger.dataset.modalContext : "account";
      const content = {
        account: {
          title: "Your account lives in the app.",
          description: "Download Pettify to manage your account, save pets, complete purchases and keep every conversation in one secure place."
        },
        cart: {
          title: "Your cart is ready in the app.",
          description: "Use the Pettify app to review your items, talk with verified sellers and complete payment securely."
        },
        vet: {
          title: "Book trusted vet care in the app.",
          description: "Download Pettify to find veterinary professionals, choose a convenient time and manage your appointment from your phone."
        },
        sell: {
          title: "Start selling on the Pettify app.",
          description: "Download Pettify to create your storefront, list pets & accessories, reach verified buyers nationwide, and close sales securely."
        }
      };
      const selected = content[context] || content.account;
      if (appModalTitle) appModalTitle.textContent = selected.title;
      if (appModalDescription) appModalDescription.textContent = selected.description;
      lastModalTrigger = trigger;
      closeMobileMenu();
      appModal.classList.add("is-open");
      appModal.setAttribute("aria-hidden", "false");
      syncOverlayLock();
      window.requestAnimationFrame(function () {
        appModalCard.focus();
      });
    }

    function closeAppModal() {
      if (!appModal) return;
      appModal.classList.remove("is-open");
      appModal.setAttribute("aria-hidden", "true");
      syncOverlayLock();
      if (lastModalTrigger) lastModalTrigger.focus();
    }

    if (search) {
      search.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = search.querySelector(".search-input");
        const query = input ? input.value : "";
        window.location.href = "listings?search=" + encodeURIComponent(String(query || "").trim());
      });
    }

    if (categoryToggle && categoryMenu) {
      categoryToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        const open = categoryMenu.classList.toggle("open");
        categoryToggle.setAttribute("aria-expanded", String(open));
      });
      categoryMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeCategoryMenu);
      });
      document.addEventListener("click", function (event) {
        if (!event.target.closest(".search-category")) closeCategoryMenu();
      });
    }

    if (burger && nav) {
      burger.addEventListener("click", function () {
        const open = nav.classList.toggle("mobile-open");
        burger.setAttribute("aria-expanded", String(open));
        syncOverlayLock();
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMobileMenu);
      });
      if (menuClose) menuClose.addEventListener("click", closeMobileMenu);
    }

    // Global click delegate for [data-app-modal] buttons
    document.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-app-modal]");
      if (trigger) {
        event.preventDefault();
        openAppModal(trigger);
      }
    });

    if (appModal) {
      appModal.querySelectorAll("[data-modal-close]").forEach(function (control) {
        control.addEventListener("click", closeAppModal);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeAppModal();
        closeMobileMenu();
        closeCategoryMenu();
      }
    });

    if (location.hash) {
      setTimeout(function () {
        const target = document.querySelector(location.hash);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }

  // Run on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectShell();
      initShellInteractions();
    });
  } else {
    injectShell();
    initShellInteractions();
  }
})();
