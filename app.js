// Giottos African Store — storefront app (vanilla JS, multi-page)
(() => {
  'use strict';

  // ---------- Data ----------
  const CATEGORIES = ['All', 'Fresh', 'Pantry', 'Spices', 'Frozen', 'Drinks', 'Snacks'];

  const CAT_TILES = [
    { label: 'Fresh',  bg: 'linear-gradient(135deg,#6e8b4a,#3f5028)' },
    { label: 'Pantry', bg: 'linear-gradient(135deg,#e6a531,#b87c1b)' },
    { label: 'Spices', bg: 'linear-gradient(135deg,#c45a2c,#8a1a39)' },
    { label: 'Frozen', bg: 'linear-gradient(135deg,#4a6d8c,#2a3f55)' },
    { label: 'Drinks', bg: 'linear-gradient(135deg,#b8244c,#8a1a39)' },
    { label: 'Snacks', bg: 'linear-gradient(135deg,#e0457d,#b8244c)' },
  ];

  const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'Cameroon', 'Senegal', 'Ethiopia', 'South Africa', 'DRC', 'Uganda', "Côte d'Ivoire"];

  const PRODUCTS = [
    { id: 'p1',  name: 'Egusi seed, ground',       cat: 'Pantry', origin: 'Nigeria',  size: '500g',   price: 4.20, desc: 'Roasted and milled in-house every Tuesday.',           badge: 'New',   bg: 'linear-gradient(135deg,#e6a531,#c45a2c)' },
    { id: 'p2',  name: 'Fresh ugu leaves',         cat: 'Fresh',  origin: 'Nigeria',  size: 'bunch',  price: 2.80, desc: 'Off the Friday truck — best in two days.',            badge: 'Fresh', bg: 'linear-gradient(135deg,#6e8b4a,#3f5028)' },
    { id: 'p3',  name: 'Pure red palm oil',        cat: 'Pantry', origin: 'Ghana',    size: '1L',     price: 6.50, desc: 'Unrefined, cold-pressed, no additives.',               badge: null,    bg: 'linear-gradient(135deg,#b8244c,#8a1a39)' },
    { id: 'p4',  name: 'Garri Ijebu',              cat: 'Pantry', origin: 'Nigeria',  size: '1kg',    price: 3.20, desc: 'Fine-grain cassava flour, slightly sour.',             badge: null,    bg: 'linear-gradient(135deg,#f4ead8,#d9b89d)' },
    { id: 'p5',  name: 'Suya pepper blend',        cat: 'Spices', origin: 'Nigeria',  size: '100g',   price: 3.80, desc: 'Our own ground mix: peanut, ginger, chilli.',          badge: 'Sale',  bg: 'linear-gradient(135deg,#c45a2c,#8a1a39)' },
    { id: 'p6',  name: 'Plantain (ripe)',          cat: 'Fresh',  origin: 'Cameroon', size: '3-pack', price: 2.20, desc: 'Sweet for dodo, fry low and slow.',                    badge: null,    bg: 'linear-gradient(135deg,#e6a531,#b87c1b)' },
    { id: 'p7',  name: 'Cocoa powder',             cat: 'Pantry', origin: 'Ghana',    size: '250g',   price: 5.40, desc: 'Single-origin, lightly bittersweet.',                  badge: null,    bg: 'linear-gradient(135deg,#4a2618,#1f1a18)' },
    { id: 'p8',  name: 'Cassava leaves (frozen)',  cat: 'Frozen', origin: 'DRC',      size: '500g',   price: 4.80, desc: 'Pre-pounded, ready for saka saka.',                    badge: null,    bg: 'linear-gradient(135deg,#6e8b4a,#2a3f1c)' },
    { id: 'p9',  name: 'Hibiscus (zobo) petals',   cat: 'Drinks', origin: 'Senegal',  size: '250g',   price: 4.60, desc: 'For zobo, bissap, sorrel — steep with ginger.',        badge: null,    bg: 'linear-gradient(135deg,#b8244c,#4a2618)' },
    { id: 'p10', name: 'Chin chin',                cat: 'Snacks', origin: 'Nigeria',  size: '300g',   price: 3.40, desc: 'Crunchy fried dough — a tin of these never lasts.',    badge: 'New',   bg: 'linear-gradient(135deg,#e6a531,#c45a2c)' },
    { id: 'p11', name: 'Bottle gourd (calabash)',  cat: 'Fresh',  origin: 'Kenya',    size: 'each',   price: 4.20, desc: 'Whole, fresh — great in stews.',                       badge: null,    bg: 'linear-gradient(135deg,#6e8b4a,#4a6d8c)' },
    { id: 'p12', name: 'Berbere spice',            cat: 'Spices', origin: 'Ethiopia', size: '120g',   price: 4.90, desc: 'Warm, smoky — the soul of doro wat.',                  badge: null,    bg: 'linear-gradient(135deg,#c45a2c,#b8244c)' },
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
      return `
        <article class="gh-pcard" data-id="${p.id}">
          <div class="gh-pimg">
            <div class="gh-pimgBg" style="background:${p.bg}">
              <span class="gh-pimgLabel">${escapeHtml(p.name)}</span>
            </div>
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
      const email = ($('#cfEmail').value || '').trim();
      const message = ($('#cfMessage').value || '').trim();
      if (!name || !email || !message) {
        form.reportValidity();
        return;
      }
      const subject = `Enquiry from ${name}`;
      const body = `${message}\n\n—\nFrom: ${name} <${email}>`;
      const mailto = `mailto:hello@giottos.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
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

    bindContactForm();

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    applyCatFromUrl();
    renderCatBar();
    renderCatTiles();
    renderCountries();
    renderProducts();
    bind();
  });
})();
