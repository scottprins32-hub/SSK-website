/* Motion shared by the homepage and the category pages (styles in src/perf.css).
   Everything here is decoration: the page works the same without it, and it stays off with "reduce motion". */
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---------- counters in the stats bar ---------- */
  const nums = $$('[data-n]');
  if (nums.length) {
    const run = el => {
      const to = +el.dataset.n, cell = el.parentNode;
      cell.classList.add('done');
      if (RM) { el.textContent = to; return; }
      let t0 = 0;
      const step = t => { t0 = t0 || t; const f = Math.min(1, (t - t0) / 1500); el.textContent = Math.round(to * (1 - Math.pow(2, -10 * f)) / (1 - Math.pow(2, -10))); if (f < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); run(e.target); } }), { threshold: .6 });
    nums.forEach(n => io.observe(n));
    $$('.stats .wrap>div').forEach(d => { if (!$('[data-n]', d)) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { d.classList.add('done'); o.disconnect(); } }), { threshold: .6 }).observe(d); });
  }
  if (RM) return;

  /* ---------- scroll: speed leans the marquees and big type, progress moves the hero ---------- */
  const lean = $$('.mq, .brandmq, .hx-ghost, .heri2-type');
  const loops = $$('.mq-in, .hx-ghost').map(el => (el.getAnimations ? el.getAnimations()[0] : null)).filter(Boolean);
  const hero = $('.hx') || $('.ch');
  let last = scrollY, vel = 0, raf = 0;
  function frame() {
    const y = scrollY, d = y - last; last = y;
    vel += (d - vel) * .18;
    const v = Math.max(-16, Math.min(16, vel * .45));
    lean.forEach(el => el.style.setProperty('--vel', v.toFixed(2)));
    const rate = 1 + Math.min(6, Math.abs(vel) / 7);
    loops.forEach(a => { a.playbackRate = rate; });
    if (hero) hero.style.setProperty('--sp', Math.max(0, Math.min(1, y / (hero.offsetHeight || 1))).toFixed(3));
    if (Math.abs(vel) > .05 || Math.abs(d) > 0) raf = requestAnimationFrame(frame);
    else { raf = 0; lean.forEach(el => el.style.setProperty('--vel', 0)); loops.forEach(a => { a.playbackRate = 1; }); }
  }
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });

  /* ---------- hero: a white stripe crosses the red slab each time the product changes ---------- */
  const name = $('#hp-name');
  if (name && hero) new MutationObserver(() => { hero.classList.remove('swap'); void hero.offsetWidth; hero.classList.add('swap'); }).observe(name, { childList: true, characterData: true, subtree: true });

  if (!fine) return;

  /* ---------- product cards tilt towards the pointer ---------- */
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.pc'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--tx', ((e.clientX - r.left) / r.width).toFixed(3));
    c.style.setProperty('--ty', ((e.clientY - r.top) / r.height).toFixed(3));
  }, { passive: true });

  /* ---------- pointer follower with a word: "Sleep" on the rail, "Shop" on tiles, "Bekijk" on the hero product ---------- */
  [['#rail', 'Sleep'], ['#stage', 'Bekijk'], ['#ch-vis', 'Shop']].forEach(([s, t]) => { const el = $(s); if (el) el.dataset.cur = t; });
  $$('.bt').forEach(el => { el.dataset.cur = 'Shop'; });
  const cur = document.createElement('div'); cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true'); document.body.appendChild(cur);
  let cx = 0, cy = 0, tx = 0, ty = 0, craf = 0, shown = false;
  const follow = () => {
    cx += (tx - cx) * .22; cy += (ty - cy) * .22;
    cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
    craf = shown || Math.abs(tx - cx) + Math.abs(ty - cy) > .5 ? requestAnimationFrame(follow) : 0;
  };
  document.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    const t = e.target.closest && e.target.closest('[data-cur]');
    if (t) { if (!shown) { cx = tx; cy = ty; } cur.textContent = t.dataset.cur; }
    shown = !!t; cur.classList.toggle('on', shown);
    if (shown && !craf) craf = requestAnimationFrame(follow);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { shown = false; cur.classList.remove('on'); });
  addEventListener('scroll', () => { if (shown) { shown = false; cur.classList.remove('on'); } }, { passive: true });
})();
