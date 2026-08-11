(function () {
  "use strict";

  const API_BASE_URL = "https://pettify-backend.onrender.com/api/v1";
  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.pettify.app";
  const APP_STORE_URL = "https://apps.apple.com/ng/app/pettify/id6757312160";

  function getListingImage(item) {
    const images = item.pet_images || item.accessoryImages || [];
    return images[0] || "images/pettify.webp";
  }

  function getLocation(location) {
    if (!location) return "All Locations";
    if (typeof location === "string") return location;
    return location.lga || location.state || "All Locations";
  }

  function formatPrice(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Price in app";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatAge(dateOfBirth) {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    if (Number.isNaN(birthDate.getTime())) return "";
    const today = new Date();
    const months = Math.max(
      0,
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
        today.getMonth() -
        birthDate.getMonth()
    );
    if (months < 1) return "Under 1 month";
    if (months < 12) return months + " month" + (months === 1 ? "" : "s");
    const years = Math.floor(months / 12);
    return years + " year" + (years === 1 ? "" : "s");
  }

  function isAvailable(item) {
    return !item.isDeleted && (item.quantity === undefined || Number(item.quantity) > 0);
  }

  function listingDetails(item) {
    const category = String(item.category || "").toLowerCase();
    const isPet = ["dogs", "cats", "others"].includes(category);
    if (!isPet) return item.category || "Pet accessory";
    return [item.breed, item.gender, formatAge(item.date_of_birth)].filter(Boolean).join(" · ");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getImages(item) {
    if (Array.isArray(item.images) && item.images.length) return item.images;
    if (Array.isArray(item.image_urls) && item.image_urls.length) return item.image_urls;
    if (item.image_url) return [item.image_url];
    if (item.image) return [item.image];
    return ["images/pettify.webp"];
  }

  function drawerMarkup(item) {
    const category = String(item.category || "").toLowerCase();
    const isPetItem = ["dogs", "cats", "others"].includes(category);
    const description = item.description || "Open Pettify to ask the seller for more information about this listing.";
    const images = getImages(item).filter(Boolean);
    if (!images.length) images.push("images/pettify.webp");

    const thumbs = images.slice(0, 5).map(function (src, index) {
      return '<button class="drawer-thumb' + (index === 0 ? ' active' : '') + '" type="button" data-gallery-src="' + escapeHtml(src) + '" aria-label="View image ' + (index + 1) + '"><img src="' + escapeHtml(src) + '" alt=""></button>';
    }).join("");

    const tags = [
      isPetItem ? (item.category || "Pet") : "Accessory",
      item.breed || "",
      item.gender || "",
      item.date_of_birth ? formatAge(item.date_of_birth) : "",
      getLocation(item.location)
    ].filter(Boolean).map(function (val) {
      return '<span class="drawer-tag">' + escapeHtml(val) + '</span>';
    }).join("");

    const sellerName = item.seller_name || (item.seller && item.seller.name) || "Pettify Seller";

    return '<div class="drawer-scroll">' +
      '<div class="drawer-gallery">' +
        '<div class="drawer-hero"><img id="drawer-main-image" src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(item.name || item.breed || "Listing") + '"></div>' +
        (images.length > 1 ? '<div class="drawer-thumbnails">' + thumbs + '</div>' : '') +
      '</div>' +
      '<div class="drawer-body">' +
        '<div class="drawer-head"><h2 id="drawer-title">' + escapeHtml(item.name || item.breed || "Pet Listing") + '</h2><strong>' + formatPrice(item.price) + '</strong></div>' +
        '<div class="drawer-tags">' + tags + '</div>' +
        '<p class="drawer-description">' + escapeHtml(description) + '</p>' +
        '<div class="seller-panel"><div class="seller-avatar"><i class="fa-solid fa-store" aria-hidden="true"></i></div><div><b>' + escapeHtml(sellerName) + '</b><span>Verified Pettify seller</span></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="drawer-actions">' +
      '<button class="drawer-buy" type="button" data-app-modal data-modal-context="cart"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>Buy now</button>' +
      '<button class="drawer-share" type="button" data-share-current aria-label="Share listing"><i class="fa-solid fa-arrow-up-from-bracket" aria-label="Share listing"></i/></button>' +
    '</div>';
  }

  function openListingDrawer(item) {
    const drawer = document.getElementById("listing-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    const content = document.getElementById("drawer-content");
    if (!drawer || !content) return;

    content.innerHTML = drawerMarkup(item);
    drawer.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");

    content.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("error", function () { img.src = "images/pettify.webp"; }, { once: true });
    });

    content.querySelectorAll("[data-gallery-src]").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        const main = document.getElementById("drawer-main-image");
        if (main) main.src = thumb.dataset.gallerySrc;
        content.querySelectorAll(".drawer-thumb").forEach(function (btn) {
          btn.classList.toggle("active", btn === thumb);
        });
      });
    });

    const closeBtn = document.getElementById("drawer-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeListingDrawer() {
    const drawer = document.getElementById("listing-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) backdrop.classList.remove("open");
    document.body.classList.remove("overlay-open");
  }

  function makeListingCard(item, index) {
    const link = document.createElement("a");
    const delayClass = "reveal-delay-" + (((index || 0) % 4) + 1);
    link.className = "lcard reveal-on-scroll " + delayClass;
    link.href = "listings?pet=" + encodeURIComponent(item._id || "");
    link.setAttribute("aria-label", "View " + (item.name || item.breed || "listing"));

    link.addEventListener("click", function (event) {
      event.preventDefault();
      openListingDrawer(item);
    });

    const imageWrap = document.createElement("div");
    imageWrap.className = "lcard-img";

    const image = document.createElement("img");
    image.src = getListingImage(item);
    image.alt = item.name || item.breed || "Pettify listing";
    image.loading = "lazy";
    image.addEventListener("error", function () {
      image.src = "images/pettify.webp";
    }, { once: true });

    const body = document.createElement("div");
    body.className = "lcard-body";
    const top = document.createElement("div");
    top.className = "top";
    const heading = document.createElement("h4");
    heading.textContent = item.name || item.breed || "Available now";
    top.appendChild(heading);

    const details = document.createElement("div");
    details.className = "breed";
    details.textContent = listingDetails(item);

    const footer = document.createElement("div");
    footer.className = "lcard-foot";
    const price = document.createElement("span");
    price.className = "lcard-price";
    price.textContent = formatPrice(item.price);
    const location = document.createElement("span");
    location.className = "lcard-loc";
    location.textContent = getLocation(item.location);

    footer.append(price, location);
    body.append(top, details, footer);
    imageWrap.append(image);
    link.append(imageWrap, body);
    return link;
  }

  function updateCategory(category, items) {
    const activeItems = items.filter(isAvailable);
    const count = document.querySelector('[data-category-count="' + category + '"]');
    const image = document.querySelector('[data-category-image="' + category + '"]');
    if (count) count.textContent = activeItems.length + " available";
    if (image && activeItems.length) image.src = getListingImage(activeItems[0]);
  }



  async function loadListings() {
    const grid = document.getElementById("home-listings");
    try {
      const response = await fetch(API_BASE_URL + "/listings");
      if (!response.ok) throw new Error("Listings request failed");
      const result = await response.json();
      if (!result.success || !result.data) throw new Error("Unexpected listings response");

      const categories = {
        dogs: result.data.dogs || [],
        cats: result.data.cats || [],
        others: result.data.others || [],
        accessories: result.data.accessories || []
      };

      Object.keys(categories).forEach(function (category) {
        updateCategory(category, categories[category]);
      });

      const listings = Object.values(categories).flat().filter(isAvailable);
      if (!grid) return;
      grid.replaceChildren();

      if (!listings.length) {
        const empty = document.createElement("div");
        empty.className = "listing-state";
        empty.textContent = "No live listings are available right now. Please check again soon.";
        grid.appendChild(empty);
        return;
      }

      listings.slice(0, 6).forEach(function (item, idx) {
        grid.appendChild(makeListingCard(item, idx));
      });
    } catch (error) {
      console.error("Unable to load homepage listings:", error);
      document.querySelectorAll("[data-category-count]").forEach(function (count) {
        count.textContent = "View listings";
      });
      if (grid) {
        const state = document.createElement("div");
        state.className = "listing-state";
        state.append("We could not load live listings just now. ");
        const link = document.createElement("a");
        link.href = "listings";
        link.textContent = "Open the full listings page";
        state.appendChild(link);
        grid.replaceChildren(state);
      }
    }
  }

  function makeBlogCard(post) {
    const link = document.createElement("a");
    link.className = "blog-card";
    link.href = "blog-details?slug=" + encodeURIComponent(post.slug || post._id || "");

    const imageWrap = document.createElement("div");
    imageWrap.className = "blog-img";
    const category = document.createElement("span");
    category.className = "blog-cat";
    category.textContent = post.category || "Pet care";
    const image = document.createElement("img");
    image.src = post.coverImage || "images/pettify.webp";
    image.alt = post.title || "Pettify pet-care article";
    image.loading = "lazy";
    image.addEventListener("error", function () {
      image.src = "images/pettify.webp";
    }, { once: true });

    const body = document.createElement("div");
    body.className = "blog-body";
    const heading = document.createElement("h4");
    heading.textContent = post.title || "Pet-care insight";
    const excerpt = document.createElement("p");
    excerpt.textContent = post.excerpt || "Read the latest advice from the Pettify team.";
    const meta = document.createElement("div");
    meta.className = "blog-meta";
    const author = document.createElement("span");
    author.textContent = "PETTIFY AUTHOR";
    const action = document.createElement("span");
    action.textContent = "READ ARTICLE";

    meta.append(author, action);
    body.append(heading, excerpt, meta);
    imageWrap.append(category, image);
    link.append(imageWrap, body);
    return link;
  }

  async function loadBlogs() {
    const grid = document.getElementById("home-blogs");
    if (!grid) return;
    try {
      const response = await fetch(API_BASE_URL + "/blogs?limit=3");
      if (!response.ok) throw new Error("Blog request failed");
      const result = await response.json();
      const posts = result.blogs || result.data || [];
      grid.replaceChildren();
      posts.slice(0, 3).forEach(function (post) {
        grid.appendChild(makeBlogCard(post));
      });
      if (!posts.length) {
        const link = document.createElement("a");
        link.className = "blog-card is-loading";
        link.href = "blogs";
        link.textContent = "Explore Pettify pet-care articles";
        grid.appendChild(link);
      }
    } catch (error) {
      console.error("Unable to load homepage blogs:", error);
      const link = document.createElement("a");
      link.className = "blog-card is-loading";
      link.href = "blogs";
      link.textContent = "Open the pet-care blog";
      grid.replaceChildren(link);
    }
  }

  function wireInteractions() {
    const search = document.getElementById("site-search");
    const categoryToggle = document.getElementById("category-toggle");
    const categoryMenu = document.getElementById("category-menu");
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".navrow");
    const menuClose = document.querySelector(".menu-close");
    const appModal = document.getElementById("app-download-modal");
    const appModalCard = appModal && appModal.querySelector(".app-modal-card");
    const appModalTitle = document.getElementById("app-modal-title");
    const appModalDescription = document.getElementById("app-modal-description");
    let lastModalTrigger = null;

    function syncOverlayLock() {
      const menuOpen = nav && nav.classList.contains("mobile-open");
      const modalOpen = appModal && appModal.classList.contains("is-open");
      document.body.classList.toggle("overlay-open", Boolean(menuOpen || modalOpen));
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
      const context = trigger.dataset.modalContext || "account";
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
      appModalTitle.textContent = selected.title;
      appModalDescription.textContent = selected.description;
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
        const query = new FormData(search).get("search");
        window.location.href = "listings?search=" + encodeURIComponent(String(query || "").trim());
      });
    }

    if (categoryToggle && categoryMenu) {
      categoryToggle.addEventListener("click", function () {
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

    const isApple = /iPad|iPhone|iPod|Macintosh|MacIntel/.test(navigator.userAgent || "");
    document.querySelectorAll("[data-app-link]").forEach(function (link) {
      link.href = isApple ? APP_STORE_URL : PLAY_STORE_URL;
      link.target = "_blank";
      link.rel = "noopener";
    });

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

    document.querySelectorAll("[data-app-modal]").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openAppModal(trigger);
      });
    });

    if (appModal) {
      appModal.querySelectorAll("[data-modal-close]").forEach(function (control) {
        control.addEventListener("click", closeAppModal);
      });
    }

    const drawerClose = document.getElementById("drawer-close");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    if (drawerClose) drawerClose.addEventListener("click", closeListingDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeListingDrawer);

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeCategoryMenu();
      const listingDrawer = document.getElementById("listing-drawer");
      if (listingDrawer && listingDrawer.classList.contains("open")) {
        closeListingDrawer();
        return;
      }
      if (appModal && appModal.classList.contains("is-open")) {
        closeAppModal();
      } else {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 640) closeMobileMenu();
    });
  }



  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal-on-scroll, .reveal-scale, .reveal-slide-left, .reveal-slide-right").forEach(function(el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });

    const targets = document.querySelectorAll(".reveal-on-scroll, .reveal-scale, .reveal-slide-left, .reveal-slide-right");
    targets.forEach(function(target) {
      observer.observe(target);
    });
  }

  function wireTestiFilters() {
    const tabs = document.querySelectorAll("[data-testi-filter]");
    const cards = document.querySelectorAll("[data-testi-type]");
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const filter = tab.getAttribute("data-testi-filter");
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        cards.forEach(function (card) {
          const type = card.getAttribute("data-testi-type");
          if (filter === "all" || type === filter) {
            card.style.display = "";
            card.style.animation = "fadeInCard 0.4s ease forwards";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  function initHeroMosaicAnimation() {
    const mosaic = document.querySelector(".hero-mosaic");
    if (!mosaic || !("requestAnimationFrame" in window)) return;

    const columns = mosaic.querySelectorAll(".hero-mosaic-col");
    if (columns.length !== 2) return;

    const progress = [0, 0];
    const durations = [22000, 20000];
    let lastTimestamp = null;

    mosaic.classList.add("is-js-animated");

    function animate(timestamp) {
      if (lastTimestamp === null) lastTimestamp = timestamp;

      // Capping the delta prevents iOS from racing to catch up after Safari
      // pauses rendering during a scroll, tab switch, or power-state change.
      const elapsed = Math.min(Math.max(timestamp - lastTimestamp, 0), 50);
      const isMobile = window.innerWidth <= 520;
      const distances = isMobile ? [840, 720] : [1096, 936];

      progress[0] = (progress[0] + elapsed / durations[0]) % 1;
      progress[1] = (progress[1] + elapsed / durations[1]) % 1;

      columns[0].style.transform = "translate3d(0," + (-distances[0] * progress[0]).toFixed(3) + "px,0)";
      columns[1].style.transform = "translate3d(0," + (-distances[1] * (1 - progress[1])).toFixed(3) + "px,0)";

      lastTimestamp = timestamp;
      window.requestAnimationFrame(animate);
    }

    document.addEventListener("visibilitychange", function () {
      lastTimestamp = null;
    });
    window.addEventListener("pageshow", function () {
      lastTimestamp = null;
    });

    window.requestAnimationFrame(animate);
  }

  initHeroMosaicAnimation();
  wireInteractions();
  wireTestiFilters();
  loadListings().then(function() {
    initScrollReveal();
  });
  loadBlogs().then(function() {
    initScrollReveal();
  });
  window.addEventListener("DOMContentLoaded", initScrollReveal);
})();
