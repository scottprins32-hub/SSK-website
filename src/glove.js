/* SSK glove engine: renders a customisable glove as SVG and binds a customiser UI. */
(function () {
  const COLORS = [
    ['zwart', 'Zwart', '#1b1a19'], ['donkerbruin', 'Donkerbruin', '#4a2c1d'],
    ['bruin', 'Bruin', '#7a4a2a'], ['camel', 'Camel', '#a8723f'],
    ['tan', 'Tan', '#c9935b'], ['oranje', 'SSK Oranje', '#d8742a'],
    ['rood', 'Rood', '#b3222b'], ['bordeaux', 'Bordeaux', '#6b1a24'],
    ['navy', 'Navy', '#1d2947'], ['royal', 'Royal', '#2552a8'],
    ['groen', 'Groen', '#1f5a3b'], ['grijs', 'Grijs', '#80827f'],
    ['wit', 'Wit', '#eee8dc'], ['geel', 'Geel', '#e3ae27']
  ];
  const HEX = Object.fromEntries(COLORS.map(c => [c[0], c[2]]));
  const NAME = Object.fromEntries(COLORS.map(c => [c[0], c[1]]));
  const ZONES = [
    ['palm', 'Palm'], ['fingers', 'Vingers'], ['thumb', 'Duim'], ['web', 'Web'],
    ['binding', 'Rand'], ['laces', 'Veters'], ['stitch', 'Stiksel'], ['logo', 'Logo']
  ];
  const WEBS = [['I', 'I-Web'], ['H', 'H-Web'], ['basket', 'Basket'], ['trapeze', 'Trapeze']];
  const POSITIONS = [['infield', 'Infield', 0], ['outfield', 'Outfield', 20], ['pitcher', 'Pitcher', 0], ['first', 'Eerste honk', 30], ['catcher', 'Catcher', 40]];
  const SIZES = ['11.25"', '11.5"', '11.75"', '12"', '12.5"', '12.75"'];
  const DEFAULT = { palm: 'tan', fingers: 'zwart', thumb: 'zwart', web: 'tan', binding: 'zwart', laces: 'tan', stitch: 'rood', logo: 'rood', webType: 'I', hand: 'RHT', position: 'infield', size: '11.75"', text: '' };
  const PRESETS = {
    'Kwintsheul': { palm: 'oranje', fingers: 'zwart', thumb: 'zwart', web: 'oranje', binding: 'zwart', laces: 'oranje', stitch: 'wit', logo: 'zwart' },
    'Oranje Leeuw': { palm: 'oranje', fingers: 'oranje', thumb: 'wit', web: 'oranje', binding: 'wit', laces: 'oranje', stitch: 'navy', logo: 'navy' },
    'Hoofdklasse': { palm: 'camel', fingers: 'navy', thumb: 'navy', web: 'camel', binding: 'rood', laces: 'camel', stitch: 'rood', logo: 'rood' },
    'Classic Tan': { palm: 'tan', fingers: 'tan', thumb: 'tan', web: 'tan', binding: 'donkerbruin', laces: 'donkerbruin', stitch: 'donkerbruin', logo: 'donkerbruin' },
    'Blackout': { palm: 'zwart', fingers: 'zwart', thumb: 'zwart', web: 'zwart', binding: 'zwart', laces: 'zwart', stitch: 'grijs', logo: 'rood' },
    'Royal Ice': { palm: 'wit', fingers: 'royal', thumb: 'royal', web: 'wit', binding: 'royal', laces: 'wit', stitch: 'wit', logo: 'wit' }
  };

  // Geometry (viewBox 0 0 420 540). Fingers are rounded rects rotated about their base.
  const FINGERS = [
    { x: 144, y: 66, w: 56, h: 212, r: -9 },
    { x: 196, y: 40, w: 58, h: 228, r: -2 },
    { x: 250, y: 54, w: 56, h: 216, r: 5 },
    { x: 300, y: 96, w: 52, h: 184, r: 12 }
  ];
  const THUMB = { x: 118, y: 196, w: 60, h: 200, r: -36 };
  const PALM = 'M128 236 Q150 222 200 226 L330 232 Q364 240 366 284 Q368 360 350 412 Q326 488 238 496 Q152 494 122 430 Q98 372 104 300 Q108 252 128 236 Z';
  const WEB = 'M44 226 Q62 142 148 80 L170 110 Q168 190 166 262 Q140 280 126 304 Q84 276 44 226 Z';

  function rot(f) { return `rotate(${f.r} ${f.x + f.w / 2} ${f.y + f.h})`; }
  function rect(f, inset, attrs) {
    const i = inset || 0;
    return `<rect x="${f.x + i}" y="${f.y + i}" width="${f.w - 2 * i}" height="${f.h - 2 * i}" rx="${f.w / 2 - i}" transform="${rot(f)}" ${attrs || ''}/>`;
  }
  function lum(hex) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  let uid = 0;

  function webPattern(type, c, lace) {
    if (type === 'I') return `<g fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.2">
        <rect x="104" y="96" width="28" height="200" rx="6" transform="rotate(-24 118 196)"/>
        <rect x="60" y="150" width="120" height="22" rx="6" transform="rotate(-38 120 161)"/>
        <rect x="66" y="212" width="120" height="22" rx="6" transform="rotate(-38 126 223)"/></g>
        <g stroke="${lace}" stroke-width="4" stroke-linecap="round" stroke-dasharray="7 9" fill="none">
        <path d="M80 200 L160 120"/><path d="M92 250 L168 180"/></g>`;
    if (type === 'H') return `<g fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.2">
        <rect x="76" y="140" width="24" height="150" rx="6" transform="rotate(-30 88 215)"/>
        <rect x="138" y="96" width="24" height="170" rx="6" transform="rotate(-12 150 181)"/>
        <rect x="70" y="176" width="110" height="24" rx="6" transform="rotate(-34 125 188)"/></g>
        <g stroke="${lace}" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 8" fill="none">
        <path d="M100 150 L150 110"/><path d="M110 250 L166 214"/></g>`;
    if (type === 'basket') {
      let s = `<g fill="${c}" stroke="rgba(0,0,0,.4)" stroke-width="1">`;
      for (let i = 0; i < 6; i++) s += `<rect x="${40 + i * 24}" y="70" width="17" height="250" rx="4" transform="rotate(-28 120 195)"/>`;
      s += `</g><g stroke="${lace}" stroke-width="5" fill="none" stroke-linecap="round">`;
      for (let i = 0; i < 6; i++) s += `<path d="M30 ${120 + i * 30} L210 ${60 + i * 30}" stroke-dasharray="12 12" stroke-dashoffset="${i % 2 ? 12 : 0}"/>`;
      return s + '</g>';
    }
    return `<path d="${WEB}" fill="${c}" transform="translate(118 190) scale(.82) translate(-118 -190)" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>
      <g stroke="${lace}" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-dasharray="6 9">
      <path d="M78 186 Q104 146 152 110"/><path d="M96 234 Q130 196 166 172"/><path d="M118 280 Q140 250 168 236"/></g>`;
  }

  function svg(state, opts) {
    const s = Object.assign({}, DEFAULT, state);
    const o = opts || {};
    const id = 'g' + (++uid);
    const C = k => HEX[s[k]] || s[k];
    const lhs = s.hand === 'LHT';
    const flip = lhs ? 'transform="translate(420 0) scale(-1 1)"' : '';
    const unflip = (x, y) => lhs ? `transform="translate(${x} ${y}) scale(-1 1) translate(${-x} ${-y})"` : '';
    const all = FINGERS.map(f => rect(f)).join('') + rect(THUMB) + `<path d="${PALM}"/><path d="${WEB}"/>`;
    const logoTxt = lum(C('logo')) > 0.55 ? '#1b1a19' : '#ffffff';
    const label = (s.text || '').toUpperCase().slice(0, 12);

    return `<svg viewBox="0 0 420 540" xmlns="http://www.w3.org/2000/svg" class="glove-svg" style="pointer-events:none" role="img" aria-label="Handschoen ontwerp">
<defs>
  <linearGradient id="${id}sh" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".35" stop-color="#fff" stop-opacity=".16"/>
    <stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
  <radialGradient id="${id}pk" cx=".5" cy=".42" r=".55">
    <stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".55" stop-color="#000" stop-opacity=".08"/>
    <stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
  <radialGradient id="${id}hl" cx=".35" cy=".25" r=".7">
    <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <filter id="${id}tx" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 -.2"/></filter>
  <filter id="${id}ds" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-opacity="${o.shadow == null ? .35 : o.shadow}"/></filter>
  <clipPath id="${id}cl">${all}</clipPath>
  <clipPath id="${id}wc"><path d="${WEB}"/></clipPath>
</defs>
<g ${flip}><g filter="url(#${id}ds)">
  <g fill="${C('binding')}" stroke="${C('binding')}" stroke-width="15" stroke-linejoin="round">${all}</g>
  <g data-part="web"><path d="${WEB}" fill="${C('web')}" opacity=".55"/><g clip-path="url(#${id}wc)">${webPattern(s.webType, C('web'), C('laces'))}</g></g>
  <g data-part="thumb">${rect(THUMB, 0, `fill="${C('thumb')}"`)}${rect(THUMB, 0, `fill="url(#${id}sh)"`)}${rect(THUMB, 8, `fill="none" stroke="${C('stitch')}" stroke-width="1.8" stroke-dasharray="4 4"`)}</g>
  <g data-part="palm"><path d="${PALM}" fill="${C('palm')}"/><path d="${PALM}" fill="url(#${id}pk)"/></g>
  <g data-part="fingers">${FINGERS.map(f => rect(f, 0, `fill="${C('fingers')}"`) + rect(f, 0, `fill="url(#${id}sh)"`)).join('')}</g>
  <g fill="none" stroke="${C('stitch')}" stroke-width="1.8" stroke-dasharray="4 4" data-part="stitch">
    ${FINGERS.map(f => rect(f, 7)).join('')}
    <path d="${PALM}" transform="translate(236 360) scale(.9) translate(-236 -360)"/>
  </g>
  <g stroke="${C('laces')}" stroke-width="6" stroke-linecap="round" fill="none" data-part="laces">
    <path d="M178 100 L206 92 M232 82 L258 86 M284 100 L310 118"/>
    <path d="M150 112 L168 104" />
    <path d="M140 470 Q238 520 336 450" stroke-dasharray="9 11"/>
    <path d="M118 300 Q150 268 176 262" stroke-dasharray="8 10"/>
  </g>
  <g clip-path="url(#${id}cl)"><rect width="420" height="540" filter="url(#${id}tx)" opacity=".55"/><rect width="420" height="540" fill="url(#${id}hl)"/></g>
  <g data-part="logo">
    <ellipse cx="238" cy="440" rx="40" ry="22" fill="${C('logo')}" stroke="${C('stitch')}" stroke-width="2" stroke-dasharray="3 3"/>
    <text x="238" y="448" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-style="italic" font-size="24" fill="${logoTxt}" ${unflip(238, 448)}>${o.mark == null ? 'SSK' : o.mark}</text>
  </g>
  ${label ? `<g transform="${rot(THUMB)}"><text x="${THUMB.x + THUMB.w / 2}" y="${THUMB.y + 96}" text-anchor="middle" dominant-baseline="middle" font-family="'Brush Script MT', 'Segoe Script', cursive" font-style="italic" font-weight="700" font-size="22" fill="${C('stitch')}" transform="rotate(${lhs ? -90 : 90} ${THUMB.x + THUMB.w / 2} ${THUMB.y + 96})${lhs ? ` translate(${THUMB.x + THUMB.w / 2} ${THUMB.y + 96}) scale(1 -1) translate(${-(THUMB.x + THUMB.w / 2)} ${-(THUMB.y + 96)})` : ''}">${label.replace(/[<&>"]/g, '')}</text></g>` : ''}
</g></g></svg>`;
  }

  function price(s) {
    let p = 349;
    const pos = POSITIONS.find(x => x[0] === s.position); if (pos) p += pos[2];
    if (s.text) p += 15;
    const uniq = new Set(['palm', 'fingers', 'thumb', 'web', 'binding', 'laces'].map(k => s[k])).size;
    if (uniq > 3) p += 10;
    return p;
  }

  function bind(root, onChange) {
    const state = Object.assign({}, DEFAULT);
    let zone = 'palm';
    const q = sel => root.querySelector(sel);
    const qa = sel => [...root.querySelectorAll(sel)];
    const stage = q('[data-glove]');
    const zonesEl = q('[data-zones]');
    const swEl = q('[data-swatches]');

    if (zonesEl) zonesEl.innerHTML = ZONES.map(([k, n]) => `<button type="button" data-zone="${k}"><i style="--c:${HEX[state[k]]}"></i><span>${n}</span></button>`).join('');
    if (swEl) swEl.innerHTML = COLORS.map(([k, n, h]) => `<button type="button" data-color="${k}" title="${n}" aria-label="${n}" style="--c:${h}"></button>`).join('');
    const fill = (sel, list, key) => { const el = q(sel); if (el) el.innerHTML = list.map(x => `<button type="button" data-${key}="${x[0]}">${x[1]}</button>`).join(''); };
    fill('[data-webs]', WEBS, 'web');
    fill('[data-positions]', POSITIONS, 'pos');
    fill('[data-sizes]', SIZES.map(x => [x, x]), 'size');
    fill('[data-hands]', [['RHT', 'Rechtshandig'], ['LHT', 'Linkshandig']], 'hand');
    fill('[data-presets]', Object.keys(PRESETS).map(k => [k, k]), 'preset');

    function render(pulse) {
      if (stage) {
        stage.innerHTML = svg(state);
        if (pulse) { const g = stage.querySelector(`[data-part="${pulse}"]`); if (g) { g.classList.add('pulse'); } }
      }
      qa('[data-zone]').forEach(b => { b.classList.toggle('on', b.dataset.zone === zone); b.querySelector('i').style.setProperty('--c', HEX[state[b.dataset.zone]]); });
      qa('[data-color]').forEach(b => b.classList.toggle('on', state[zone] === b.dataset.color));
      qa('[data-web]').forEach(b => b.classList.toggle('on', state.webType === b.dataset.web));
      qa('[data-pos]').forEach(b => b.classList.toggle('on', state.position === b.dataset.pos));
      qa('[data-size]').forEach(b => b.classList.toggle('on', state.size === b.dataset.size));
      qa('[data-hand]').forEach(b => b.classList.toggle('on', state.hand === b.dataset.hand));
      qa('[data-zone-name]').forEach(e => e.textContent = ZONES.find(z => z[0] === zone)[1]);
      qa('[data-color-name]').forEach(e => e.textContent = NAME[state[zone]]);
      qa('[data-price]').forEach(e => e.textContent = '€' + price(state) + ',00');
      qa('[data-summary]').forEach(e => e.innerHTML = ZONES.map(([k, n]) => `<li><span>${n}</span><b><i style="--c:${HEX[state[k]]}"></i>${NAME[state[k]]}</b></li>`).join('')
        + `<li><span>Web</span><b>${WEBS.find(w => w[0] === state.webType)[1]}</b></li><li><span>Positie</span><b>${POSITIONS.find(w => w[0] === state.position)[1]} · ${state.size}</b></li><li><span>Hand</span><b>${state.hand}</b></li>`);
      if (onChange) onChange(state, zone);
    }
    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      const d = b.dataset;
      if (d.zone) { zone = d.zone; render(zone); return; }
      if (d.color) { state[zone] = d.color; render(zone); return; }
      if (d.web) { state.webType = d.web; render('web'); return; }
      if (d.pos) { state.position = d.pos; render(); return; }
      if (d.size) { state.size = d.size; render(); return; }
      if (d.hand) { state.hand = d.hand; render(); return; }
      if (d.preset) { Object.assign(state, PRESETS[d.preset]); render(); return; }
      if ('random' in d) { ZONES.forEach(([k]) => state[k] = COLORS[Math.floor(Math.random() * COLORS.length)][0]); state.webType = WEBS[Math.floor(Math.random() * 4)][0]; render(); return; }
      if ('next' in d) { const i = ZONES.findIndex(z => z[0] === zone); zone = ZONES[(i + 1) % ZONES.length][0]; render(zone); return; }
    });
    const t = q('[data-text]');
    if (t) { t.maxLength = 12; t.addEventListener('input', () => { state.text = t.value; render(); }); }
    // subtle 3D tilt
    if (stage) {
      const host = stage.closest('[data-tilt]') || stage;
      host.addEventListener('pointermove', e => {
        const r = host.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        stage.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
      });
      host.addEventListener('pointerleave', () => stage.style.transform = '');
    }
    render();
    return { state, render, set(z) { zone = z; render(z); } };
  }

  function paint(scope) {
    (scope || document).querySelectorAll('[data-preset]').forEach(el => {
      const v = el.dataset.preset;
      const st = PRESETS[v] ? Object.assign({}, PRESETS[v]) : JSON.parse(v);
      if (el.dataset.web) st.webType = el.dataset.web;
      el.innerHTML = svg(st, { mark: el.dataset.mark, shadow: el.dataset.shadow ? +el.dataset.shadow : null });
    });
  }
  window.SSKGlove = { svg, bind, paint, COLORS, ZONES, PRESETS, DEFAULT, price };
})();
