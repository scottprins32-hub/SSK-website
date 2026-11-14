/* Homepage version 2: content, interactions and motion. Uses window.SSK (data.js) and window.UI (ui.js). */
(function () {
  const S = window.SSK, U = window.UI, P = S.PRODUCTS;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const arrow = U.ui('arrow');

  window.SSK_DEFER = true;  // photos below the first screen wait for the load event (see UI.lazy)
  U.mount({ header: U.header(), club: U.club(), footer: U.footer2() });

  /* ---------- links ---------- */
  $('#cz-end').href = S.CUSTOMIZER_URL;
  $('#hx-new').href = U.nav('New Arrivals').url;
  $('#all-gloves').href = U.nav('Handschoenen').url;

  /* ---------- hero: new products from the shop ---------- */
  // Transparent cut-outs of the shop's own product photos live in assets/hero/<photo id>.webp.
  const HERO = [
    [P.gloves[0], '2410112359', '#C8102E'], [P.gloves[2], '2382787655', '#22B5A0'],
    [P.gloves[3], '2410122391', '#E0559A'], [P.bats[0], '2363268062', '#C8102E'],
    [P.helmets[1], '2382805112', '#C8102E'], [P.balls[0], '2417010101', '#2F4A9A']
  ].map(([p, id, accent]) => ({ p, accent, img: 'assets/hero/' + id + '.webp', th: (window.SSK_HEROTH || {})[id] || 'assets/hero/' + id + '-s.webp' }));
  const hi = $('#heroimgs'), th = $('#thumbs'), hx = $('.hx');
  // Only the first product photo loads with the page; the other five follow after the load event. The picker uses 96px copies that build.py puts in the page itself.
  hi.innerHTML = HERO.map((h, i) => `<img ${i ? 'data-wait data-src' : 'fetchpriority="high" src'}="${h.img}" alt="${h.p.brand} ${h.p.name}" width="600" height="600" class="${i ? '' : 'on'}">`).join('');
  th.innerHTML = HERO.map((h, i) => `<button type="button" aria-label="${h.p.brand} ${h.p.name}" aria-pressed="${i === 0}" data-i="${i}"><img src="${h.th}" alt="" width="96" height="96"><i></i></button>`).join('');
  const need = im => { if (im && im.dataset.src) { im.src = im.dataset.src; im.removeAttribute('data-src'); } };
  addEventListener('load', () => setTimeout(() => $$('img[data-src]', hi).forEach((im, k) => setTimeout(() => need(im), k * 250)), 400));
  let cur = -1, timer = null;
  const imgs = $$('img', hi), btns = $$('button', th);
  function show(i, user) {
    i = (i + HERO.length) % HERO.length;
    if (i === cur) return;
    const prev = cur; cur = i;
    need(imgs[cur]);
    imgs.forEach((im, k) => { im.classList.toggle('on', k === cur); im.classList.toggle('out', k === prev); });
    btns.forEach((b, k) => b.setAttribute('aria-pressed', k === cur));
    const p = HERO[cur].p;
    $('#hp-brand').textContent = (p.tag === 'Sale' ? 'Sale · ' : 'Nieuw binnen · ') + p.brand;
    $('#hp-name').textContent = p.name;
    $('#hp-price').innerHTML = S.eur(p.price) + (p.was ? ` <s>${S.eur(p.was)}</s>` : '');
    $('#hp-open').href = p.url;
    hx.style.setProperty('--accent', HERO[cur].accent);
    if (user) restart();
  }
  function restart() {
    clearInterval(timer); th.classList.remove('run'); void th.offsetWidth;
    if (RM) return;
    th.classList.add('run');
    timer = setInterval(() => show(cur + 1), 4000);
  }
  show(0);
  th.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i, true); });
  th.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); show(cur + (e.key === 'ArrowRight' ? 1 : -1), true); btns[cur].focus();
  });
  const stage = $('#stage');
  stage.addEventListener('click', () => { location.href = HERO[cur].p.url; });
  stage.title = 'Bekijk dit product in de webshop';
  // Pause the carousel while the visitor is looking at it.
  $('.hx-vis').addEventListener('pointerenter', () => { clearInterval(timer); th.classList.remove('run'); });
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

  /* ---------- positions: pick your spot on the field ---------- */
  // Counts, photos and links come from build.py (window.SSK_POS), so they follow the catalogue.
  const PD = window.SSK_POS || {};
  const GROUPS = {
    pitcher: ['Een gesloten web, zodat de slagman je grip niet ziet. Meestal 11,5 tot 12 inch.', 'pitcherhandschoenen'],
    catcher: ['Een mitt met extra vulling, gemaakt voor honderden worpen per wedstrijd. Meestal 32 tot 34 inch.', 'catchermitts', ['Complete catcheruitrusting', U.nav('Catcher').url]],
    first: ['Een lange, diepe mitt waarmee je lage en wijde aangooien opschept.', 'eerstehonkmitts'],
    infield: ['Kort en ondiep, zodat de bal snel van handschoen naar werphand gaat. Meestal 11 tot 11,75 inch.', 'infieldhandschoenen'],
    outfield: ['Lang en diep, voor hoge ballen en extra bereik. Meestal 12,5 tot 12,75 inch.', 'outfieldhandschoenen'],
    batter: ['Knuppel, slaghandschoenen en helm: alles voor aan slag.', 'knuppels', ['Slaghandschoenen', U.nav('Slaghandschoenen').url], ['Helmen', U.nav('Helmen').url]]
  };
  // number, name, short label, x and y on the 600 x 540 field, group
  const SPOTS = [['6', 'Korte stop', 'Korte stop', 238, 268, 'infield'], ['1', 'Pitcher', 'Pitcher', 300, 365, 'pitcher'], ['2', 'Catcher', 'Catcher', 300, 512, 'catcher'],
    ['3', 'Eerste honk', '1e honk', 428, 340, 'first'], ['4', 'Tweede honk', '2e honk', 362, 268, 'infield'], ['5', 'Derde honk', '3e honk', 172, 340, 'infield'],
    ['7', 'Linksveld', 'Links', 128, 170, 'outfield'], ['8', 'Midveld', 'Midden', 300, 105, 'outfield'], ['9', 'Rechtsveld', 'Rechts', 472, 170, 'outfield'], ['S', 'Slagman', 'Slag', 248, 470, 'batter']];
  const field = $('#pos-field'), pcard = $('#pos-card'), ball = $('#pos-ball'), thr = $('#pos-throw');
  field.insertAdjacentHTML('beforeend', SPOTS.map((s, i) => `<button type="button" class="spot" data-i="${i}" style="left:${(s[3] / 6).toFixed(2)}%;top:${(s[4] / 5.4).toFixed(2)}%;--i:${i}" aria-pressed="false" aria-label="${s[1]}"><b>${s[0]}</b><span>${s[2]}</span></button>`).join(''));
  const spots = $$('.spot', field);
  let spot = -1;
  function pick(i) {
    if (i === spot) return;
    spot = i;
    const s = SPOTS[i], g = GROUPS[s[5]], d = PD[s[5]] || { n: '', u: U.nav('Handschoenen').url };
    spots.forEach((b, j) => { b.setAttribute('aria-pressed', j === i); b.classList.toggle('mate', j !== i && SPOTS[j][5] === s[5]); });
    ball.style.transform = `translate(${s[3]}px,${s[4]}px)`;
    thr.setAttribute('x2', s[3]); thr.setAttribute('y2', s[4]);
    pcard.innerHTML = `<div class="pos-ph">${d.t ? `<img ${document.readyState === 'complete' ? 'src' : 'data-src'}="${d.t}" alt="" width="400" height="400">` : ''}</div>
      <div class="pos-tx"><span class="pos-no">${s[0] === 'S' ? 'Aan slag' : 'Positie ' + s[0]}</span><h3>${s[1]}</h3><p>${g[0]}</p>
        <a class="btn btn-red" href="${d.u}">Bekijk ${d.n} ${g[1]} ${arrow}</a>
        ${g.length > 2 ? `<div class="pos-more">${g.slice(2).map(([t, u]) => `<a href="${u}">${t} ${arrow}</a>`).join('')}</div>` : ''}</div>`;
    pcard.classList.remove('sw'); void pcard.offsetWidth; pcard.classList.add('sw');
  }
  pick(0);
  // The field plays through the positions on its own until someone touches it.
  const TOUR = [7, 3, 2, 1, 9, 0];  // midveld, eerste honk, catcher, pitcher, slagman, korte stop
  let tour = RM ? 0 : 1, tourT = 0, tourK = 0;
  const stopTour = () => { tour = 0; clearInterval(tourT); };
  field.addEventListener('click', e => { const b = e.target.closest('.spot'); if (b) { stopTour(); pick(+b.dataset.i); } });
  field.addEventListener('pointerover', e => { const b = e.target.closest('.spot'); if (b && e.pointerType === 'mouse') { stopTour(); pick(+b.dataset.i); } });
  field.addEventListener('focusin', e => { const b = e.target.closest('.spot'); if (b && b.matches(':focus-visible')) { stopTour(); pick(+b.dataset.i); } });
  pcard.addEventListener('pointerenter', stopTour); pcard.addEventListener('focusin', stopTour);
  if (tour) new IntersectionObserver(es => {
    clearInterval(tourT);
    if (tour && es[0].isIntersecting) tourT = setInterval(() => pick(TOUR[tourK++ % TOUR.length]), 3200);
  }, { threshold: .35 }).observe(field);

  /* ---------- outlet band ---------- */
  const DL = window.SSK_DEALS;
  if (DL && DL.items.length) {
    $('#deal-pct').textContent = '−' + DL.max + '%';
    $('#deal-title').innerHTML = `Tot <em><span data-n="${DL.max}">${DL.max}</span>%</em><br>korting.`;
    $('#deal-sub').textContent = `${DL.n} artikelen in de outlet, van handschoenen tot knuppels en catcheruitrusting.`;
    $('#deal-cta').href = U.nav('Outlet').url;
    $('#deal-grid').innerHTML = DL.items.map((p, i) => U.card({ url: p.u, photo: p.t, brand: p.b, name: p.n, price: p.p, was: p.w, tag: '−' + p.off + '%' }).replace('class="card', `style="--i:${i}" class="rv card`)).join('');
  } else $('#deal').remove();

  /* ---------- brand band ---------- */
  // Brand band: every name links to that brand in the shop. The second copy only makes the loop seamless.
  const brRow = hide => S.BRANDS.map(b => `<a href="${S.brandUrl(b)}"${hide ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Alles van ${b} in de webshop"`}><span>${b}</span><small>Bekijk ${U.ui('arrow')}</small></a><i></i>`).join('');
  $('#brands').innerHTML = `<div>${brRow(false)}</div><div>${brRow(true)}</div>`;

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
    ['Outlet', P.outlet[1], 'sale', `Tot ${(window.SSK_DEALS || { max: 50 }).max}% korting`]
  ];
  $('#bento').innerHTML = tiles.map(([n, p, cls, sub], i) => {
    const c = U.nav(n);
    return `<a class="bt ${cls} rv" style="--i:${i % 4}" href="${c.url}">
      <span class="bt-img">${U.photo(p.photo, n, c.icon, p.remote)}</span>
      <span class="bt-tx"><small>${sub}</small><b>${n}</b></span><span class="bt-go">${arrow}</span></a>`;
  }).join('');
  $('#rounds').innerHTML = U.rounds();
  // Custom gloves from the customiser: each one lifts when the pointer is over it (from the Clean concept).
  $('#czw-row').innerHTML = ['navy-columbia', 'cardinal', 'zalm-mint', 'zwart-goud', 'nederland', 'roze-wit', 'curacao'].map((k, i) => {
    const c = S.COLOURWAYS.find(x => x.key === k);
    return `<a href="${c.url}" style="--i:${i}" aria-label="Open de customizer met het ontwerp ${c.name}"><img data-src="${c.img.replace('.webp', '-s.webp')}" alt="" width="321" height="380"><span>${c.name}</span></a>`;
  }).join('');

  /* ---------- glove rail ---------- */
  const rail = $('#rail');
  rail.innerHTML = '<div class="rail-pad"></div>' + P.gloves.concat(P.more).map(U.card).join('') + `<a class="card cz-card" href="${S.CUSTOMIZER_URL}"><img data-src="${S.COLOURWAYS[1].img.replace('.webp', '-s.webp')}" alt=""><b>Of ontwerp<br>je eigen</b><span class="btn btn-red sm">Start de customizer</span></a><div class="rail-pad"></div>`;
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

  /* ---------- customiser: compact czStep viewer ---------- */
  const ST = S.CZ_STEPS;
  $('#czw-shots').innerHTML = ST.map((s, i) => `<img ${i ? 'data-wait ' : ''}data-src="${s.img}" alt="Customizer, stap ${i + 1}: ${s.t}" width="1600" height="1000" class="${i ? '' : 'on'}">`).join('') + `<span class="czw-try">Probeer het zelf ${arrow}</span>`;
  $('#czw-shots').href = S.CUSTOMIZER_URL;
  $('#czw-prog').innerHTML = ST.map(() => '<i></i>').join('');
  $('#czw-steps').innerHTML = ST.map((s, i) => `<li><button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}" title="${s.d}"><span class="n">${String(i + 1).padStart(2, '0')}</span>${s.t}</button></li>`).join('');
  const shots = $$('#czw-shots img'), segs = $$('#czw-prog i'), sbs = $$('#czw-steps button');
  let czStep = 0, stepTimer = null, stepVisible = false;
  function setStep(i) {
    czStep = (i + ST.length) % ST.length;
    if (stepVisible) [shots[czStep], shots[(czStep + 1) % ST.length]].forEach(need);  // each screenshot loads just before its turn
    shots.forEach((im, k) => im.classList.toggle('on', k === czStep));
    sbs.forEach((b, k) => b.setAttribute('aria-selected', k === czStep));
    segs.forEach((g, k) => g.classList.toggle('on', k <= czStep));
    $('#czw-n').textContent = String(czStep + 1).padStart(2, '0') + ' / ' + String(ST.length).padStart(2, '0');
  }
  const stepPlay = () => { clearInterval(stepTimer); if (!RM && stepVisible) stepTimer = setInterval(() => setStep(czStep + 1), 3200); };
  $('#czw-steps').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setStep(+b.dataset.i); stepPlay(); } });
  $('#czw-steps').addEventListener('keydown', e => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
    e.preventDefault(); setStep(czStep + d); sbs[czStep].focus(); stepPlay();
  });
  $('.czw-frame').addEventListener('pointerenter', () => clearInterval(stepTimer));
  $('.czw-frame').addEventListener('pointerleave', stepPlay);
  new IntersectionObserver(es => es.forEach(e => { stepVisible = e.isIntersecting; if (stepVisible) stepPlay(); else clearInterval(stepTimer); }), { threshold: .35 }).observe($('.czw'));

  /* ---------- tabs ---------- */
  const TABS = [
    ['Knuppels 2026', P.bats, 'Knuppels'], ['Helmen', P.helmets, 'Helmen'],
    ['Ballen', P.balls, 'Ballen'], ['Outlet', P.outlet, 'Outlet']
  ];
  const tl = $('#tabs'), tp = $('#tabpanel');
  tl.innerHTML = TABS.map(([t], i) => `<button role="tab" id="tab-${i}" aria-controls="tabpanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${t}${t === 'Outlet' ? `<sup>−${(window.SSK_DEALS || { max: 50 }).max}%</sup>` : ''}</button>`).join('') + '<span class="tab-ink" aria-hidden="true"></span>';
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

  /* ---------- headings rise in word by word ---------- */
  if (!RM) $$('.sec-h .d-lg, .czw-side .d-lg').forEach(h => {
    let k = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { f.append(t); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.textContent = t; i.style.setProperty('--wi', k++);
          w.append(i); f.append(w);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(h); h.classList.add('wsplit');
  });

  /* ---------- pointer spotlight on tiles and product cards ---------- */
  if (fine && !RM) document.addEventListener('pointermove', e => {
    const t = e.target.closest('.bt, .pc'); if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- footer wordmark ---------- */
  const fbot = $('.ftr .bot');
  if (fbot) fbot.insertAdjacentHTML('beforebegin', '<div class="ftr-mark rv" aria-hidden="true"><span>' + U.logo() + '</span><span>Europe</span></div>');

  /* ---------- reveal on scroll ---------- */
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .stitch-draw, .rail .pc').forEach(el => io.observe(el));
  const hxIn = $('.hx-in');
  // Count-ups in the hero stats.
  if (!RM) $$('[data-count]').forEach(el => {
    const to = +el.dataset.count; let t0 = 0; el.textContent = '0';
    const go = t => { t0 = t0 || t; const f = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - f, 3))); if (f < 1) requestAnimationFrame(go); };
    setTimeout(() => requestAnimationFrame(go), 900);
  });

  /* ---------- scroll: progress, header, heritage type, mobile CTA ---------- */
  const bar = $('.sprog i'), hdr = $('.hdr'), h1 = $('#h1'), h2 = $('#h2'), heri = $('.heri2'), top = $('#totop');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
    // The hero drifts up and fades as you scroll past it.
    if (!RM && hxIn) { const f = Math.min(1, y / (hx.offsetHeight || 1)); hxIn.style.transform = f > 0 ? `translateY(${(f * 90).toFixed(1)}px)` : ''; hxIn.style.opacity = (1 - f * .85).toFixed(3); }
    bar.style.transform = `scaleX(${H > 0 ? y / H : 0})`;
    hdr.classList.toggle('scrolled', y > 40);
    top.classList.toggle('show', y > innerHeight * 1.5);
    if (!RM) {
      const r = heri.getBoundingClientRect(), f = (innerHeight - r.top) / (innerHeight + r.height);
      if (f > -0.1 && f < 1.1) { const k = innerWidth < 700 ? .2 : 1;  // on a phone the words fill the screen, so they travel less and stay readable
        h1.style.transform = `translateX(${((-f * 22 + 6) * k).toFixed(2)}%)`; h2.style.transform = `translateX(${((f * 22 - 14) * k).toFixed(2)}%)`; }
    }
  }
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
