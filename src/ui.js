/* Shared render helpers for the five versions. Uses window.SSK from data.js. */
(function () {
  const S = window.SSK;
  const L = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    store: '<path d="M3 9 5 4h14l2 5M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v7h14v-7"/><path d="M10 20v-4h4v4"/>',
    pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shirt: '<path d="M8 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    fb: '<path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    half: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>'
  };
  const ui = (n, cls) => `<svg class="${cls || 'ui'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${L[n]}</svg>`;
  // Category / product line icons (64 grid) drawn at a ~1.75px stroke.
  const ic = n => S.icon(n).replace('stroke-width="2.2"', 'stroke-width="3"');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const CZ = S.CUSTOMIZER_URL;
  const nav = n => S.NAV.find(x => x.name === n);
  const MAIN = ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Catcher', 'Schoenen', 'Clubkleding', 'Outlet'];

  // Photo with labelled placeholder underneath; the placeholder shows if the photo is missing or fails.
  // Optional fallback: if the local copy fails, try the live shop, then show the placeholder.
  function photo(src, label, iconName, fallback) {
    const err = fallback ? `if(this.dataset.fb){this.src=this.dataset.fb;this.removeAttribute('data-fb')}else this.remove()` : 'this.remove()';
    return `<div class="phd">${ic(iconName || 'glove')}<span>${esc(label || 'Productfoto')}</span></div>` +
      (src ? `<img src="${src}"${fallback ? ` data-fb="${fallback}"` : ''} alt="${esc(label)}" loading="lazy" onerror="${err}">` : '');
  }

  function header(o) {
    o = o || {};
    const links = MAIN.map((n, i) => `<a href="${nav(n).url}"${i > 5 ? ' class="hide-md"' : ''}>${n}</a>`).join('');
    const mega = S.NAV.map(n => `<a href="${n.url}">${ic(n.icon)}<span><b>${n.name}</b><small>${n.sub}</small></span></a>`).join('');
    return `
    ${o.topbar === false ? '' : `<div class="topbar"><div class="wrap">
      <span>${ui('truck')} Op voorraad binnen 3–5 werkdagen in huis</span>
      <span>${ui('store')} Showroom in Kwintsheul</span>
      <span>${ui('shirt')} Clubkleding en bedrukken op maat</span></div></div>`}
    <header class="hdr${o.light ? ' light' : ''}">
      <div class="wrap bar">
        <button class="burger" aria-label="Menu" data-open="drawer">${ui('menu')}</button>
        <a class="logo" href="./" aria-label="SSK Europe, naar de homepage"><b>SSK</b><i>Europe</i></a>
        <form class="search" role="search" action="${S.BASE}/website/index.php" method="get" data-search>${ui('search')}<input type="hidden" name="Show" value="Search"><input type="search" name="KeyWord" placeholder="Zoek op product, merk of artikelnummer" aria-label="Zoeken in de webshop" autocomplete="off" required role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="sugg"><button type="submit" class="go" aria-label="Zoeken">${ui('arrow')}</button><div class="sugg" id="sugg" role="listbox" aria-label="Suggesties" hidden></div></form>
        <div class="theme" role="group" aria-label="Weergave">
          <button type="button" data-theme-set="licht" aria-label="Lichte weergave" title="Licht">${ui('sun')}</button>
          <button type="button" data-theme-set="std" aria-label="Standaard weergave" title="Standaard">${ui('half')}</button>
          <button type="button" data-theme-set="donker" aria-label="Donkere weergave" title="Donker">${ui('moon')}</button>
        </div>
        <nav class="acts" aria-label="Account">
          <a href="${S.SHOP.account}">${ui('user')}<span class="lbl">Account</span></a>
          <a href="${S.SHOP.cart}">${ui('cart')}<span class="lbl">Winkelwagen</span></a>
        </nav>
      </div>
      <nav class="nav" aria-label="Categorieën"><div class="wrap">
        <a href="#" class="all" data-open="mega">${ui('grid')} Alle categorieën</a>${links}
        <a class="cz" href="${CZ}">${ui('pen')}Glove Customizer</a>
      </div><div class="mega"><div class="wrap">${mega}</div></div></nav>
    </header>
    <div class="drawer"><div class="scrim" data-close></div><div class="dpanel">
      <header><a class="logo" href="./" style="color:var(--navy-900)"><b>SSK</b><i>Europe</i></a><button data-close aria-label="Sluiten">${ui('x')}</button></header>
      <a class="btn btn-red" href="${CZ}" style="width:100%;margin:4px 0 12px">Ontwerp je handschoen</a>
      ${S.NAV.map(n => `<a class="c" href="${n.url}">${ic(n.icon)}${n.name}</a>`).join('')}
    </div></div>`;
  }

  function card(p) {
    const sale = p.was > 0;
    const badge = p.tag ? `<span class="badge ${sale ? 'b-sale' : 'b-new'}">${p.tag}</span>` : '';
    return `<a class="card lift pc" href="${p.url}">
      <div class="ph">${badge}${photo(p.photo, 'Productfoto', p.icon, p.remote)}</div>
      <div class="info"><span class="brand">${p.brand}</span><span class="name">${esc(p.name)}</span>
      <span class="price${sale ? ' sale' : ''}"><b>${S.eur(p.price)}</b>${sale ? `<s>${S.eur(p.was)}</s>` : ''}</span></div></a>`;
  }
  const grid = (list, cols) => `<div class="grid${cols || 4}">${list.map(card).join('')}</div>`;

  function secHead(kick, title, linkTxt, href, sub) {
    return `<div class="sec-h"><div>${kick ? `<div class="kick">${kick}</div>` : ''}<h2 class="d-lg">${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
      ${linkTxt ? `<a class="link" href="${href}">${linkTxt} ${ui('arrow')}</a>` : ''}</div>`;
  }

  function cats(names, withAll) {
    const list = (names || S.NAV.map(n => n.name)).map(nav);
    return `<div class="cats">${list.map(n => `<a class="card lift cat" href="${n.url}">${ic(n.icon)}<b>${n.name}</b><small>${n.sub}</small></a>`).join('')}
      ${withAll ? `<a class="card lift cat all" href="#" data-open="mega">${ui('grid', 'ico')}<b>Alle ${S.NAV.length} categorieën</b><small>Van kleding tot scheidsrechter</small></a>` : ''}</div>`;
  }
  const chips = names => `<div class="chips">${(names || S.NAV.map(n => n.name)).map(nav).map(n => `<a class="chip" href="${n.url}">${ic(n.icon)}${n.name}</a>`).join('')}</div>`;

  function usp() {
    return `<div class="usp"><div class="wrap">
      <div>${ui('truck', 'ico')}<span><b>3–5 werkdagen</b><small>Levertijd voor artikelen op voorraad</small></span></div>
      <div>${ui('store', 'ico')}<span><b>Showroom Kwintsheul</b><small>Kom passen en voelen, di t/m za open</small></span></div>
      <div>${ui('shirt', 'ico')}<span><b>Clubkleding</b><small>Jerseys, caps en jassen voor je team</small></span></div>
      <div>${ui('pen', 'ico')}<span><b>Glove Customizer</b><small>Ontwerp je eigen handschoen</small></span></div>
    </div></div>`;
  }

  function customizer(o) {
    o = o || {};
    const g = S.PRODUCTS.gloves[0];
    return `<div class="cz-band" id="customizer">
      <div class="tx">
        <div class="kick" style="color:var(--tan-200)">Glove Customizer</div>
        <h2 class="d-lg">${o.title || 'Ontwerp je eigen handschoen'}</h2>
        <p>Kies je model, kleuren en details en maak een handschoen die helemaal van jou is.</p>
        <div class="steps"><span><i>1</i>Model</span><span><i>2</i>Kleuren</span><span><i>3</i>Details</span></div>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-red" href="${CZ}">Start de customizer</a><a class="btn btn-ghost" href="${nav('Handschoenen').url}">Bekijk handschoenen</a></div>
      </div>
      <div class="vis">${photo(o.img || S.CUSTOMIZER_IMG, 'De SSK Glove Customizer', 'glove')}</div>
    </div>`;
  }

  function club() {
    const L2 = S.LEAD.map(([a, b]) => `<li><span>${a}</span><span class="mono">${b}</span></li>`).join('');
    return `<div class="split">
      <div class="card panel"><div class="kick">Voor verenigingen</div><h2 class="d-md">Clubkleding en bedrukken</h2>
        <p>Wedstrijdjerseys, 3D-geborduurde caps, sublimatie en club- en studentenjassen. Met jullie logo, nummers en namen.</p>
        <ul>${L2}</ul>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-navy sm" href="${nav('Clubkleding').url}">Clubkleding bekijken</a><a class="btn btn-line sm" href="mailto:${S.CONTACT.email}?subject=${encodeURIComponent('Offerte clubkleding')}">Offerte aanvragen</a></div></div>
      <div class="card panel navy"><div class="kick">Hoofdklasse</div><h2 class="d-md">Holland Series 2026</h2>
        <p>Bekijk de collectie van de Hoofdklasse Holland Series 2026 in de webshop.</p>
        <a class="btn btn-red sm" href="${nav('Hoofdklasse Holland Series 2026').url}">Naar de collectie</a>
        <div style="margin-top:auto;padding-top:24px;border-top:1px solid var(--navy-700);width:100%"><div class="kick">Voorverkoop</div><p style="color:#fff;margin-top:6px">Voorverkoop aanbieding ballen 2027. Bestel nu voor het nieuwe seizoen.</p><a class="link" style="color:#fff;margin-top:12px" href="${S.PAGE['Voorverkoop Aanbieding Ballen 2027']}">Bekijk de aanbieding ${ui('arrow')}</a></div></div>
    </div>`;
  }

  const brands = () => `<div class="brands">${S.BRANDS.map(b => `<a href="${S.brandUrl(b)}" title="Alles van ${b} in de webshop">${b}</a>`).join('')}</div>`;

  // Open or closed right now, in Dutch time.
  function openNow() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Amsterdam', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = t => parts.find(x => x.type === t).value;
    const d = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
    const now = +get('hour') * 60 + +get('minute');
    const span = i => { const m = S.HOURS[i][1].match(/(\d+):(\d+)\D+(\d+):(\d+)/); return m ? [m[1] * 60 + +m[2], m[3] * 60 + +m[4], S.HOURS[i][1].split('–')] : null; };
    const t = span(d);
    if (t && now >= t[0] && now < t[1]) return { open: true, text: 'Nu open · tot ' + t[2][1].trim(), d };
    for (let k = 0; k < 7; k++) {
      const i = (d + k) % 7, x = span(i);
      if (x && (k > 0 || now < x[0])) return { open: false, text: 'Gesloten · opent ' + (k === 0 ? 'vandaag' : k === 1 ? 'morgen' : S.HOURS[i][0].toLowerCase()) + ' om ' + x[2][0].trim(), d };
    }
    return { open: false, text: 'Gesloten', d };
  }

  function showroom() {
    const o = openNow(), d = o.d;
    const h = S.HOURS.map(([a, b], i) => `<li class="${b === 'Gesloten' ? 'closed' : ''}${i === d ? ' today' : ''}"><span>${a}${i === d ? ' (vandaag)' : ''}</span><span class="mono">${b}</span></li>`).join('');
    const c = S.CONTACT;
    return `<div class="show">
      <div class="card"><div class="kick">Showroom</div><h2 class="d-md" style="margin-top:6px">Kom langs in Kwintsheul</h2>
        <p style="margin-top:8px">Handschoenen moet je passen. In de showroom van het ${c.name} vind je de complete collectie.</p>
        <span class="open-now${o.open ? ' yes' : ''}">${o.text}</span>
        <div class="addr"><a href="${S.SHOP.maps}" target="_blank" rel="noopener">${ui('pin')}${c.street}, ${c.city}</a><a href="tel:${c.phone.replace(/\s/g, '')}">${ui('phone')}${c.phone}</a><a href="mailto:${c.email}">${ui('mail')}${c.email}</a></div>
        <div class="btns"><a class="btn btn-navy sm" href="${S.SHOP.maps}" target="_blank" rel="noopener">Route plannen</a><a class="btn btn-line sm" href="tel:${c.phone.replace(/\s/g, '')}">Bel ons</a></div></div>
      <div class="card"><div class="kick">${ui('clock', 'ui')} Openingstijden</div><ul class="hours">${h}</ul></div>
      <div class="card"><div class="kick">Klantenservice</div><ul class="hours">${['Maten', 'Retour Zenden', 'Garantie', 'Welke Bal Koopt U?', 'Was Voorschrift', 'Levertijden'].map(t => `<li><a href="${S.PAGE[t]}">${t}</a><span class="ui" style="color:var(--g400)">${ui('arrow')}</span></li>`).join('')}</ul></div>
    </div>`;
  }

  function footer() {
    const c = S.CONTACT;
    const half = Math.ceil(S.PAGES.length / 2);
    const li = a => a.map(([p, u]) => `<li><a href="${S.BASE + u}">${p}</a></li>`).join('');
    return `<footer class="ftr"><div class="wrap">
      <div class="top">
        <div><a class="logo" href="./"><b>SSK</b><i>Europe</i></a><p style="max-width:32ch">${c.name}. Honkbal en softbal voor spelers, teams en verenigingen.</p>
          <div class="soc"><a href="${c.instagram}" aria-label="Instagram">${ui('ig')}</a><a href="${c.facebook}" aria-label="Facebook">${ui('fb')}</a></div></div>
        <div><h4>Klantenservice</h4><ul>${li(S.PAGES.slice(0, half))}</ul></div>
        <div><h4>Informatie</h4><ul>${li(S.PAGES.slice(half))}</ul></div>
        <div><h4>Openingstijden</h4><ul class="fh">${S.HOURS.map(([d, t]) => `<li><span>${d}</span><span>${t}</span></li>`).join('')}</ul></div>
        <div><h4>Contact</h4><ul><li>${c.street}</li><li>${c.city}</li><li><a href="tel:${c.phone.replace(/\s/g, '')}">${c.phone}</a></li><li><a href="mailto:${c.email}">${c.email}</a></li></ul></div>
      </div>
      <div class="bot"><span>© 2026 SSK Europe</span><span>${c.street}, ${c.city}</span></div>
    </div></footer>`;
  }

  // Wire up: menu, mega menu.
  // Light, standard and dark. The choice is kept per visitor; head.html applies it before the first paint.
  const THEMES = ['licht', 'std', 'donker'];
  const curTheme = () => document.documentElement.getAttribute('data-theme') || 'std';
  function markTheme() {
    const t = curTheme();
    document.querySelectorAll('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeSet === t));
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'licht' ? '#ffffff' : '#000000';
  }
  function setTheme(t, from) {
    const apply = () => {
      if (t === 'std') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('ssk-theme', t); } catch (e) {}
      markTheme();
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce || !from) return apply();
    // A circle grows out of the button that was pressed and reveals the new theme.
    const r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement; root.classList.add('theme-vt');
    const vt = document.startViewTransition(apply);
    vt.finished.finally(() => root.classList.remove('theme-vt'));
    vt.ready.then(() => {
      document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(() => {});
  }

  function wire() {
    markTheme();
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-theme-set]'); if (!b) return;
      // On phones only one button shows: it steps to the next theme.
      const t = getComputedStyle(b.parentNode).getPropertyValue('--cycle').trim() === '1' ? THEMES[(THEMES.indexOf(curTheme()) + 1) % 3] : b.dataset.themeSet;
      setTheme(t, b);
    });
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open],[data-close]');
      if (!t) { if (!e.target.closest('.mega')) document.querySelectorAll('.mega.open').forEach(m => m.classList.remove('open')); return; }
      if (t.dataset.open === 'drawer') document.querySelector('.drawer').classList.add('open');
      else if (t.dataset.open === 'mega') { e.preventDefault(); const m = document.querySelector('.mega'); if (window.innerWidth <= 900) document.querySelector('.drawer').classList.add('open'); else { m.classList.toggle('open'); if (m.classList.contains('open')) scrollTo({ top: 0 }); } }
      else if (t.hasAttribute('data-close')) document.querySelector('.drawer').classList.remove('open');
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelector('.drawer')?.classList.remove('open'); document.querySelector('.mega')?.classList.remove('open'); } });
  }
  // Instant search: products and categories from data.js as you type; Enter on free text searches the shop.
  function search() {
    const form = document.querySelector('[data-search]'); if (!form) return;
    const inp = form.querySelector('input[type=search]'), box = form.querySelector('.sugg');
    const seen = new Set(), items = [];
    Object.values(S.PRODUCTS).flat().forEach(p => { if (!seen.has(p.url)) { seen.add(p.url); items.push(p); } });
    const norm = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]+/g, ' ');
    const hay = items.map(p => norm(p.brand + ' ' + p.name));
    const POP = ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Outlet'];
    let opts = [], act = -1;
    const mark = (t, q) => { let h = esc(t); q.forEach(w => { if (w) h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return h; };
    function render() {
      const raw = inp.value.trim(), q = norm(raw).split(' ').filter(Boolean);
      let html = '';
      if (!q.length) {
        html = `<div class="sg-h">Populair</div><div class="sg-chips">${POP.map(n => `<a role="option" class="sg-chip" href="${nav(n).url}">${n}</a>`).join('')}</div>
          <div class="sg-h">Merken</div><div class="sg-chips">${S.BRANDS.map(b => `<a role="option" class="sg-chip" href="${S.brandUrl(b)}">${b}</a>`).join('')}</div>
          <a role="option" class="sg-cz" href="${CZ}">${ui('pen')}<span><b>Glove Customizer</b><small>Ontwerp je eigen handschoen</small></span></a>`;
      } else {
        const cats = S.NAV.filter(n => q.every(w => norm(n.name + ' ' + n.sub).includes(w))).slice(0, 3);
        const prods = items.filter((p, i) => q.every(w => hay[i].includes(w))).slice(0, 6);
        if (cats.length) html += `<div class="sg-h">Categorieën</div>` + cats.map(n => `<a role="option" class="sg-cat" href="${n.url}">${ic(n.icon)}<span>${mark(n.name, q)}</span></a>`).join('');
        if (prods.length) html += `<div class="sg-h">Producten</div>` + prods.map(p => `<a role="option" class="sg-p" href="${p.url}"><span class="sg-im">${p.photo ? `<img src="${p.photo}" alt="" loading="lazy" onerror="this.remove()">` : ic(p.icon)}</span><span class="sg-tx"><small>${p.brand}</small><b>${mark(p.name, q)}</b></span><span class="sg-pr${p.was ? ' sale' : ''}">${S.eur(p.price)}</span></a>`).join('');
        if (!cats.length && !prods.length) html += `<div class="sg-none">Geen directe treffers hier. De webshop zoekt verder.</div>`;
        html += `<a role="option" class="sg-all" href="${S.SHOP.search + encodeURIComponent(raw)}">${ui('search')}<span>Zoek “${esc(raw)}” in de hele webshop</span>${ui('arrow')}</a>`;
      }
      box.innerHTML = html;
      opts = [...box.querySelectorAll('[role=option]')];
      opts.forEach((o, i) => { o.id = 'sg-' + i; o.tabIndex = -1; });
      act = -1; inp.removeAttribute('aria-activedescendant');
      open(true);
    }
    function open(on) { box.hidden = !on; inp.setAttribute('aria-expanded', on); form.classList.toggle('open', on); }
    function move(d) {
      if (!opts.length) return;
      act = (act + d + opts.length) % opts.length;
      opts.forEach((o, i) => o.setAttribute('aria-selected', i === act));
      inp.setAttribute('aria-activedescendant', opts[act].id);
      opts[act].scrollIntoView({ block: 'nearest' });
    }
    inp.addEventListener('input', render);
    inp.addEventListener('focus', render);
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (box.hidden) render(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' && act >= 0) { e.preventDefault(); opts[act].click(); }
      else if (e.key === 'Escape') { e.preventDefault(); open(false); }
    });
    document.addEventListener('pointerdown', e => { if (!form.contains(e.target)) open(false); });
    form.addEventListener('focusout', () => setTimeout(() => { if (!form.contains(document.activeElement)) open(false); }, 0));
    // "/" focuses the search, like most shops.
    document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); inp.focus(); } });
  }
  function mount(map) { for (const k in map) document.querySelectorAll(`[data-ui="${k}"]`).forEach(el => el.outerHTML = map[k]); wire(); search(); }

  window.UI = { ui, ic, photo, header, card, grid, secHead, cats, chips, usp, customizer, club, brands, showroom, footer, mount, nav };
})();
