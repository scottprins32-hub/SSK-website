/* Homepage version 2: content, interactions and motion. Uses window.SSK (data.js) and window.UI (ui.js). */
(function () {
  const S = window.SSK, U = window.UI, P = S.PRODUCTS;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const arrow = U.ui('arrow');

  U.mount({ header: U.header(), usp: U.usp(), club: U.club(), showroom: U.showroom(), footer: U.footer() });

  /* ---------- links ---------- */
  ['cz-main', 'cz-line', 'cz-end', 'm-cta'].forEach(id => { const a = document.getElementById(id); if (a) a.href = S.CUSTOMIZER_URL; });
  $('#all-gloves').href = U.nav('Handschoenen').url;

  /* ---------- hero: colourways from the customiser ---------- */
  const CW = S.COLOURWAYS;
  const gl = $('#gloves'), sw = $('#swatches'), hx = $('.hx');
  gl.innerHTML = CW.map((c, i) => `<img src="${c.img}" alt="SSK Pro Custom handschoen in ${c.name}, gemaakt in de customizer" width="845" height="1000"${i ? ' loading="lazy"' : ' fetchpriority="high"'} class="${i ? '' : 'on'}">`).join('');
  sw.innerHTML = CW.map((c, i) => `<button type="button" style="--a:${c.a};--b:${c.b}" aria-label="${c.name}" aria-pressed="${i === 0}" data-i="${i}"><i></i></button>`).join('');
  let cur = 0, timer = null;
  const imgs = $$('img', gl), btns = $$('button', sw);
  function show(i, user) {
    if (i === cur) return;
    const prev = cur; cur = (i + CW.length) % CW.length;
    imgs.forEach((im, k) => { im.classList.toggle('on', k === cur); im.classList.toggle('out', k === prev); });
    btns.forEach((b, k) => b.setAttribute('aria-pressed', k === cur));
    $('#cw-name').textContent = CW[cur].name;
    $('#cw-open').href = CW[cur].url;
    hx.style.setProperty('--accent', CW[cur].a === '#1A1A1A' ? CW[cur].b : CW[cur].a);
    if (user) restart();
  }
  function restart() {
    clearInterval(timer); sw.classList.remove('run'); void sw.offsetWidth;
    if (RM) return;
    sw.classList.add('run');
    timer = setInterval(() => show(cur + 1), 3600);
  }
  $('#cw-open').href = CW[0].url;
  hx.style.setProperty('--accent', CW[0].a);
  sw.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i, true); });
  sw.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1), true); btns[cur].focus();
  });
  const stage = $('#stage');
  stage.addEventListener('click', () => { location.href = CW[cur].url; });
  stage.title = 'Open deze handschoen in de customizer';
  // Pause the carousel while the visitor is looking at it.
  $('.hx-vis').addEventListener('pointerenter', () => { clearInterval(timer); sw.classList.remove('run'); });
  $('.hx-vis').addEventListener('pointerleave', restart);
  restart();
  // Tilt the glove towards the pointer.
  if (fine && !RM) {
    const tilt = $('#tilt');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    hx.addEventListener('pointermove', e => {
      const r = hx.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hx.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    function loop() {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      tilt.style.transform = `rotateY(${cx * 16}deg) rotateX(${-cy * 10}deg) translate3d(${cx * 18}px,${cy * 12}px,0)`;
      hx.style.setProperty('--gx', (50 + cx * 30) + '%'); hx.style.setProperty('--gy', (50 + cy * 30) + '%');
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0;
    }
  }

  /* ---------- marquee ---------- */
  const mqItems = ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Catcher', 'Slaghandschoenen', 'Clubkleding', 'Glove Customizer', 'Showroom Kwintsheul'];
  const mqRow = mqItems.map(t => `<span>${t}</span><i>✶</i>`).join('');
  $('#mq').innerHTML = `<div>${mqRow}</div><div>${mqRow}</div>`;
  const brRow = S.BRANDS.map(b => `<span>${b}</span><i></i>`).join('');
  $('#brands').innerHTML = `<div>${brRow}</div><div>${brRow}</div>`;

  /* ---------- categories: real product photos ---------- */
  const find = (list, w) => list.find(p => p.name.includes(w));
  const tiles = [
    ['Handschoenen', find(P.gloves, 'Fun Burst 2.0 11.5" Infield Glove Navy'), 'big', 'Veld, catcher, eerste honk'],
    ['Knuppels', P.bats[0], 'wide', 'BBCOR, USA, fastpitch, hout'],
    ['Ballen', P.balls[0], '', 'SSK GDN100 en meer'],
    ['Helmen', P.helmets[1], '', 'Rawlings RX2'],
    ['Catcher', find(P.more, 'Catcher'), '', 'Handschoenen en gear'],
    ['Slaghandschoenen', P.outlet[3], '', 'Grip aan de knuppel'],
    ['New Arrivals', find(P.gloves, 'REV1X 12.75'), '', 'Net binnen'],
    ['Outlet', P.outlet[1], 'sale', 'Tot 50% korting']
  ];
  $('#bento').innerHTML = tiles.map(([n, p, cls, sub], i) => {
    const c = U.nav(n);
    return `<a class="bt ${cls} rv" style="--i:${i % 4}" href="${c.url}">
      <span class="bt-img">${U.photo(p.photo, n, c.icon, p.remote)}</span>
      <span class="bt-tx"><small>${sub}</small><b>${n}</b></span><span class="bt-go">${arrow}</span></a>`;
  }).join('');
  const rest = S.NAV.filter(n => !tiles.some(t => t[0] === n.name));
  $('#morecats').innerHTML = U.chips(rest.map(n => n.name));

  /* ---------- glove rail ---------- */
  const rail = $('#rail');
  rail.innerHTML = '<div class="rail-pad"></div>' + P.gloves.concat(P.more).map(U.card).join('') + `<a class="card cz-card" href="${S.CUSTOMIZER_URL}"><img src="${CW[1].img}" alt="" loading="lazy"><b>Of ontwerp<br>je eigen</b><span class="btn btn-red sm">Start de customizer</span></a><div class="rail-pad"></div>`;
  const step = () => Math.min(rail.clientWidth * .8, 900);
  $$('[data-rail]').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: step() * b.dataset.rail, behavior: RM ? 'auto' : 'smooth' })));
  function railState() {
    const max = rail.scrollWidth - rail.clientWidth;
    const f = max > 0 ? rail.scrollLeft / max : 0;
    $('#railbar').style.transform = `scaleX(${.15 + f * .85})`;
    $$('[data-rail]').forEach(b => b.disabled = b.dataset.rail < 0 ? rail.scrollLeft < 4 : rail.scrollLeft > max - 4);
  }
  rail.addEventListener('scroll', railState, { passive: true }); addEventListener('resize', railState); railState();
  // Drag to scroll with a mouse. Touch keeps native scrolling.
  let drag = null;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button) return; drag = { x: e.clientX, l: rail.scrollLeft, moved: false }; });
  addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) { drag.moved = true; rail.classList.add('dragging'); }
    rail.scrollLeft = drag.l - dx;
  });
  addEventListener('pointerup', () => { if (!drag) return; setTimeout(() => rail.classList.remove('dragging'), 0); const m = drag.moved; drag = null; if (m) rail.addEventListener('click', ev => ev.preventDefault(), { once: true, capture: true }); });
  rail.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rail.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * 300, behavior: RM ? 'auto' : 'smooth' }); } });
  rail.addEventListener('dragstart', e => e.preventDefault());

  /* ---------- customiser walkthrough ---------- */
  const ST = S.CZ_STEPS;
  $('#czw-shots').innerHTML = ST.map((s, i) => `<img src="${s.img}" alt="Customizer, stap ${i + 1}: ${s.t}" width="1600" height="1000" loading="lazy" class="${i ? '' : 'on'}">`).join('');
  $('#czw-prog').innerHTML = ST.map(() => '<i></i>').join('');
  $('#czw-steps').innerHTML = ST.map((s, i) => `<li data-i="${i}"${i ? '' : ' class="on"'}>
      <span class="n">${String(i + 1).padStart(2, '0')}</span><div><h3>${s.t}</h3><p>${s.d}</p>
      <img class="m-shot" src="${s.img}" alt="Customizer, stap ${i + 1}: ${s.t}" loading="lazy" width="1600" height="1000"></div></li>`).join('');
  const shots = $$('#czw-shots img'), segs = $$('#czw-prog i'), lis = $$('#czw-steps li');
  function setStep(i) {
    shots.forEach((im, k) => im.classList.toggle('on', k === i));
    lis.forEach((li, k) => { li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
    segs.forEach((s, k) => s.classList.toggle('on', k <= i));
    $('#czw-n').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(ST.length).padStart(2, '0');
  }
  const stepIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setStep(+e.target.dataset.i); }), { rootMargin: '-45% 0px -45% 0px' });
  lis.forEach(li => { stepIO.observe(li); li.addEventListener('click', () => li.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' })); });

  /* ---------- tabs ---------- */
  const TABS = [
    ['Knuppels 2026', P.bats, 'Knuppels'], ['Helmen', P.helmets, 'Helmen'],
    ['Ballen', P.balls, 'Ballen'], ['Outlet', P.outlet, 'Outlet']
  ];
  const tl = $('#tabs'), tp = $('#tabpanel');
  tl.innerHTML = TABS.map(([t], i) => `<button role="tab" id="tab-${i}" aria-controls="tabpanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${t}${t === 'Outlet' ? '<sup>−50%</sup>' : ''}</button>`).join('') + '<span class="tab-ink" aria-hidden="true"></span>';
  const tbs = $$('[role=tab]', tl);
  function tab(i, focus) {
    tbs.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
    if (focus) tbs[i].focus();
    tp.setAttribute('aria-labelledby', 'tab-' + i);
    tp.innerHTML = U.grid(TABS[i][1]);
    $$('.pc', tp).forEach((c, k) => { c.style.setProperty('--i', k); c.classList.add('pop'); });
    $('#tab-all').href = U.nav(TABS[i][2]).url;
    $('#tab-all').firstChild.textContent = 'Alle ' + TABS[i][2].toLowerCase() + ' ';
    const ink = $('.tab-ink', tl), b = tbs[i];
    ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  tl.addEventListener('click', e => { const b = e.target.closest('[role=tab]'); if (b) tab(tbs.indexOf(b)); });
  tl.addEventListener('keydown', e => {
    const i = tbs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tbs.length - 1 }[e.key];
    if (n === undefined) return; e.preventDefault(); tab((n + tbs.length) % tbs.length, true);
  });
  tab(0);
  addEventListener('resize', () => { const i = tbs.findIndex(b => b.getAttribute('aria-selected') === 'true'); const ink = $('.tab-ink', tl); ink.style.width = tbs[i].offsetWidth + 'px'; ink.style.transform = `translateX(${tbs[i].offsetLeft}px)`; });

  /* ---------- reveal on scroll ---------- */
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .stitch-draw, .rail .pc').forEach(el => io.observe(el));
  // Count-ups in the hero stats.
  if (!RM) $$('[data-count]').forEach(el => {
    const to = +el.dataset.count; let t0 = 0; el.textContent = '0';
    const go = t => { t0 = t0 || t; const f = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - f, 3))); if (f < 1) requestAnimationFrame(go); };
    setTimeout(() => requestAnimationFrame(go), 900);
  });

  /* ---------- scroll: progress, header, heritage type, mobile CTA ---------- */
  const bar = $('.sprog i'), hdr = $('.hdr'), h1 = $('#h1'), h2 = $('#h2'), heri = $('.heri2'), mcta = $('#m-cta'), top = $('#totop');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
    hdr.classList.toggle('scrolled', y > 40);
    const pastHero = y > hx.offsetTop + hx.offsetHeight - 80;
    mcta.classList.toggle('show', pastHero && !nearEnd());
    top.classList.toggle('show', y > innerHeight * 1.5);
    if (!RM) {
      const r = heri.getBoundingClientRect(), f = (innerHeight - r.top) / (innerHeight + r.height);
      if (f > -0.1 && f < 1.1) { h1.style.transform = `translateX(${(-f * 22 + 6).toFixed(2)}%)`; h2.style.transform = `translateX(${(f * 22 - 14).toFixed(2)}%)`; }
    }
  }
  const ftr = $('.ftr');
  const nearEnd = () => ftr && ftr.getBoundingClientRect().top < innerHeight;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

  /* ---------- magnetic buttons ---------- */
  if (fine && !RM) $$('.mag').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  /* ---------- intro: title lines rise in ---------- */
  requestAnimationFrame(() => document.body.classList.add('ready'));
})();
