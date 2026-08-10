(function () {
  "use strict";

  const API_URL = "https://pettify-backend.onrender.com/api/v1/listings";
  const els = {
    grid: document.getElementById("listings-grid"), loading: document.getElementById("loading-state"), empty: document.getElementById("empty-state"), error: document.getElementById("error-state"),
    resultsCount: document.getElementById("results-count"), filterCopy: document.getElementById("active-filter-copy"), chips: document.getElementById("active-filters"),
    search: document.getElementById("search-input"), min: document.getElementById("price-min"), max: document.getElementById("price-max"), location: null, sort: null,
    minLabel: document.getElementById("price-min-label"), maxLabel: document.getElementById("price-max-label"), rangeFill: document.getElementById("price-range-fill"),
    locationSelect: document.getElementById("location-select"), sortSelect: document.getElementById("sort-wrapper"),
    panel: document.getElementById("filter-panel"), filterBackdrop: document.getElementById("filter-backdrop"), drawer: document.getElementById("listing-drawer"), drawerBackdrop: document.getElementById("drawer-backdrop"), drawerContent: document.getElementById("drawer-content")
  };
  const state = { all: [], filtered: [], category: "all", activeListing: null, priceCeiling: 0 };
  const selectValues = { location: "", sort: "recommended" };

  function resetCustomSelect(wrapperEl, stateKey) {
    const trigger = wrapperEl.querySelector(".custom-select-trigger");
    const valueDisplay = trigger.querySelector(".custom-select-value");
    const optionsList = wrapperEl.querySelector(".custom-select-options");
    optionsList.querySelectorAll("li").forEach(function (el) { el.classList.remove("selected"); });
    const defaultOption = optionsList.querySelector('li[data-value=""]') || optionsList.querySelector("li");
    if (defaultOption) defaultOption.classList.add("selected");
    valueDisplay.textContent = valueDisplay.dataset.default || defaultOption?.textContent || "";
    selectValues[stateKey] = "";
  }

  function initCustomSelect(wrapperEl, stateKey, onChange) {
    if (!wrapperEl) return;
    const trigger = wrapperEl.querySelector(".custom-select-trigger");
    const optionsList = wrapperEl.querySelector(".custom-select-options");
    const valueDisplay = trigger.querySelector(".custom-select-value");

    function closeAll() {
      document.querySelectorAll(".custom-select.open").forEach(function (el) {
        el.classList.remove("open");
        el.querySelector(".custom-select-trigger").setAttribute("aria-expanded", "false");
      });
    }

    function toggle() {
      const isOpen = wrapperEl.classList.contains("open");
      closeAll();
      if (!isOpen) {
        wrapperEl.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        const searchInput = wrapperEl.querySelector(".custom-select-search-input");
        if (searchInput) {
          searchInput.value = "";
          searchInput.dispatchEvent(new Event("input"));
          setTimeout(function() { searchInput.focus(); }, 10);
        }
      }
    }

    function selectOption(li) {
      optionsList.querySelectorAll("li").forEach(function (el) { el.classList.remove("selected"); });
      li.classList.add("selected");
      valueDisplay.textContent = li.textContent;
      selectValues[stateKey] = li.dataset.value;
      wrapperEl.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      if (onChange) onChange();
    }

    trigger.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    optionsList.addEventListener("click", function (e) {
      const li = e.target.closest("li");
      if (li) { e.stopPropagation(); selectOption(li); }
      else if (e.target.closest(".custom-select-search-input")) { e.stopPropagation(); }
    });
    
    const searchInput = wrapperEl.querySelector(".custom-select-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        const term = e.target.value.toLowerCase();
        optionsList.querySelectorAll("li").forEach(function(li) {
          li.style.display = li.textContent.toLowerCase().includes(term) ? "" : "none";
        });
      });
    }

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!wrapperEl.classList.contains("open")) { toggle(); return; }
        const items = Array.from(optionsList.querySelectorAll("li"));
        const current = optionsList.querySelector("li.selected");
        let idx = items.indexOf(current);
        idx = e.key === "ArrowDown" ? Math.min(idx + 1, items.length - 1) : Math.max(idx - 1, 0);
        selectOption(items[idx]);
        wrapperEl.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
      if (e.key === "Escape") { wrapperEl.classList.remove("open"); trigger.setAttribute("aria-expanded", "false"); }
      if (e.key === "Enter" && wrapperEl.classList.contains("open")) {
        e.preventDefault();
        wrapperEl.classList.remove("open"); trigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", function () {
      if (wrapperEl.classList.contains("open")) {
        wrapperEl.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function text(value, fallback) { return String(value || fallback || ""); }
  function escapeHtml(value) { return text(value).replace(/[&<>'"]/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]; }); }
  function imagesFor(item) { return item.pet_images || item.accessoryImages || item.images || []; }
  function imageFor(item) { return imagesFor(item)[0] || "images/pettify.webp"; }
  function categoryFor(item) {
    const raw = text(item.category || item.pet_category, "others").toLowerCase();
    if (raw.includes("dog")) return "dogs";
    if (raw.includes("cat")) return "cats";
    if (raw.includes("accessor") || raw.includes("product")) return "accessories";
    return "others";
  }
  function categoryLabel(category) { return ({ dogs: "Dogs", cats: "Cats", others: "Other pets", accessories: "Accessories" })[category] || "Listings"; }
  function nameFor(item) { return text(item.breed || item.name, "Pettify listing"); }
  function locationFor(item) {
    const location = item.location;
    if (!location) return "Nigeria";
    if (typeof location === "string") return location;
    return text(location.lga || location.state || location.city, "Nigeria");
  }
  function sellerFor(item) { return text(item.seller?.business_name || item.seller?.name || item.vendor?.business_name || item.owner?.name, "Pettify seller"); }
  function formatPrice(value) { const amount = Number(value); return Number.isFinite(amount) ? "₦" + amount.toLocaleString("en-NG") : "Price on request"; }
  function ageInMonths(dateValue) {
    if (!dateValue) return null;
    const birth = new Date(dateValue); if (Number.isNaN(birth.getTime())) return null;
    const today = new Date(); return Math.max(0, (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth());
  }
  function ageLabel(item) {
    const months = ageInMonths(item.date_of_birth);
    if (months === null) return "Age not listed";
    if (months < 1) return "Under 1 month";
    if (months < 12) return months + " month" + (months === 1 ? "" : "s");
    const years = Math.floor(months / 12); return years + " year" + (years === 1 ? "" : "s");
  }
  function isPet(item) { return categoryFor(item) !== "accessories"; }
  function available(item) { return !item.isDeleted && Number(item.quantity === undefined ? 1 : item.quantity) > 0; }

  function readUrlState() {
    const params = new URLSearchParams(location.search);
    const category = text(params.get("category")).toLowerCase();
    if (["dogs", "cats", "others", "accessories"].includes(category)) state.category = category;
    const query = params.get("search"); if (query) els.search.value = query;
  }

  function setCategory(category) {
    state.category = category;
    document.querySelectorAll("[data-category]").forEach(function (button) { button.classList.toggle("active", button.dataset.category === category); });
    applyFilters();
  }

  function selectedGenders() { return Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(function (input) { return input.value; }); }
  function normalizePriceRange() {
    let min = Number(els.min.value || 0); let max = Number(els.max.value || state.priceCeiling || 0);
    if (min > max) {
      if (document.activeElement === els.min) min = max; else max = min;
      els.min.value = String(min); els.max.value = String(max);
    }
    const ceiling = state.priceCeiling || 1;
    els.minLabel.textContent = formatPrice(min);
    els.maxLabel.textContent = max >= ceiling ? "Any" : formatPrice(max);
    els.rangeFill.style.left = (min / ceiling * 100) + "%";
    els.rangeFill.style.right = (100 - max / ceiling * 100) + "%";
  }

  function resetPriceRange() {
    els.min.value = "0"; els.max.value = String(state.priceCeiling || 100);
    normalizePriceRange();
  }

  function configurePriceRange() {
    const highest = Math.max.apply(null, state.all.map(function (item) { return Number(item.price || 0); }).filter(Number.isFinite).concat([1000]));
    const magnitude = Math.pow(10, Math.max(3, String(Math.round(highest)).length - 2));
    state.priceCeiling = Math.ceil(highest / magnitude) * magnitude;
    const step = Math.max(1000, Math.round(state.priceCeiling / 100));
    [els.min, els.max].forEach(function (input) { input.max = String(state.priceCeiling); input.step = String(step); });
    resetPriceRange();
  }
  function applyFilters() {
    const query = text(els.search.value).trim().toLowerCase();
    normalizePriceRange();
    const min = Number(els.min.value || 0); const max = Number(els.max.value || state.priceCeiling || Infinity);
    const location = selectValues.location; const genders = selectedGenders();
    state.filtered = state.all.filter(function (item) {
      const haystack = [nameFor(item), item.name, item.breed, locationFor(item), categoryFor(item)].join(" ").toLowerCase();
      return (state.category === "all" || categoryFor(item) === state.category) && (!query || haystack.includes(query)) && Number(item.price || 0) >= min && Number(item.price || 0) <= max && (!location || locationFor(item) === location) && (!genders.length || genders.includes(text(item.gender).toLowerCase()));
    });
    sortListings(); renderListings(); renderChips();
  }

  function sortListings() {
    const mode = selectValues.sort;
    state.filtered.sort(function (a, b) {
      if (mode === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (mode === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (mode === "newest") return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
      
      const aPet = isPet(a); const bPet = isPet(b);
      if (aPet !== bPet) return aPet ? -1 : 1;
      return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
    });
  }

  function listingCard(item) {
    const id = escapeHtml(item._id || item.id); const accessory = !isPet(item);
    const secondary = accessory ? text(item.category, "Pet accessory") : [text(item.gender), item.date_of_birth ? ageLabel(item) : ""].filter(Boolean).join(" · ");
    return '<article class="listing-card" tabindex="0" role="button" data-listing-id="' + id + '" aria-label="View ' + escapeHtml(nameFor(item)) + '">' +
      '<div class="card-image"><img src="' + escapeHtml(imageFor(item)) + '" alt="' + escapeHtml(nameFor(item)) + '" loading="lazy"><button class="share-card" type="button" data-save-id="' + id + '" aria-label="Save listing"><i class="fa-regular fa-heart" aria-hidden="true"></i></button></div>' +
      '<div class="card-body"><p class="card-category">' + escapeHtml(accessory ? "Accessories" : categoryFor(item)) + '</p><div class="card-top"><h2>' + escapeHtml(nameFor(item)) + '</h2></div><p class="card-sub">' + escapeHtml(secondary) + '</p><div class="card-foot"><strong>' + formatPrice(item.price) + '</strong><span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>' + escapeHtml(locationFor(item)) + '</span></div></div></article>';
  }

  function renderListings() {
    els.loading.hidden = true; els.error.hidden = true;
    els.resultsCount.textContent = state.filtered.length + " listing" + (state.filtered.length === 1 ? "" : "s") + " found";
    els.filterCopy.textContent = state.category === "all" ? "Pets and essentials available now" : "Showing " + categoryLabel(state.category).toLowerCase();
    els.empty.hidden = state.filtered.length > 0; els.grid.innerHTML = state.filtered.map(listingCard).join("");
    els.grid.querySelectorAll("img").forEach(function (image) { image.addEventListener("error", function () { image.src = "images/pettify.webp"; }, { once: true }); });
  }

  function renderChips() {
    const chips = [];
    if (state.category !== "all") chips.push({ label: state.category, clear: function () { setCategory("all"); } });
    if (els.search.value) chips.push({ label: '“' + els.search.value + '”', clear: function () { els.search.value = ""; applyFilters(); } });
    if (selectValues.location) chips.push({ label: selectValues.location, clear: function () { resetCustomSelect(els.locationSelect, 'location'); applyFilters(); } });
    if (Number(els.min.value) > 0 || Number(els.max.value) < state.priceCeiling) chips.push({ label: formatPrice(els.min.value || 0) + " – " + (Number(els.max.value) >= state.priceCeiling ? "Any" : formatPrice(els.max.value)), clear: function () { resetPriceRange(); applyFilters(); } });
    els.chips.replaceChildren(); chips.forEach(function (chip) { const button = document.createElement("button"); button.className = "filter-chip"; button.type = "button"; button.textContent = chip.label + "  ×"; button.addEventListener("click", chip.clear); els.chips.appendChild(button); });
  }

  function resetFilters() {
    els.search.value = ""; resetPriceRange(); resetCustomSelect(els.locationSelect, 'location');
    document.querySelectorAll('input[name="gender"]').forEach(function (input) { input.checked = false; }); 
    selectValues.sort = "recommended";
    var sortTrigger = els.sortSelect.querySelector('.custom-select-value');
    if (sortTrigger) sortTrigger.textContent = "Recommended";
    var sortOptions = els.sortSelect.querySelectorAll('.custom-select-options li');
    sortOptions.forEach(function(li) { li.classList.toggle('selected', li.dataset.value === "recommended"); });
    setCategory("all");
  }

  function populateFilters() {
    ["all", "dogs", "cats", "others", "accessories"].forEach(function (category) { const count = category === "all" ? state.all.length : state.all.filter(function (item) { return categoryFor(item) === category; }).length; const node = document.getElementById("count-" + category); if (node) node.textContent = count; });
    var locationOptions = document.getElementById('location-filter-options');
    while (locationOptions.children.length > 1) locationOptions.removeChild(locationOptions.lastChild);
    const locations = Array.from(new Set(state.all.map(locationFor))).filter(function (place) { return place && place !== "Nigeria"; }).sort();
    locations.forEach(function (place) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.dataset.value = place;
      li.textContent = place;
      locationOptions.appendChild(li);
    });
    configurePriceRange();
  }

  function drawerMarkup(item) {
    const accessory = !isPet(item); const description = text(item.description, "Open Pettify to ask the seller for more information about this listing.");
    const images = imagesFor(item).filter(Boolean); if (!images.length) images.push("images/pettify.webp");
    const thumbs = images.slice(0, 5).map(function (src, index) { return '<button class="drawer-thumb' + (index === 0 ? ' active' : '') + '" type="button" data-gallery-src="' + escapeHtml(src) + '" aria-label="View image ' + (index + 1) + '"><img src="' + escapeHtml(src) + '" alt=""></button>'; }).join("");
    const meta = [accessory ? categoryLabel(categoryFor(item)) : text(item.gender), !accessory && item.date_of_birth ? ageLabel(item) : "", locationFor(item)].filter(Boolean).map(function (value) { return '<span class="drawer-tag">' + escapeHtml(value) + '</span>'; }).join("");
    return '<div class="drawer-scroll"><div class="drawer-gallery"><div class="drawer-hero"><img id="drawer-main-image" src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(nameFor(item)) + '"></div>' + (images.length > 1 ? '<div class="drawer-thumbnails">' + thumbs + '</div>' : '') + '</div><div class="drawer-body"><div class="drawer-head"><h2 id="drawer-title">' + escapeHtml(nameFor(item)) + '</h2><strong>' + formatPrice(item.price) + '</strong></div><div class="drawer-tags">' + meta + '</div><p class="drawer-description">' + escapeHtml(description) + '</p><div class="seller-panel"><div class="seller-avatar"><i class="fa-solid fa-store" aria-hidden="true"></i></div><div><b>' + escapeHtml(sellerFor(item)) + '</b><span>Verified Pettify seller</span></div></div></div></div><div class="drawer-actions"><button class="drawer-buy" type="button" data-app-modal data-modal-context="cart"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>Buy now</button><button class="drawer-share" type="button" data-share-current aria-label="Share listing"><i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i></button></div>';
  }

  function openDrawer(id) {
    const item = state.all.find(function (entry) { return String(entry._id || entry.id) === String(id); }); if (!item) return;
    state.activeListing = item; els.drawerContent.innerHTML = drawerMarkup(item); els.drawer.classList.add("open"); els.drawerBackdrop.classList.add("open"); els.drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("overlay-open");
    els.drawerContent.querySelectorAll("img").forEach(function (image) { image.addEventListener("error", function () { image.src = "images/pettify.webp"; }, { once: true }); });
    els.drawerContent.querySelectorAll("[data-gallery-src]").forEach(function (thumb) { thumb.addEventListener("click", function () { const main = document.getElementById("drawer-main-image"); if (main) main.src = thumb.dataset.gallerySrc; els.drawerContent.querySelectorAll(".drawer-thumb").forEach(function (button) { button.classList.toggle("active", button === thumb); }); }); });
    const params = new URLSearchParams(location.search); params.set("pet", item._id || item.id); history.replaceState(null, "", location.pathname + "?" + params.toString()); document.getElementById("drawer-close").focus();
  }
  function closeDrawer() { els.drawer.classList.remove("open"); els.drawerBackdrop.classList.remove("open"); els.drawer.setAttribute("aria-hidden", "true"); state.activeListing = null; document.body.classList.remove("overlay-open"); const params = new URLSearchParams(location.search); params.delete("pet"); history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params.toString() : "")); }

  async function shareItem(item) {
    if (!item) return; const url = location.origin + location.pathname + "?pet=" + encodeURIComponent(item._id || item.id); const payload = { title: nameFor(item) + " on Pettify", text: "View this Pettify listing", url: url };
    try { if (navigator.share) await navigator.share(payload); else { await navigator.clipboard.writeText(url); } } catch (error) { if (error.name !== "AbortError") console.error(error); }
  }

  function openFilters() { els.panel.classList.add("open"); els.filterBackdrop.classList.add("open"); document.body.classList.add("overlay-open"); }
  function closeFilters() { els.panel.classList.remove("open"); els.filterBackdrop.classList.remove("open"); document.body.classList.remove("overlay-open"); }

  function openAppModal(context) {
    const modal = document.getElementById("app-download-modal"); const title = document.getElementById("app-modal-title"); const copy = document.getElementById("app-modal-description");
    const messages = { account: ["Your account lives in the app.", "Manage your profile, messages and purchases from one secure place."], cart: ["Buy securely in the Pettify app.", "Confirm availability, contact the seller and complete your purchase from the Pettify app."], vet: ["Book trusted vet care in the app.", "Find veterinary professionals, choose a convenient time and manage your appointment."] };
    const selected = messages[context] || messages.account; title.textContent = selected[0]; copy.textContent = selected[1]; modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("overlay-open"); modal.querySelector(".app-modal-card").focus();
  }
  function closeAppModal() { const modal = document.getElementById("app-download-modal"); modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); if (!els.drawer.classList.contains("open")) document.body.classList.remove("overlay-open"); }

  function wireHeader() {
    const siteSearch = document.getElementById("site-search");
    if (siteSearch) {
      siteSearch.addEventListener("submit", function (event) {
        event.preventDefault();
        const input = siteSearch.querySelector(".search-input");
        if (input) els.search.value = input.value;
        applyFilters();
        const market = document.querySelector(".marketplace");
        if (market) market.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  function wireEvents() {
    document.querySelectorAll("[data-category]").forEach(function (button) { button.addEventListener("click", function () { setCategory(button.dataset.category); }); });
    [els.search, els.min, els.max].forEach(function (input) { input.addEventListener("input", applyFilters); });
    initCustomSelect(els.locationSelect, 'location', applyFilters);
    initCustomSelect(els.sortSelect, 'sort', applyFilters);
    document.querySelectorAll('input[name="gender"]').forEach(function (input) { input.addEventListener("change", function () { if (input.checked) document.querySelectorAll('input[name="gender"]').forEach(function (other) { if (other !== input) other.checked = false; }); applyFilters(); }); });
    document.getElementById("clear-filters").addEventListener("click", resetFilters); document.getElementById("empty-reset").addEventListener("click", resetFilters); document.getElementById("retry-load").addEventListener("click", loadListings);
    els.grid.addEventListener("click", function (event) { const save = event.target.closest("[data-save-id]"); if (save) { event.stopPropagation(); save.classList.toggle("saved"); const icon = save.querySelector("i"); if (icon) { icon.classList.toggle("fa-regular", !save.classList.contains("saved")); icon.classList.toggle("fa-solid", save.classList.contains("saved")); } return; } const card = event.target.closest("[data-listing-id]"); if (card) openDrawer(card.dataset.listingId); });
    els.grid.addEventListener("keydown", function (event) { if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-listing-id]")) { event.preventDefault(); openDrawer(event.target.dataset.listingId); } });
    document.getElementById("drawer-close").addEventListener("click", closeDrawer); els.drawerBackdrop.addEventListener("click", closeDrawer);
    document.getElementById("filter-open").addEventListener("click", openFilters); document.getElementById("filter-close").addEventListener("click", closeFilters); document.getElementById("apply-mobile").addEventListener("click", closeFilters); els.filterBackdrop.addEventListener("click", closeFilters);
    document.addEventListener("click", function (event) { const trigger = event.target.closest("[data-app-modal]"); if (trigger) { event.preventDefault(); openAppModal(trigger.dataset.modalContext || "account"); } if (event.target.closest("[data-share-current]")) shareItem(state.activeListing); });
    document.querySelectorAll("[data-modal-close]").forEach(function (button) { button.addEventListener("click", closeAppModal); });
    document.addEventListener("keydown", function (event) { if (event.key !== "Escape") return; if (document.getElementById("app-download-modal").classList.contains("is-open")) closeAppModal(); else if (els.panel.classList.contains("open")) closeFilters(); else if (els.drawer.classList.contains("open")) closeDrawer(); });
  }

  async function loadListings() {
    els.loading.hidden = false; els.error.hidden = true; els.empty.hidden = true; els.grid.innerHTML = "";
    try {
      const response = await fetch(API_URL); if (!response.ok) throw new Error("Listings request failed"); const result = await response.json(); if (!result.success || !result.data) throw new Error("Unexpected listings response");
      state.all = Object.entries(result.data).flatMap(function (entry) {
        const category = entry[0]; const items = Array.isArray(entry[1]) ? entry[1] : [];
        return items.map(function (item) { return Object.assign({}, item, { category: category }); });
      }).filter(function (item) { return item && typeof item === "object" && available(item); }); populateFilters(); setCategory(state.category);
      const requested = new URLSearchParams(location.search).get("pet"); if (requested) openDrawer(requested);
    } catch (error) { console.error(error); els.loading.hidden = true; els.error.hidden = false; els.resultsCount.textContent = "Listings unavailable"; }
  }

  readUrlState(); wireHeader(); wireEvents(); loadListings();
})();
