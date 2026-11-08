/* Category page: hero, filters, sorting, grid. Uses window.SSK, window.UI and window.CAT (src/catalog/<slug>.json). */
(function () {
  const S = window.SSK, U = window.UI, C = window.CAT;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const slug = t => norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const eur = S.eur, PAGE = 24;
  // First-screen photos are copied next to the site (assets/thumbs, see scripts/fetch_thumbs.py); the rest come from the shop.
  const src = p => p.t ? '../' + p.t : p.i;
  const NAV = S.NAV.find(n => n.slug === C.slug) || { name: C.name, icon: 'ball', sub: '' };

  U.mount({ header: U.header(), footer: U.footer() });
  document.documentElement.classList.add('js');

  /* ---------- data ---------- */
  const P = C.products.map((p, k) => ({ ...p, k, s: p.s || [], key: norm(p.b + ' ' + p.n), off: p.w ? Math.round((1 - p.p / p.w) * 100) : 0 }));
  const subs = C.subs.map((s, i) => ({ ...s, i, slug: slug(s.name) }));
  const prices = P.map(p => p.p).filter(Boolean);
  const PMIN = Math.floor(Math.min(...prices, 0)), PMAX = Math.ceil(Math.max(...prices, 1));
  const brandsAll = [...new Set(P.map(p => p.b).filter(Boolean))];

  /* ---------- state, kept in the address so a filtered view can be shared ---------- */
  const st = { sub: -1, brands: new Set(), min: PMIN, max: PMAX, sale: false, q: '', sort: '', n: PAGE };
  function readURL() {
    const u = new URLSearchParams(location.search);
    const s = subs.find(x => x.slug === u.get('sub')); st.sub = s ? s.i : -1;
    st.brands = new Set((u.get('merk') || '').split(',').filter(b => brandsAll.includes(b)));
    st.min = Math.max(PMIN, +u.get('min') || PMIN); st.max = Math.min(PMAX, +u.get('max') || PMAX);
    st.sale = u.get('sale') === '1'; st.q = u.get('q') || ''; st.sort = u.get('sort') || ''; st.n = PAGE;
  }
  function writeURL() {
    const u = new URLSearchParams();
    if (st.sub >= 0) u.set('sub', subs[st.sub].slug);
    if (st.brands.size) u.set('merk', [...st.brands].join(','));
    if (st.min > PMIN) u.set('min', st.min);
    if (st.max < PMAX) u.set('max', st.max);
    if (st.sale) u.set('sale', '1');
    if (st.q) u.set('q', st.q);
    if (st.sort) u.set('sort', st.sort);
    const q = u.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
  }

  /* ---------- filtering ---------- */
  const match = (p, skip) => (skip === 'sub' || st.sub < 0 || p.s.includes(st.sub))
    && (skip === 'brand' || !st.brands.size || st.brands.has(p.b))
    && (skip === 'price' || (p.p >= st.min && p.p <= st.max))
    && (skip === 'sale' || !st.sale || p.w)
    && (!st.q || norm(st.q).split(/\s+/).every(w => p.key.includes(w)));
  const SORT = {
    'prijs-op': (a, b) => a.p - b.p, 'prijs-af': (a, b) => b.p - a.p,
    korting: (a, b) => b.off - a.off || a.k - b.k, naam: (a, b) => a.n.localeCompare(b.n, 'nl')
  };

  /* ---------- hero ---------- */
  document.title = C.name + ' · SSK Europe';
  $('#crumb').textContent = C.name;
  const title = $('#ch-title');
  title.innerHTML = C.name.split(' ').map((w, i) => `<span class="w"><span style="--wi:${i}">${esc(w)}</span></span>`).join(' ');
  title.classList.add('wsplit');
  if (!C.name.includes(' ')) title.classList.add('one');
  $('#ch-sub').textContent = NAV.sub || '';
  $('#ch-count').textContent = C.count + (C.count === 1 ? ' product' : ' producten');
  const topBrands = brandsAll.map(b => [b, P.filter(p => p.b === b).length]).sort((a, b) => b[1] - a[1]).slice(0, 4).map(x => x[0]);
  $('#ch-brands').textContent = topBrands.length ? topBrands.join(' · ') : '';
  if (subs.length > 10) {
    $('#ch-subs').innerHTML = `<label class="ch-pick"><span>Kies je vereniging</span><select id="club-pick" aria-label="Kies je vereniging"><option value="-1">Alle ${subs.length} verenigingen</option>${subs.map(s => `<option value="${s.i}">${esc(s.name)} (${s.n})</option>`).join('')}</select></label>`;
    $('#club-pick').addEventListener('change', e => { st.sub = +e.target.value; render(); $('#tb').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); });
  } else $('#ch-subs').innerHTML = subs.length ? subs.map(s => `<button type="button" data-sub="${s.i}"><span>${esc(s.name)}</span><small class="mono">${s.n}</small></button>`).join('') : '';
  // Three products float in the hero: the first three with a photo, or the biggest discounts on sale pages.
  const pool = (/korting|outlet/i.test(C.name) ? [...P].sort(SORT.korting) : P).filter(p => p.i);
  const seen = new Set(), showcase = [];
  // Prefer three different subcategories, so the hero shows the range of the category.
  for (const p of pool) { const k = p.s.length ? p.s[0] : p.b + p.k; if (!seen.has(k)) { seen.add(k); showcase.push(p); } if (showcase.length === 3) break; }
  for (const p of pool) { if (showcase.length === 3) break; if (!showcase.includes(p)) showcase.push(p); }
  $('#ch-vis').innerHTML = showcase.map((p, i) => `<img src="${src(p)}" alt="" class="f${i}" width="480" height="480" ${i ? '' : 'fetchpriority="high"'} onerror="this.remove()">`).join('');
  if (!showcase.length) $('.ch').classList.add('novis');

  /* ---------- toolbar + filter panel ---------- */
  const subChips = $('#tb-subs'), fSubs = $('#f-subs'), fBrands = $('#f-brands');
  if (subs.length) {
    subChips.innerHTML = `<button type="button" data-sub="-1">Alles <small class="mono">${C.count}</small></button>` + subs.map(s => `<button type="button" data-sub="${s.i}">${esc(s.name)} <small class="mono">${s.n}</small></button>`).join('');
    if (subs.length > 12) {
      fSubs.innerHTML = `<select id="sub-select" aria-label="Subcategorie"><option value="-1">Alle ${subs.length} subcategorieën</option>${subs.map(s => `<option value="${s.i}">${esc(s.name)} (${s.n})</option>`).join('')}</select>`;
      subChips.hidden = true;
    }
  } else { subChips.hidden = true; $('#f-subs-grp').hidden = true; }
  if (brandsAll.length < 2) $('#f-brands-grp').hidden = true;
  if (!P.some(p => p.w)) $('.f-toggle').hidden = true;
  const pmin = $('#pmin'), pmax = $('#pmax');
  [pmin, pmax].forEach(r => { r.min = PMIN; r.max = PMAX; r.step = PMAX - PMIN > 200 ? 5 : 1; });
  if (PMAX - PMIN < 2) $('#range').closest('.f-grp').hidden = true;
  if (NAV.name === 'Handschoenen' || NAV.name === 'Catcher') $('#f-extra').innerHTML = `<a class="f-cz" href="${S.CUSTOMIZER_URL}"><img src="${S.COLOURWAYS[0].img}" alt="" loading="lazy"><span><small>Glove Customizer</small><b>Liever je eigen handschoen?</b></span>${U.ui('arrow')}</a>`;

  function facets() {
    // Brand counts follow every other filter, so a number always tells what you will get.
    const base = P.filter(p => match(p, 'brand'));
    const cnt = {}; base.forEach(p => { if (p.b) cnt[p.b] = (cnt[p.b] || 0) + 1; });
    const list = brandsAll.map(b => [b, cnt[b] || 0]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    fBrands.innerHTML = list.map(([b, n]) => `<label class="f-check${n ? '' : ' zero'}"><input type="checkbox" value="${esc(b)}"${st.brands.has(b) ? ' checked' : ''}${n || st.brands.has(b) ? '' : ' disabled'}><span class="box" aria-hidden="true"></span><span class="t">${esc(b)}</span><small class="mono">${n}</small></label>`).join('');
    if (subs.length && subs.length <= 12) {
      const sb = P.filter(p => match(p, 'sub'));
      fSubs.innerHTML = [[-1, 'Alles', sb.length]].concat(subs.map(s => [s.i, s.name, sb.filter(p => p.s.includes(s.i)).length])).map(([i, n, c]) => `<label class="f-radio${c ? '' : ' zero'}"><input type="radio" name="sub" value="${i}"${st.sub === i ? ' checked' : ''}><span class="dot" aria-hidden="true"></span><span class="t">${esc(n)}</span><small class="mono">${c}</small></label>`).join('');
    } else if ($('#sub-select')) $('#sub-select').value = st.sub;
    if ($('#club-pick')) $('#club-pick').value = st.sub;
    $('#sale-n').textContent = '(' + P.filter(p => match(p, 'sale') && p.w).length + ')';
    $$('[data-sub]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.sub === st.sub));
    pmin.value = st.min; pmax.value = st.max; range();
    $('#sale').checked = st.sale; $('#q').value = st.q; $('#sort').value = st.sort;
  }
  function range() {
    const a = (st.min - PMIN) / (PMAX - PMIN || 1) * 100, b = (st.max - PMIN) / (PMAX - PMIN || 1) * 100;
    $('#range-fill').style.left = a + '%'; $('#range-fill').style.right = (100 - b) + '%';
    $('#pmin-v').textContent = eur(st.min).replace(',00', ''); $('#pmax-v').textContent = eur(st.max).replace(',00', '');
  }

  /* ---------- grid ---------- */
  const grid = $('#pgrid');
  function card(p, i) {
    const tag = p.d || (p.w ? 'Sale' : '');
    return `<a class="card pc pk" href="${esc(p.u)}" style="--i:${i % PAGE}">
      <div class="ph">${tag ? `<span class="badge b-sale">${esc(tag)}</span>` : ''}
        ${p.i ? `<img class="a" ${i < 8 ? `src="${src(p)}"${i < 4 ? ' fetchpriority="high"' : ''}` : `data-src="${src(p)}"`} alt="${esc(p.n)}" width="480" height="480" decoding="async" onload="this.parentNode.classList.add('ok')" onerror="if(this.dataset.fb!=='1'&&this.src!=='${p.i}'){this.dataset.fb='1';this.src='${p.i}'}else this.remove()">` : U.ic(NAV.icon)}
        ${p.j ? `<img class="b" data-src="${p.j}" alt="" aria-hidden="true">` : ''}</div>
      <div class="info"><span class="brand">${esc(p.b || ' ')}</span><span class="name">${esc(p.b && p.n.toLowerCase().startsWith(p.b.toLowerCase() + " ") ? p.n.slice(p.b.length + 1) : p.n)}</span>
      <span class="price${p.w ? ' sale' : ''}"><b>${eur(p.p)}</b>${p.w ? `<s>${eur(p.w)}</s>` : ''}</span></div></a>`;
  }
  let list = [];
  function render(keepN) {
    list = P.filter(p => match(p));
    if (SORT[st.sort]) list.sort(SORT[st.sort]);
    if (!keepN) st.n = PAGE;
    const shown = list.slice(0, st.n);
    grid.innerHTML = shown.map(card).join('');
    $('#empty').hidden = list.length > 0;
    $('#empty-shop').href = S.SHOP.search + encodeURIComponent(st.q || C.name);
    const more = list.length > shown.length;
    $('#more-wrap').hidden = !list.length;
    $('#more').hidden = !more;
    $('#more-txt').textContent = `${shown.length} van ${list.length}`;
    $('#more-fill').style.transform = `scaleX(${list.length ? shown.length / list.length : 0})`;
    $('#count').textContent = list.length + (list.length === 1 ? ' product' : ' producten');
    $('#apply').textContent = `Toon ${list.length} ${list.length === 1 ? 'product' : 'producten'}`;
    pills(); facets(); writeURL();
  }
  function appendMore() {
    const from = st.n; st.n += PAGE;
    grid.insertAdjacentHTML('beforeend', list.slice(from, st.n).map(card).join(''));
    $('#more').hidden = list.length <= st.n;
    $('#more-txt').textContent = `${Math.min(st.n, list.length)} van ${list.length}`;
    $('#more-fill').style.transform = `scaleX(${Math.min(1, st.n / list.length)})`;
  }
  $('#more').addEventListener('click', appendMore);
  // Photos past the first two rows wait until the page has loaded, then come in as they near the screen.
  let loaded = document.readyState === 'complete';
  const lazy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const im = e.target; im.src = im.dataset.src; im.removeAttribute('data-src'); lazy.unobserve(im); } }), { rootMargin: '600px 0px' });
  const watch = () => { if (loaded) $$('img.a[data-src]', grid).forEach(im => lazy.observe(im)); };
  addEventListener('load', () => { loaded = true; watch(); });
  new MutationObserver(watch).observe(grid, { childList: true });
  // Second photo on hover: load it only when the pointer gets there.
  grid.addEventListener('pointerover', e => { const b = e.target.closest('.pk')?.querySelector('img.b[data-src]'); if (b) { b.src = b.dataset.src; b.removeAttribute('data-src'); } });

  /* ---------- active filter pills ---------- */
  function pills() {
    const out = [];
    if (st.sub >= 0) out.push(['sub', subs[st.sub].name]);
    st.brands.forEach(b => out.push(['brand:' + b, b]));
    if (st.min > PMIN || st.max < PMAX) out.push(['price', eur(st.min).replace(',00', '') + ' – ' + eur(st.max).replace(',00', '')]);
    if (st.sale) out.push(['sale', 'Aanbiedingen']);
    if (st.q) out.push(['q', '“' + st.q + '”']);
    $('#pills').innerHTML = out.map(([k, t]) => `<button type="button" data-pill="${esc(k)}">${esc(t)}<span aria-hidden="true">×</span><span class="sr"> verwijderen</span></button>`).join('') + (out.length > 1 ? '<button type="button" class="all" data-pill="all">Wis alles</button>' : '');
    const n = out.length; $('#filter-n').hidden = !n; $('#filter-n').textContent = n;
  }
  function clearAll() { st.sub = -1; st.brands.clear(); st.min = PMIN; st.max = PMAX; st.sale = false; st.q = ''; render(); }
  $('#pills').addEventListener('click', e => {
    const k = e.target.closest('[data-pill]')?.dataset.pill; if (!k) return;
    if (k === 'all') return clearAll();
    if (k === 'sub') st.sub = -1; else if (k === 'price') { st.min = PMIN; st.max = PMAX; } else if (k === 'sale') st.sale = false;
    else if (k === 'q') st.q = ''; else if (k.startsWith('brand:')) st.brands.delete(k.slice(6));
    render();
  });
  $('#clear').addEventListener('click', clearAll); $('#empty-clear').addEventListener('click', clearAll);

  /* ---------- inputs ---------- */
  const toGrid = () => { const y = $('#tb').getBoundingClientRect().top + scrollY - 80; if (scrollY > y + 40) scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' }); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-sub]'); if (!b) return;
    const i = +b.dataset.sub; st.sub = st.sub === i && b.closest('#ch-subs') ? -1 : i; render();
    if (b.closest('#ch-subs')) $('#tb').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); else toGrid();
  });
  fSubs.addEventListener('change', e => { st.sub = +e.target.value; render(); });
  fBrands.addEventListener('change', e => { const v = e.target.value; e.target.checked ? st.brands.add(v) : st.brands.delete(v); render(); });
  $('#sale').addEventListener('change', e => { st.sale = e.target.checked; render(); });
  $('#sort').addEventListener('change', e => { st.sort = e.target.value; render(); });
  let qt; $('#q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim(); render(); }, 160); });
  let rt;
  [pmin, pmax].forEach(r => r.addEventListener('input', () => {
    let a = +pmin.value, b = +pmax.value;
    if (a > b) { if (r === pmin) a = b; else b = a; pmin.value = a; pmax.value = b; }
    st.min = a; st.max = b; range();
    clearTimeout(rt); rt = setTimeout(render, 120);
  }));
  // Grid density on large screens, remembered per visitor.
  const cols = n => { grid.classList.toggle('c3', n === 3); $$('[data-cols]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.cols === n)); try { localStorage.setItem('ssk-cols', n); } catch (e) {} };
  $$('[data-cols]').forEach(b => b.addEventListener('click', () => cols(+b.dataset.cols)));
  try { cols(+localStorage.getItem('ssk-cols') || 4); } catch (e) { cols(4); }

  /* ---------- filter drawer on small screens ---------- */
  const fp = $('#filters'), ob = $('#open-filters');
  const drawer = on => { fp.classList.toggle('open', on); document.body.classList.toggle('lock', on); ob.setAttribute('aria-expanded', on); if (on) $('#close-filters').focus(); else ob.focus(); };
  ob.addEventListener('click', () => drawer(true));
  $('#close-filters').addEventListener('click', () => drawer(false));
  $('#apply').addEventListener('click', () => { drawer(false); toGrid(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && fp.classList.contains('open')) drawer(false); });

  /* ---------- other categories, brands ---------- */
  $('#shop-link').href = C.shop;
  $('#others').innerHTML = U.chips(S.NAV.filter(n => n.slug !== C.slug).map(n => n.name));
  const brRow = hide => S.BRANDS.map(b => `<a href="${S.brandUrl(b)}"${hide ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Alles van ${b} in de webshop"`}><span>${b}</span><small>Bekijk ${U.ui('arrow')}</small></a><i></i>`).join('');
  $('#brands').innerHTML = `<div>${brRow(false)}</div><div>${brRow(true)}</div>`;
  const fbot = $('.ftr .bot');
  if (fbot) fbot.insertAdjacentHTML('beforebegin', '<div class="ftr-mark rv" aria-hidden="true"><span>SSK</span><span>Europe</span></div>');

  readURL(); render(true);

  /* ---------- motion ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));
  requestAnimationFrame(() => { document.body.classList.add('ready'); title.classList.add('in'); });
  if (fine && !RM) {
    document.addEventListener('pointermove', e => {
      const t = e.target.closest('.pc'); if (!t) return;
      const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
    const vis = $('#ch-vis'), ch = $('.ch');
    ch.addEventListener('pointermove', e => { const r = ch.getBoundingClientRect(); vis.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); vis.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
  }
  const bar = $('.sprog i'), hdr = $('.hdr'), top = $('#totop'), tb = $('#tb');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
    hdr.classList.toggle('scrolled', y > 40);
    // The toolbar and filter panel stick just under the header, whatever its height.
    document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px');
    top.classList.toggle('show', y > innerHeight * 1.5);
    tb.classList.toggle('stuck', tb.getBoundingClientRect().top <= (hdr.offsetHeight + 1));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));
})();
