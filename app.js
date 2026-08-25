// Giottos African Store — storefront app (vanilla JS, multi-page)
(() => {
  "use strict";

  // ---------- Contact (assembled at runtime so the raw number never sits in the HTML) ----------
  const CONTACT = (() => {
    const cc = "44"; // UK country code
    const national = ["742", "323", "3050"].join(""); // 7423233050 (no leading 0)
    return {
      tel: "tel:+" + cc + national, // +447423233050
      wa: "https://wa.me/" + cc + national, // wa.me/447423233050
      display: "0" + national.slice(0, 4) + " " + national.slice(4), // 07423 233050
    };
  })();

  // ---------- Data ----------
  const CATEGORIES = [
    "All",
    "Fresh",
    "Pantry",
    "Spices",
    "Frozen",
    "Drinks",
    "Snacks",
  ];

  const CAT_TILES = [
    { label: "Fresh", bg: "url('assets/fresh.jpg') center/cover" },
    { label: "Pantry", bg: "url('assets/pantry.webp') center/cover" },
    { label: "Spices", bg: "url('assets/spices.avif') center/cover" },
    { label: "Frozen", bg: "url('assets/frozen.webp') center/cover" },
    { label: "Drinks", bg: "url('assets/drinks.jpg') center/cover" },
    { label: "Snacks", bg: "url('assets/snacks.webp') center/cover" },
  ];

  const COUNTRIES = [
    "Nigeria",
    "Ghana",
    "Kenya",
    "Cameroon",
    "Senegal",
    "Ethiopia",
    "South Africa",
    "DRC",
    "Uganda",
    "Côte d'Ivoire",
  ];

  // ---------- Data: products ----------
  // Supplied by products.js, which is generated from the Products tab of the
  // Giottos Inventory Google Sheet. To change a price, name or description,
  // edit the sheet. Never edit products.js, and never hardcode products here.
  const PRODUCTS = Array.isArray(window.__GIOTTOS_PRODUCTS)
    ? window.__GIOTTOS_PRODUCTS
    : [];

  if (!PRODUCTS.length) {
    // Better a loud console error than a shop page that looks simply empty.
    console.error("Giottos: products.js failed to load, the catalogue is empty.");
  }

  // ---------- Deals (hero slideshow) ----------
  const DEALS = [
    {
      name: "Blue Band margarine",
      sub: "500g · Save 20% this week",
      was: 5.99,
      now: 4.79,
      image: "assets/products/pantry/blue-band-margarine.webp",
    },
    {
      name: "Nestlé Milo",
      sub: "1.4kg · The family tin, discounted",
      was: 13.0,
      now: 11.0,
      image: "assets/products/drinks/nestle-milo.webp",
    },
    {
      name: "Golden Penny spaghetti",
      sub: "500g · Stock up and save",
      was: 1.5,
      now: 1.2,
      image: "assets/products/pantry/golden-penny-spaghetti.webp",
    },
  ];

  // ---------- State ----------
  const state = {
    query: "",
    activeCat: "All",
  };

  // ---------- Utils ----------
  const $ = (sel) => document.querySelector(sel);
  const fmtPrice = (n) => `£${n.toFixed(2)}`;
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Lower-case and strip accents so "cote" finds "Côte d'Ivoire".
  const normalise = (s) =>
    String(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Every whitespace-separated word must appear somewhere in the product,
  // so "milk peak" finds "Peak milk" just as well as "peak milk" does.
  const queryTokens = (q) => normalise(q).split(/\s+/).filter(Boolean);

  // Searchable text is built once per product and cached on it.
  function haystack(p) {
    if (!p._hay) {
      p._hay = normalise([p.name, p.cat, p.origin, p.size, p.desc].join(" "));
    }
    return p._hay;
  }

  const matches = (p, toks) => toks.every((t) => haystack(p).includes(t));

  // Wrap query hits in <mark>. Input is escaped first, so this stays safe.
  function highlight(text, toks) {
    let html = escapeHtml(text);
    if (!toks.length) return html;
    const re = new RegExp(`(${toks.map(escapeRe).join("|")})`, "gi");
    // Never mark inside an HTML entity such as &amp; or &#39;.
    return html.replace(/&[a-z#0-9]+;|[^&]+/gi, (chunk) =>
      chunk.charAt(0) === "&" ? chunk : chunk.replace(re, "<mark>$1</mark>"),
    );
  }

  // ---------- Category placeholder icons ----------
  // Used when a product has no photo yet, or when its photo fails to load,
  // so a card is never a bare block of text.
  const CAT_ICONS = {
    Fresh:
      '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    Pantry:
      '<path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z"/><path d="M6 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M9 13h6"/>',
    Spices:
      '<path d="M7 3h10l-1 5H8Z"/><path d="M8 8h8l1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z"/><path d="M11 5.5h.01M13 5.5h.01M12 6.8h.01"/>',
    Frozen:
      '<path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
    Drinks:
      '<path d="M6 3h12l-1.2 16a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9Z"/><path d="M6.5 9h11"/>',
    Snacks:
      '<path d="M4 9h16l-1.4 10a2 2 0 0 1-2 1.7H7.4a2 2 0 0 1-2-1.7Z"/><path d="m4 9 2.5-5h11L20 9"/><path d="M10 13v4M14 13v4"/>',
  };

  function placeholderMarkup(p) {
    const glyph = CAT_ICONS[p.cat] || CAT_ICONS.Pantry;
    return `<div class="gh-pimgPh" data-cat="${escapeHtml(p.cat)}" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${glyph}</svg>
        <span>${escapeHtml(p.cat)}</span>
      </div>`;
  }

  // ---------- Search / filter core ----------
  // Products matching the current query, ignoring the category filter.
  function queryMatches() {
    const toks = queryTokens(state.query);
    return toks.length ? PRODUCTS.filter((p) => matches(p, toks)) : PRODUCTS;
  }

  // How many of those sit in each category, so the bar can show live counts.
  function countsByCat(pool) {
    const counts = { All: pool.length };
    CATEGORIES.forEach((c) => {
      if (c !== "All") counts[c] = 0;
    });
    pool.forEach((p) => {
      if (counts[p.cat] != null) counts[p.cat] += 1;
    });
    return counts;
  }

  // ---------- Render: category bar (shop page) ----------
  function renderCatBar() {
    const bar = $("#catBar");
    if (!bar) return;
    const counts = countsByCat(queryMatches());
    // The strip scrolls sideways on mobile; keep the reader's place across
    // the rebuild that every keystroke triggers.
    const scrollLeft = bar.scrollLeft;
    bar.innerHTML = "";
    CATEGORIES.forEach((c) => {
      const n = counts[c] || 0;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "gh-catLink" +
        (state.activeCat === c ? " is-active" : "") +
        (n === 0 ? " is-empty" : "");
      btn.innerHTML = `${escapeHtml(c)}<span class="gh-catCount">${n}</span>`;
      btn.setAttribute(
        "aria-pressed",
        state.activeCat === c ? "true" : "false",
      );
      btn.title = n === 1 ? `${c}: 1 item` : `${c}: ${n} items`;
      btn.addEventListener("click", () => {
        setCat(c);
        scrollToProducts();
      });
      bar.appendChild(btn);
    });
    bar.scrollLeft = scrollLeft;
  }

  function setCat(c) {
    state.activeCat = c;
    render();
    syncUrl();
  }

  // ---------- Render: category tiles (home page — link to shop) ----------
  function renderCatTiles() {
    const grid = $("#catGrid");
    if (!grid) return;
    grid.innerHTML = "";
    CAT_TILES.forEach((c) => {
      const a = document.createElement("a");
      a.href = `shop.html?cat=${encodeURIComponent(c.label)}`;
      a.className = "gh-catTile";
      a.innerHTML = `<div class="gh-catCircle" style="background:${c.bg}"></div><span class="gh-catLabel">${escapeHtml(c.label)}</span>`;
      grid.appendChild(a);
    });
  }

  // ---------- Render: countries ----------
  function renderCountries() {
    const list = $("#countryList");
    if (!list) return;
    list.innerHTML = COUNTRIES.map(
      (c) => `<span class="gh-countryChip">${escapeHtml(c)}</span>`,
    ).join("");
  }

  // ---------- Render: product grid (shop page) ----------
  function renderProducts() {
    const grid = $("#prodGrid");
    if (!grid) return;
    const empty = $("#prodEmpty");
    const title = $("#prodTitle");
    const count = $("#prodCount");
    const inCat = state.activeCat && state.activeCat !== "All";
    if (title) title.textContent = inCat ? state.activeCat : "All products";

    const toks = queryTokens(state.query);
    const pool = queryMatches();
    const filtered = inCat
      ? pool.filter((p) => p.cat === state.activeCat)
      : pool;

    if (count) {
      count.textContent = toks.length
        ? `${filtered.length} ${filtered.length === 1 ? "match" : "matches"}`
        : `${filtered.length} in store now`;
    }

    if (filtered.length === 0) {
      grid.hidden = true;
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        // If the query does match elsewhere, offer a way out of the category
        // filter rather than leaving a dead end.
        if (toks.length && inCat && pool.length > 0) {
          empty.innerHTML = `<p>Nothing in <strong>${escapeHtml(state.activeCat)}</strong> matches "${escapeHtml(state.query.trim())}", but ${pool.length} ${pool.length === 1 ? "item matches" : "items match"} elsewhere.</p>
            <button type="button" class="gh-emptyBtn" id="emptyShowAll">Search all categories</button>`;
          const btn = $("#emptyShowAll");
          if (btn) btn.addEventListener("click", () => setCat("All"));
        } else if (toks.length) {
          empty.innerHTML = `<p>Nothing matches "${escapeHtml(state.query.trim())}". Try ${suggestionHtml()} — or ring us and we'll check the back.</p>
            <button type="button" class="gh-emptyBtn" id="emptyClear">Clear search</button>`;
          const btn = $("#emptyClear");
          if (btn) btn.addEventListener("click", clearSearch);
        } else {
          empty.innerHTML = `<p>Nothing in ${escapeHtml(state.activeCat)} on the shelves this week. Check back Friday, or give us a ring.</p>`;
        }
      }
      return;
    }

    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = filtered.map((p) => cardMarkup(p, toks)).join("");
    // A photo served straight from cache can finish before its onload runs,
    // which would leave the card faded out. Catch those here.
    grid.querySelectorAll(".gh-pimgPhoto").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add("is-loaded");
    });
  }

  function cardMarkup(p, toks) {
    const badgeCls =
      p.badge === "Sale" ? "is-sale" : p.badge === "Fresh" ? "is-fresh" : "";
    const badge = p.badge
      ? `<span class="gh-pBadge ${badgeCls}">${escapeHtml(p.badge)}</span>`
      : "";
    const alt = escapeHtml(`${p.name}, ${p.size}`);
    // Images load lazily and fall back to a branded category icon, so a slow
    // connection or a missing file never leaves an empty card.
    const visual = p.image
      ? `${placeholderMarkup(p)}<img class="gh-pimgPhoto" src="${escapeHtml(p.image)}" alt="${alt}" loading="lazy" decoding="async"
           onload="this.classList.add('is-loaded')"
           onerror="this.remove()" />`
      : placeholderMarkup(p);

    // Fixed prices read as a price; "Ask in-store" reads as a note, so nobody
    // mistakes a variable-weight item for a missing price.
    const price =
      p.price == null
        ? `<span class="gh-pPrice is-poa" title="Priced by weight or size on the day, just ask at the counter">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/></svg>
             Ask in-store</span>`
        : `<span class="gh-pPrice is-fixed">${fmtPrice(p.price)}</span>`;

    const on = list.has(p.id);
    const add = `<button type="button" class="gh-addBtn${on ? " is-added" : ""}" data-add="${p.id}" aria-pressed="${on}">
             <svg class="gh-addIconPlus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             <svg class="gh-addIconTick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
             <span class="gh-addBtnText">${on ? "On list" : "Add to list"}</span>
           </button>`;

    return `
        <article class="gh-pcard" data-id="${p.id}">
          <div class="gh-pimg">
            ${visual}
            ${badge}
          </div>
          <div class="gh-pBody">
            <div class="gh-pNameRow">
              <div class="gh-pName">${highlight(p.name, toks)}</div>
              <span class="gh-pSize">${escapeHtml(p.size)}</span>
            </div>
            <p class="gh-pDesc">${escapeHtml(p.desc)}</p>
            <div class="gh-pFoot">
              ${price}
              ${add}
            </div>
          </div>
        </article>`;
  }

  // Suggestions pulled from the live catalogue, so they always lead somewhere.
  function suggestionHtml() {
    const picks = ["milk", "thyme", "plantain", "milo"].filter((t) =>
      PRODUCTS.some((p) => haystack(p).includes(t)),
    );
    return picks
      .slice(0, 3)
      .map(
        (t) =>
          `<button type="button" class="gh-emptySuggest" data-q="${t}">${t}</button>`,
      )
      .join(" ");
  }

  // ---------- Scroll helper ----------
  function scrollToProducts() {
    const sec = $("#prodSection");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Read ?cat= / ?q= from URL (shop page) ----------
  function applyStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("cat");
    if (raw) {
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === raw.toLowerCase(),
      );
      if (match) state.activeCat = match;
    }
    const q = params.get("q");
    if (q) {
      state.query = q;
      const search = $("#search");
      if (search) search.value = q;
    }
  }

  // Keep the address bar in step so a filtered view can be shared or bookmarked.
  function syncUrl() {
    if (!$("#prodGrid")) return;
    const params = new URLSearchParams();
    if (state.activeCat && state.activeCat !== "All")
      params.set("cat", state.activeCat);
    const q = state.query.trim();
    if (q) params.set("q", q);
    const qs = params.toString();
    history.replaceState(
      null,
      "",
      qs ? `${location.pathname}?${qs}` : location.pathname,
    );
  }

  // ---------- Render both halves of the catalogue together ----------
  function render() {
    renderCatBar();
    renderProducts();
    const clear = $("#searchClear");
    if (clear) clear.hidden = !state.query.trim();
  }

  function setQuery(q) {
    state.query = q;
    render();
    syncUrl();
  }

  function clearSearch() {
    const search = $("#search");
    if (search) search.value = "";
    setQuery("");
    if (search) search.focus();
  }

  // ---------- Shopping list ----------
  // Held as { productId: qty } in localStorage, so a list survives a refresh
  // and is still there on the walk to Aylsham Road. Storage failures (private
  // browsing, full quota) are swallowed: the list still works for the session,
  // it just stops persisting.
  const LIST_KEY = "giottos.list.v1";

  const list = (() => {
    let items = {};
    try {
      const parsed = JSON.parse(localStorage.getItem(LIST_KEY) || "{}");
      if (parsed && typeof parsed === "object") {
        Object.keys(parsed).forEach((id) => {
          const n = Math.floor(Number(parsed[id]));
          // Drop anything we no longer stock, or the badge count would
          // outrun what the drawer can actually show.
          if (n > 0 && PRODUCTS.some((p) => p.id === id)) {
            items[id] = Math.min(n, 99);
          }
        });
      }
    } catch (e) {
      items = {};
    }

    const save = () => {
      try {
        localStorage.setItem(LIST_KEY, JSON.stringify(items));
      } catch (e) {
        /* session-only list */
      }
    };
    save(); // rewrite immediately so any pruned ids don't linger

    return {
      has: (id) => items[id] > 0,
      qty: (id) => items[id] || 0,
      ids: () => Object.keys(items),
      count: () => Object.keys(items).reduce((sum, id) => sum + items[id], 0),
      setQty(id, n) {
        const q = Math.max(0, Math.min(Math.floor(n) || 0, 99));
        if (q === 0) delete items[id];
        else items[id] = q;
        save();
      },
      toggle(id) {
        if (items[id]) delete items[id];
        else items[id] = 1;
        save();
      },
      clear() {
        items = {};
        save();
      },
    };
  })();

  // Stored ids resolved back to live products, newest addition last.
  function listEntries() {
    return list
      .ids()
      .map((id) => ({
        p: PRODUCTS.find((x) => x.id === id),
        qty: list.qty(id),
      }))
      .filter((e) => e.p);
  }

  // The message the customer sends. Prices are quoted as "from the website"
  // because several items are weighed at the counter and the rest are only
  // ever advertised as a reference.
  function listMessage() {
    const entries = listEntries();
    const lines = entries.map(
      ({ p, qty }) => `- ${p.name} (${p.size}) x${qty}`,
    );
    const priced = entries.filter((e) => e.p.price != null);
    const asking = entries.length - priced.length;
    const total = priced.reduce((sum, e) => sum + e.p.price * e.qty, 0);

    let msg = `Hi Giottos, please could you set these aside for me?\n\n${lines.join("\n")}`;
    if (priced.length) {
      msg += `\n\nRough total from the website: ${fmtPrice(total)}`;
      if (asking) {
        msg += `\n(${asking} item${asking === 1 ? "" : "s"} priced in store, so not counted.)`;
      }
    }
    return `${msg}\n\nThank you!`;
  }

  // ---------- List: drawer ----------
  let lastFocused = null;

  function mountList() {
    if ($("#listDrawer")) return;

    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "gh-listFab";
    fab.id = "listFab";
    fab.hidden = true;
    fab.setAttribute("aria-haspopup", "dialog");
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span class="gh-listFabText">My list</span>
      <span class="gh-listFabCount" id="listFabCount" aria-live="polite">0</span>`;

    const drawer = document.createElement("div");
    drawer.className = "gh-listDrawer";
    drawer.id = "listDrawer";
    drawer.hidden = true;
    drawer.innerHTML = `
      <div class="gh-listBackdrop" data-list-close></div>
      <aside class="gh-listPanel" role="dialog" aria-modal="true" aria-labelledby="listTitle">
        <header class="gh-listHead">
          <h2 class="gh-listTitle" id="listTitle">Your list</h2>
          <button type="button" class="gh-listClose" data-list-close aria-label="Close list">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>
        <p class="gh-listIntro">Nothing is bought or paid for here. Send us the list and we'll set it aside for you to collect.</p>
        <div class="gh-listBody" id="listBody"></div>
        <footer class="gh-listFoot" id="listFoot"></footer>
      </aside>`;

    document.body.appendChild(fab);
    document.body.appendChild(drawer);

    fab.addEventListener("click", openDrawer);
    drawer.addEventListener("click", (e) => {
      if (e.target.closest("[data-list-close]")) closeDrawer();
    });

    // Quantity steppers and removals inside the drawer.
    $("#listBody").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-step],[data-drop]");
      if (!btn) return;
      const id = btn.dataset.step || btn.dataset.drop;
      if (btn.dataset.drop) list.setQty(id, 0);
      else list.setQty(id, list.qty(id) + Number(btn.dataset.by));
      renderList();
      syncCardButtons();
    });

    $("#listFoot").addEventListener("click", (e) => {
      if (!e.target.closest("#listClear")) return;
      list.clear();
      renderList();
      syncCardButtons();
    });

    document.addEventListener("keydown", (e) => {
      if (drawer.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
      }
      if (e.key === "Tab") trapFocus(e, drawer);
    });
  }

  // Keep Tab inside the open drawer, so the page behind never steals focus.
  function trapFocus(e, root) {
    const focusable = root.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    const drawer = $("#listDrawer");
    if (!drawer) return;
    lastFocused = document.activeElement;
    // The burger menu is a fixed overlay too, so never leave both open.
    const burger = $("#burger");
    if (burger && burger.classList.contains("is-open")) burger.click();
    drawer.hidden = false;
    document.body.classList.add("gh-noScroll");
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      const close = drawer.querySelector(".gh-listClose");
      if (close) close.focus();
    });
  }

  function closeDrawer() {
    const drawer = $("#listDrawer");
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("gh-noScroll");
    const done = () => {
      drawer.hidden = true;
      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    };
    // Wait out the slide-off, but never hang if the transition never fires.
    const panel = drawer.querySelector(".gh-listPanel");
    let settled = false;
    const once = () => {
      if (settled) return;
      settled = true;
      done();
    };
    if (panel) panel.addEventListener("transitionend", once, { once: true });
    setTimeout(once, 320);
  }

  function renderList() {
    const n = list.count();
    const fab = $("#listFab");
    if (fab) {
      fab.hidden = n === 0;
      const badge = $("#listFabCount");
      if (badge) badge.textContent = String(n);
      fab.setAttribute("aria-label", `My list, ${n} item${n === 1 ? "" : "s"}`);
    }

    const body = $("#listBody");
    const foot = $("#listFoot");
    if (!body || !foot) return;

    const entries = listEntries();
    if (!entries.length) {
      body.innerHTML = `<p class="gh-listEmpty">Your list is empty. Browse the shop and add anything you'd like us to put by.</p>`;
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = `<ul class="gh-listItems">${entries
      .map(({ p, qty }) => {
        const who = escapeHtml(p.name);
        const thumb = p.image
          ? `<img src="${escapeHtml(p.image)}" alt="" loading="lazy" decoding="async" />`
          : placeholderMarkup(p);
        return `
        <li class="gh-listItem">
          <div class="gh-listThumb">${thumb}</div>
          <div class="gh-listInfo">
            <div class="gh-listName">${who}</div>
            <div class="gh-listMeta">${escapeHtml(p.size)} · ${
              p.price == null ? "Ask in-store" : fmtPrice(p.price)
            }</div>
          </div>
          <div class="gh-listQty">
            <button type="button" data-step="${p.id}" data-by="-1" aria-label="One fewer ${who}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="gh-listQtyNum">${qty}</span>
            <button type="button" data-step="${p.id}" data-by="1" aria-label="One more ${who}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <button type="button" class="gh-listDrop" data-drop="${p.id}" aria-label="Remove ${who} from list">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </li>`;
      })
      .join("")}</ul>`;

    const priced = entries.filter((e) => e.p.price != null);
    const asking = entries.length - priced.length;
    const total = priced.reduce((sum, e) => sum + e.p.price * e.qty, 0);

    foot.innerHTML = `
      ${
        priced.length
          ? `<div class="gh-listTotal"><span>Rough total</span><strong>${fmtPrice(total)}</strong></div>`
          : ""
      }
      ${
        asking
          ? `<p class="gh-listNote">${asking} item${asking === 1 ? " is" : "s are"} priced in store, so not counted above.</p>`
          : ""
      }
      <a class="gh-listSend" id="listSend" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05.18C5.5.18.16 5.51.16 12.07c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.42"/></svg>
        Send list on WhatsApp
      </a>
      <button type="button" class="gh-listClearBtn" id="listClear">Clear list</button>`;

    // Built at runtime so the shop's number never sits in the page source.
    const send = $("#listSend");
    if (send) {
      send.href = `${CONTACT.wa}?text=${encodeURIComponent(listMessage())}`;
    }
  }

  // Card buttons are refreshed in place rather than re-rendering the grid,
  // which would throw away the reader's scroll position mid-shop.
  function syncCardButtons() {
    document.querySelectorAll("[data-add]").forEach((btn) => {
      const on = list.has(btn.dataset.add);
      btn.classList.toggle("is-added", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      const label = btn.querySelector(".gh-addBtnText");
      if (label) label.textContent = on ? "On list" : "Add to list";
    });
  }

  // ---------- Contact form ----------
  function bindContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = ($("#cfName").value || "").trim();
      const message = ($("#cfMessage").value || "").trim();
      if (!name || !message) {
        form.reportValidity();
        return;
      }
      const text = `Hi Giottos, my name is ${name}.\n\n${message}`;
      const url = `${CONTACT.wa}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }

  // ---------- Render: deal slider (home page) ----------
  function initDealSlider() {
    const slider = $("#dealSlider");
    const dotsEl = $("#dealDots");
    if (!slider || !dotsEl || !DEALS.length) return;

    let current = 0;

    DEALS.forEach((deal, i) => {
      const slide = document.createElement("div");
      slide.className = "gh-dealSlide" + (i === 0 ? " is-active" : "");
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-label", `Deal ${i + 1} of ${DEALS.length}`);
      const slideVisual = deal.image
        ? `<div class="gh-dealSlideImg" style="background-image:url('${escapeHtml(deal.image)}')"></div>`
        : `<div class="gh-dealSlideImg" style="background:${deal.bg}"></div>`;
      slide.innerHTML = `
        ${slideVisual}
        <div class="gh-dealOverlay"></div>
        <div class="gh-dealContent">
          <span class="gh-dealBadge">★ This week's deal</span>
          <div class="gh-dealInfo">
            <div class="gh-dealName">${escapeHtml(deal.name)}</div>
            <div class="gh-dealPrices">
              <span class="gh-dealWas">${fmtPrice(deal.was)}</span>
              <span class="gh-dealNow">${fmtPrice(deal.now)}</span>
            </div>
            <span class="gh-dealSub">${escapeHtml(deal.sub)}</span>
          </div>
        </div>`;
      slider.insertBefore(slide, dotsEl);

      if (DEALS.length > 1) {
        const dot = document.createElement("button");
        dot.className = "gh-dealDot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", `Deal ${i + 1}`);
        dot.dataset.idx = i;
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
      }
    });

    const slides = slider.querySelectorAll(".gh-dealSlide");
    const dots = dotsEl.querySelectorAll(".gh-dealDot");

    function goTo(idx) {
      slides[current].classList.remove("is-active");
      if (dots[current]) dots[current].classList.remove("is-active");
      current = idx;
      slides[current].classList.add("is-active");
      if (dots[current]) dots[current].classList.add("is-active");
    }

    if (DEALS.length > 1) {
      setInterval(() => goTo((current + 1) % DEALS.length), 4000);
    }
  }

  // ---------- Bindings ----------
  function bind() {
    const search = $("#search");
    if (search) {
      // Re-render on the next frame so fast typing costs one paint, not ten.
      let frame = 0;
      search.addEventListener("input", (e) => {
        const value = e.target.value;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => setQuery(value));
      });
      search.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setQuery(search.value);
          search.blur();
        }
        if (e.key === "Escape" && search.value) {
          e.preventDefault();
          clearSearch();
        }
      });

      const clear = $("#searchClear");
      if (clear) clear.addEventListener("click", clearSearch);

      // "/" jumps to the search box the way it does in most catalogues.
      document.addEventListener("keydown", (e) => {
        const tag = (document.activeElement || {}).tagName;
        if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          search.focus();
          search.select();
        }
      });
    }

    // Suggested searches inside the empty state.
    const empty = $("#prodEmpty");
    if (empty) {
      empty.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-q]");
        if (!btn) return;
        if (search) search.value = btn.dataset.q;
        setQuery(btn.dataset.q);
      });
    }

    // Delegated from the grid, so the handler survives every search re-render.
    const grid = $("#prodGrid");
    if (grid) {
      grid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-add]");
        if (!btn) return;
        list.toggle(btn.dataset.add);
        renderList();
        syncCardButtons();
      });
    }

    hydrateContacts();
    bindContactForm();
    bindFab();
    bindBurgerMenu();
    mountList();

    const yr = $("#year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // ---------- Fill phone / WhatsApp links + visible number at runtime ----------
  function hydrateContacts() {
    document
      .querySelectorAll("[data-tel]")
      .forEach((el) => el.setAttribute("href", CONTACT.tel));
    document
      .querySelectorAll("[data-wa]")
      .forEach((el) => el.setAttribute("href", CONTACT.wa));
    document.querySelectorAll("[data-phone]").forEach((el) => {
      el.textContent = CONTACT.display;
    });
  }

  // ---------- Floating contact button ----------
  function bindFab() {
    const fab = $("#fab");
    const toggle = $("#fabToggle");
    if (!fab || !toggle) return;

    const close = () => {
      fab.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      fab.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      fab.classList.contains("is-open") ? close() : open();
    });
    // Close when tapping outside or pressing Escape
    document.addEventListener("click", (e) => {
      if (!fab.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // ---------- Hamburger menu (mobile) ----------
  function bindBurgerMenu() {
    const burger = $("#burger");
    const menu = $("#mobileMenu");
    if (!burger || !menu) return;

    const close = () => {
      burger.classList.remove("is-open");
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      burger.classList.add("is-open");
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
    };

    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      burger.classList.contains("is-open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", close);
    });
    document.addEventListener("click", (e) => {
      // The menu now spans the full viewport height, so a tap on its own
      // backdrop (not on a link) counts as "outside the nav content" too.
      if (e.target === menu) {
        close();
        return;
      }
      if (!menu.contains(e.target) && !burger.contains(e.target)) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    // Close on scroll so the menu never sits open (and blocking taps)
    // over content the user has scrolled to.
    window.addEventListener(
      "scroll",
      () => {
        if (burger.classList.contains("is-open")) close();
      },
      { passive: true },
    );
  }

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    applyStateFromUrl();
    renderCatTiles();
    renderCountries();
    initDealSlider();
    bind();
    // Last, so the clear button and counts reflect any ?cat= / ?q= in the URL.
    render();
    // The list badge is site-wide, so this runs on every page, not just the shop.
    renderList();
  });
})();
