// Giottos African Store — storefront app (vanilla JS, multi-page)
(() => {
  'use strict';

  // ---------- Contact (assembled at runtime so the raw number never sits in the HTML) ----------
  const CONTACT = (() => {
    const cc = '44';                          // UK country code
    const national = ['742', '323', '3050'].join(''); // 7423233050 (no leading 0)
    return {
      tel: 'tel:+' + cc + national,           // +447423233050
      wa: 'https://wa.me/' + cc + national,    // wa.me/447423233050
      display: '0' + national.slice(0, 4) + ' ' + national.slice(4), // 07423 233050
    };
  })();

  // ---------- Data ----------
  const CATEGORIES = ['All', 'Fresh', 'Pantry', 'Spices', 'Frozen', 'Drinks', 'Snacks'];

  const CAT_TILES = [
    { label: 'Fresh',  bg: "url('assets/fresh.jpg') center/cover" },
    { label: 'Pantry', bg: "url('assets/pantry.webp') center/cover" },
    { label: 'Spices', bg: "url('assets/spices.avif') center/cover" },
    { label: 'Frozen', bg: "url('assets/frozen.webp') center/cover" },
    { label: 'Drinks', bg: "url('assets/drinks.jpg') center/cover" },
    { label: 'Snacks', bg: "url('assets/snacks.webp') center/cover" },
  ];

  const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'Cameroon', 'Senegal', 'Ethiopia', 'South Africa', 'DRC', 'Uganda', "Côte d'Ivoire"];

  const PRODUCTS = [
    { id: 'p1',  name: 'Egusi seed, ground',       cat: 'Pantry', origin: 'Nigeria',  size: '500g',   price: 4.20, desc: 'Roasted and milled in-house every Tuesday.',           badge: 'New',   bg: 'linear-gradient(135deg,#e6a531,#c45a2c)' },
    { id: 'p2',  name: 'Fresh ugu leaves',         cat: 'Fresh',  origin: 'Nigeria',  size: 'bunch',  price: 2.80, desc: 'Off the Friday truck — best in two days.',            badge: 'Fresh', bg: 'linear-gradient(135deg,#6e8b4a,#3f5028)' },
    { id: 'p3',  name: 'Pure red palm oil',        cat: 'Pantry', origin: 'Ghana',    size: '1L',     price: 6.50, desc: 'Unrefined, cold-pressed, no additives.',               badge: null,    image: 'assets/products/palm-oil.webp' },
    { id: 'p4',  name: 'Garri Ijebu',              cat: 'Pantry', origin: 'Nigeria',  size: '1kg',    price: 3.20, desc: 'Fine-grain cassava flour, slightly sour.',             badge: null,    image: 'assets/products/garri.webp' },
    { id: 'p5',  name: 'Suya pepper blend',        cat: 'Spices', origin: 'Nigeria',  size: '100g',   price: 3.80, desc: 'Our own ground mix: peanut, ginger, chilli.',          badge: 'Sale',  bg: 'linear-gradient(135deg,#c45a2c,#8a1a39)' },
    { id: 'p6',  name: 'Plantain (ripe)',          cat: 'Fresh',  origin: 'Cameroon', size: '3-pack', price: 2.20, desc: 'Sweet for dodo, fry low and slow.',                    badge: null,    image: 'assets/products/ripe-plantain.webp' },
    { id: 'p7',  name: 'Cocoa powder',             cat: 'Pantry', origin: 'Ghana',    size: '250g',   price: 5.40, desc: 'Single-origin, lightly bittersweet.',                  badge: null,    bg: 'linear-gradient(135deg,#4a2618,#1f1a18)' },
    { id: 'p8',  name: 'Cassava leaves (frozen)',  cat: 'Frozen', origin: 'DRC',      size: '500g',   price: 4.80, desc: 'Pre-pounded, ready for saka saka.',                    badge: null,    bg: 'linear-gradient(135deg,#6e8b4a,#2a3f1c)' },
    { id: 'p9',  name: 'Hibiscus (zobo) petals',   cat: 'Drinks', origin: 'Senegal',  size: '250g',   price: 4.60, desc: 'For zobo, bissap, sorrel — steep with ginger.',        badge: null,    bg: 'linear-gradient(135deg,#b8244c,#4a2618)' },
    { id: 'p10', name: 'Chin chin',                cat: 'Snacks', origin: 'Nigeria',  size: '300g',   price: 3.40, desc: 'Crunchy fried dough — a tin of these never lasts.',    badge: 'New',   image: 'assets/products/chin-chin.webp' },
    { id: 'p11', name: 'Bottle gourd (calabash)',  cat: 'Fresh',  origin: 'Kenya',    size: 'each',   price: 4.20, desc: 'Whole, fresh — great in stews.',                       badge: null,    bg: 'linear-gradient(135deg,#6e8b4a,#4a6d8c)' },
    { id: 'p12', name: 'Berbere spice',            cat: 'Spices', origin: 'Ethiopia', size: '120g',   price: 4.90, desc: 'Warm, smoky — the soul of doro wat.',                  badge: null,    bg: 'linear-gradient(135deg,#c45a2c,#b8244c)' },
    { id: 'p13', name: 'Golden Sella basmati rice', cat: 'Pantry', origin: 'India',    size: '5kg',    price: 12.50, desc: 'Aged long-grain — fluffy, fragrant, the jollof staple.', badge: null,    image: 'assets/products/golden-sella-basmati-rice.webp' },
    { id: 'p14', name: 'Tilda pure basmati rice',   cat: 'Pantry', origin: 'India',    size: '5kg',    price: 14.00, desc: 'Classic Tilda — pure long-grain basmati, every grain separate.', badge: null, image: 'assets/products/tilda-basmati-rice.webp' },
    { id: 'p15', name: 'AAA Dragon jasmine rice',   cat: 'Pantry', origin: 'Thailand', size: '10kg',   price: 19.50, desc: 'Fragrant jasmine — soft, slightly sticky, an everyday staple.',  badge: null, image: 'assets/products/aaa-dragon-rice.webp' },
    { id: 'p16', name: 'Indomie chicken noodles',   cat: 'Pantry', origin: 'Nigeria',  size: '40-pack', price: 18.00, desc: 'The cult favourite — flies off the shelf on payday.',          badge: 'Hot', image: 'assets/products/indomie.webp' },
    { id: 'p17', name: 'Supermalt original',        cat: 'Drinks', origin: 'Denmark',  size: '24×330ml', price: 22.00, desc: 'Rich, malty, non-alcoholic — Sunday lunch in a bottle.',      badge: null, image: 'assets/products/supermalt-original.webp' },
    { id: 'p18', name: 'Fanta (African glass)',     cat: 'Drinks', origin: 'Nigeria',  size: '6×33cl', price: 7.20,  desc: 'Imported glass bottles — that proper sweet West-African Fanta.', badge: null, image: 'assets/products/african-fanta.webp' },
    { id: 'p19', name: 'Nestlé Milo',               cat: 'Drinks', origin: 'Ghana',    size: '500g',   price: 6.80,  desc: 'Chocolate-malt classic — hot or iced, breakfast or after school.', badge: null, image: 'assets/products/nestle-milo.webp' },
    { id: 'p20', name: 'Agege bread',               cat: 'Pantry', origin: 'Nigeria',  size: 'loaf',   price: 3.50, desc: 'Soft, slightly sweet Lagos-style loaf — eaten with ewa or akara.', badge: 'Fresh', image: 'assets/products/agege-bread.webp' },
    { id: 'p21', name: 'Scotch bonnet chillies',    cat: 'Fresh',  origin: 'Ghana',    size: '200g',   price: 2.40, desc: 'Fierce, fruity heat — the soul of jollof and pepper soup.',     badge: 'Fresh', image: 'assets/products/chillies.webp' },
    { id: 'p22', name: 'Frozen goat meat (bone-in)', cat: 'Frozen', origin: 'Nigeria', size: '1kg',    price: 11.50, desc: 'Cut for stew — bone gives the broth its depth.',               badge: null,    image: 'assets/products/goat-meat-bone-in.webp' },
    { id: 'p23', name: 'Frozen goat meat (boneless)', cat: 'Frozen', origin: 'Nigeria', size: '1kg',   price: 13.80, desc: 'Lean cubes — fast for suya, asun, or stir-fry.',               badge: null,    image: 'assets/products/goat-meat-boneless.webp' },
    { id: 'p24', name: 'Green plantain',            cat: 'Fresh',  origin: 'Cameroon', size: '3-pack', price: 2.20, desc: 'Firm and starchy — for boli, kelewele, or chips.',              badge: null,    image: 'assets/products/green-plantain.webp' },
    { id: 'p25', name: 'Puna yam',                  cat: 'Fresh',  origin: 'Ghana',    size: 'tuber',  price: 7.50, desc: 'Whole West-African yam — pound it, fry it, boil it.',           badge: null,    image: 'assets/products/yam.webp' },
    { id: 'p26', name: 'Cocoyam',                   cat: 'Fresh',  origin: 'Nigeria',  size: 'each',   price: 3.50, desc: 'Earthy and starchy — great in pepper soup or boiled as a side.',  badge: null,    image: 'assets/products/cocoyam.webp' },
    { id: 'p27', name: 'Frozen tilapia',            cat: 'Frozen', origin: 'Ghana',    size: '1kg',    price: 9.50, desc: 'Whole frozen fish — grill, fry, or go into a light stew.',        badge: null,    image: 'assets/products/frozen-fish.webp' },
    { id: 'p28', name: 'Frozen turkey',             cat: 'Frozen', origin: 'Nigeria',  size: '1kg',    price: 10.50, desc: 'Turkey cuts — peppersoup, stew, or jollof on a big cook day.',   badge: null,    image: 'assets/products/frozen-turkey.jpg' },
    { id: 'p29', name: 'Long bell pepper',          cat: 'Fresh',  origin: 'Ghana',    size: '200g',   price: 1.80, desc: 'Sweet and mild heat — roast into stew base or eat fresh.',        badge: 'Fresh', image: 'assets/products/long-bell-pepper.webp' },
    { id: 'p30', name: 'Fresh tomatoes',            cat: 'Fresh',  origin: 'Nigeria',  size: '500g',   price: 2.20, desc: 'Plum tomatoes off the Friday truck — the stew starts here.',      badge: 'Fresh', image: 'assets/products/tomatoes.webp' },
    { id: 'p31', name: 'JUMBO jollof rice seasoning', cat: 'Spices', origin: 'Nigeria', size: '100g',  price: 2.50, desc: 'All-in-one jollof spice blend — tomato, bay leaf, thyme.',          badge: null,    image: 'assets/products/jumbo-jollof-rice-seasoning.jpg' },
    { id: 'p32', name: 'Maggi seasoning cubes',     cat: 'Spices', origin: 'Nigeria',  size: '100-pack', price: 3.80, desc: 'The universal West-African kitchen staple — stock, stew, soup.', badge: null,    image: 'assets/products/maggi-seasoning.webp' },
  ];

  // ---------- Deals (hero slideshow) ----------
  const DEALS = [
    { name: 'Plantain (ripe)', sub: '3-pack · While stocks last', was: 2.20, now: 1.80, image: 'assets/products/ripe-plantain.webp' },
    { name: 'Cocoyam',         sub: 'each · 20% off this week',   was: 3.50, now: 2.80, image: 'assets/products/cocoyam.webp' },
    { name: 'Puna yam',        sub: 'whole tuber · 20% off',      was: 7.50, now: 6.00, image: 'assets/products/yam.webp' },
  ];

  // ---------- State ----------
  const state = {
    query: '',
    activeCat: 'All',
  };

  // ---------- Utils ----------
  const $ = (sel) => document.querySelector(sel);
  const fmtPrice = (n) => `£${n.toFixed(2)}`;
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  // ---------- Render: category bar (shop page) ----------
  function renderCatBar() {
    const bar = $('#catBar');
    if (!bar) return;
    bar.innerHTML = '';
    CATEGORIES.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gh-catLink' + (state.activeCat === c ? ' is-active' : '');
      btn.textContent = c;
      btn.addEventListener('click', () => {
        state.activeCat = c;
        renderCatBar();
        renderProducts();
        scrollToProducts();
      });
      bar.appendChild(btn);
    });
  }

  // ---------- Render: category tiles (home page — link to shop) ----------
  function renderCatTiles() {
    const grid = $('#catGrid');
    if (!grid) return;
    grid.innerHTML = '';
    CAT_TILES.forEach((c) => {
      const a = document.createElement('a');
      a.href = `shop.html?cat=${encodeURIComponent(c.label)}`;
      a.className = 'gh-catTile';
      a.innerHTML = `<div class="gh-catCircle" style="background:${c.bg}"></div><span class="gh-catLabel">${escapeHtml(c.label)}</span>`;
      grid.appendChild(a);
    });
  }

  // ---------- Render: countries ----------
  function renderCountries() {
    const list = $('#countryList');
    if (!list) return;
    list.innerHTML = COUNTRIES.map((c) => `<span class="gh-countryChip">${escapeHtml(c)}</span>`).join('');
  }

  // ---------- Render: product grid (shop page) ----------
  function renderProducts() {
    const grid = $('#prodGrid');
    if (!grid) return;
    const empty = $('#prodEmpty');
    const title = $('#prodTitle');
    if (title) title.textContent = (state.activeCat && state.activeCat !== 'All') ? state.activeCat : 'All products';

    const q = state.query.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (state.activeCat !== 'All' && p.cat !== state.activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      grid.hidden = true;
      grid.innerHTML = '';
      if (empty) {
        empty.hidden = false;
        empty.innerHTML = q
          ? `<p>Nothing matches "${escapeHtml(state.query)}". Try "egusi", "palm oil", or "ugu".</p>`
          : `<p>No products in this category just now — check back Friday.</p>`;
      }
      return;
    }

    if (empty) empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = filtered.map((p) => {
      const badgeCls = p.badge === 'Sale' ? 'is-sale' : p.badge === 'Fresh' ? 'is-fresh' : '';
      const badge = p.badge ? `<span class="gh-pBadge ${badgeCls}">${escapeHtml(p.badge)}</span>` : '';
      const visual = p.image
        ? `<div class="gh-pimgBg gh-pimgBg--photo" style="background-image:url('${p.image}')" role="img" aria-label="${escapeHtml(p.name)}"></div>`
        : `<div class="gh-pimgBg" style="background:${p.bg}"><span class="gh-pimgLabel">${escapeHtml(p.name)}</span></div>`;
      return `
        <article class="gh-pcard" data-id="${p.id}">
          <div class="gh-pimg">
            ${visual}
            ${badge}
          </div>
          <div class="gh-pBody">
            <div class="gh-pMeta">From ${escapeHtml(p.origin)} · ${escapeHtml(p.size)}</div>
            <div class="gh-pName">${escapeHtml(p.name)}</div>
            <p class="gh-pDesc">${escapeHtml(p.desc)}</p>
            <div class="gh-pFoot">
              <span class="gh-pPrice">${fmtPrice(p.price)}</span>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  // ---------- Scroll helper ----------
  function scrollToProducts() {
    const sec = $('#prodSection');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Read ?cat= from URL (shop page) ----------
  function applyCatFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('cat');
    if (!raw) return;
    const match = CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
    if (match) state.activeCat = match;
  }

  // ---------- Contact form ----------
  function bindContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = ($('#cfName').value || '').trim();
      const message = ($('#cfMessage').value || '').trim();
      if (!name || !message) {
        form.reportValidity();
        return;
      }
      const text = `Hi Giottos, my name is ${name}.\n\n${message}`;
      const url = `${CONTACT.wa}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  // ---------- Render: deal slider (home page) ----------
  function initDealSlider() {
    const slider = $('#dealSlider');
    const dotsEl = $('#dealDots');
    if (!slider || !dotsEl || !DEALS.length) return;

    let current = 0;

    DEALS.forEach((deal, i) => {
      const slide = document.createElement('div');
      slide.className = 'gh-dealSlide' + (i === 0 ? ' is-active' : '');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `Deal ${i + 1} of ${DEALS.length}`);
      slide.innerHTML = `
        <div class="gh-dealSlideImg" style="background-image:url('${escapeHtml(deal.image)}')"></div>
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
        const dot = document.createElement('button');
        dot.className = 'gh-dealDot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Deal ${i + 1}`);
        dot.dataset.idx = i;
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    });

    const slides = slider.querySelectorAll('.gh-dealSlide');
    const dots = dotsEl.querySelectorAll('.gh-dealDot');

    function goTo(idx) {
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = idx;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
    }

    if (DEALS.length > 1) {
      setInterval(() => goTo((current + 1) % DEALS.length), 4000);
    }
  }

  // ---------- Bindings ----------
  function bind() {
    const search = $('#search');
    if (search) {
      search.addEventListener('input', (e) => {
        state.query = e.target.value;
        renderProducts();
      });
    }

    hydrateContacts();
    bindContactForm();
    bindFab();

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // ---------- Fill phone / WhatsApp links + visible number at runtime ----------
  function hydrateContacts() {
    document.querySelectorAll('[data-tel]').forEach((el) => el.setAttribute('href', CONTACT.tel));
    document.querySelectorAll('[data-wa]').forEach((el) => el.setAttribute('href', CONTACT.wa));
    document.querySelectorAll('[data-phone]').forEach((el) => { el.textContent = CONTACT.display; });
  }

  // ---------- Floating contact button ----------
  function bindFab() {
    const fab = $('#fab');
    const toggle = $('#fabToggle');
    if (!fab || !toggle) return;

    const close = () => {
      fab.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      fab.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      fab.classList.contains('is-open') ? close() : open();
    });
    // Close when tapping outside or pressing Escape
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    applyCatFromUrl();
    renderCatBar();
    renderCatTiles();
    renderCountries();
    renderProducts();
    initDealSlider();
    bind();
  });
})();
