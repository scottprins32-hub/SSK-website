/* SSK Europe shop content, taken from sskeurope.ccvshop.nl (Nov 2026). Shared by all five homepage concepts. */
(function () {
  const BASE = 'https://sskeurope.ccvshop.nl';
  // Link for the existing glove customiser. Replace with the real URL.
  const CUSTOMIZER_URL = '#customizer';
  // Screenshot of the existing customiser for the version 2 hero. Leave empty to show the placeholder.
  const CUSTOMIZER_IMG = '';

  const I = {
    glove: '<path d="M21 56C12 52 7 44 7 34c0-8 3-14 8-16l5 10c2-10 6-17 14-19 9-2 18 2 21 10 3 9 1 21-3 28-4 6-11 9-19 9z"/><path d="M29 12c2 9 2 20 0 30M39 10c2 10 2 22 0 34M48 14c2 9 2 20-1 30" stroke-dasharray="3 3.5"/><path d="M15 18l-3 6 5 6 3-2"/><path d="M24 47c6 4 15 4 21-2"/><path d="M9 40c4 8 10 13 18 14"/>',
    bat: '<path d="M12 52l4 4"/><path d="M14 54l30-30c4-4 8-9 10-13 1-2-1-4-3-3-4 2-9 6-13 10L8 48"/><path d="M8 48l8 8"/>',
    ball: '<circle cx="32" cy="32" r="21"/><path d="M19 15c5 5 7 11 7 17s-2 12-7 17"/><path d="M45 15c-5 5-7 11-7 17s2 12 7 17"/><path d="M22 20l3-1M23 26l3-1M23 38l3 1M22 44l3 1M42 20l-3-1M41 26l-3-1M41 38l-3 1M42 44l-3 1"/>',
    helmet: '<path d="M10 38c0-14 10-24 23-24 12 0 21 9 21 21v5H30l-4 8H14c-2 0-4-2-4-4z"/><path d="M54 40h4v6H44"/><circle cx="34" cy="30" r="3"/>',
    shirt: '<path d="M22 10l-12 6-4 14 8 2v22h36V32l8-2-4-14-12-6c-2 4-6 6-10 6s-8-2-10-6z"/><path d="M28 30h8M32 30v12"/>',
    shoe: '<path d="M6 40c0-6 3-14 6-18 2 3 6 5 10 5l8-1c6 4 16 8 24 9 3 1 4 3 4 5v4H6z"/><path d="M8 50l3 4M18 50l2 4M28 50l2 4M38 50l2 4M48 50l2 4"/>',
    mask: '<path d="M16 14h32c4 0 6 3 6 7v12c0 12-10 21-22 21S10 45 10 33V21c0-4 2-7 6-7z"/><path d="M18 28h28M18 38h28M26 20v28M38 20v28"/>',
    bag: '<rect x="8" y="22" width="48" height="26" rx="10"/><path d="M24 22v-6h16v6M8 34h48"/>',
    base: '<path d="M32 10l22 22-22 22-22-22z"/><path d="M32 20l12 12-12 12-12-12z"/>',
    cap: '<path d="M12 40c0-12 9-22 20-22s20 10 20 22z"/><path d="M52 40h8c0 3-2 5-5 5H12"/><path d="M32 18v-4"/>',
    whistle: '<circle cx="24" cy="38" r="12"/><path d="M28 27h26v10H34"/><path d="M8 20l6 6"/>',
    bglove: '<path d="M20 54V30l-6-10c-2-3 2-6 4-3l6 8V10c0-3 4-3 4 0v14V8c0-3 4-3 4 0v16V10c0-3 4-3 4 0v16l2-8c1-3 5-2 4 1l-3 16-3 8v11z"/><path d="M20 46h20"/>',
    tag: '<path d="M10 30V12h18l26 26-18 18z"/><circle cx="20" cy="22" r="3"/>',
    star: '<path d="M32 8l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 25l16-2z"/>',
    sun: '<circle cx="32" cy="32" r="10"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6"/>',
    trophy: '<path d="M20 10h24v12c0 7-5 12-12 12s-12-5-12-12z"/><path d="M20 14h-8c0 7 4 10 8 10M44 14h8c0 7-4 10-8 10M32 34v10M22 54h20l-2-10H24z"/>',
    truck: '<path d="M6 16h32v26H6zM38 26h12l8 8v8H38z"/><circle cx="16" cy="46" r="5"/><circle cx="48" cy="46" r="5"/>',
    shield: '<path d="M32 8l20 8v14c0 12-8 22-20 26-12-4-20-14-20-26V16z"/><path d="M24 32l6 6 12-12"/>',
    pin: '<path d="M32 56s18-17 18-30a18 18 0 10-36 0c0 13 18 30 18 30z"/><circle cx="32" cy="26" r="6"/>',
    needle: '<path d="M12 52L46 18M42 14l8 8M46 18c4-4 6-8 4-10s-6 0-10 4"/><path d="M14 30c6 0 8 4 8 8s4 8 10 8" stroke-dasharray="3 4"/>',
    ruler: '<rect x="6" y="22" width="52" height="20" rx="3" transform="rotate(-20 32 32)"/><path d="M18 30l2 6M26 27l2 6M34 24l2 6M42 21l2 6"/>'
  };
  function icon(name, cls) {
    return `<svg class="${cls || 'ico'}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || I.ball}</svg>`;
  }

  const NAV = [
    ['Clubkleding', 'shirt', '/Webwinkel-Category-5743459/Clubkleding.html', 'Teamkleding voor jouw vereniging'],
    ['Kleding', 'shirt', '#', 'Jerseys, broeken, jassen, petten'],
    ['Ballen', 'ball', '/Webwinkel-Category-5758263/Ballen.html', 'Honkballen en softballen'],
    ['Knuppels', 'bat', '/Webwinkel-Category-5784631/Knuppels.html', 'BB-COR, composite, hout, fastpitch'],
    ['Handschoenen', 'glove', '/Webwinkel-Category-5784651/Handschoenen.html', 'Veld, catcher, eerste honk, training'],
    ['Schoenen', 'shoe', '/Webwinkel-Category-5725725/Schoenen.html', 'Spikes en turfs'],
    ['Helmen', 'helmet', '/Webwinkel-Category-5725835/Helmen.html', 'Slag- en coachhelmen'],
    ['Slaghandschoenen', 'bglove', '#', 'Grip aan de knuppel'],
    ['Catcher', 'mask', '#', 'Masker, bodyprotector, scheenbeschermers'],
    ['Veld', 'base', '#', 'Bases, netten, onderhoud'],
    ['Scheidsrechter', 'whistle', '#', 'Umpire gear'],
    ['Tassen', 'bag', '#', 'Bat bags en backpacks'],
    ['Accessoires', 'cap', '#', 'Alles voor de dugout'],
    ['Outlet', 'tag', '/Webwinkel-Category-10665083/Outlet.html', 'Tot 50% korting'],
    ['New Arrivals', 'star', '/New-Arrivals', 'Net binnen'],
    ['Zomer Korting', 'sun', '#', 'Zomerdeals'],
    ['Hoofdklasse Holland Series 2026', 'trophy', '#', 'De collectie van de Holland Series']
  ].map(([name, icon, url, sub]) => ({ name, icon, url: url.startsWith('/') ? BASE + url : url, sub }));
  NAV[16].sub = 'De collectie van de Holland Series';

  const CAT_IMG = {
    'Handschoenen': BASE + '/Files/2/81000/81585/CategoryPhotos/1200x630/5784651.png',
    'Ballen': BASE + '/Files/2/81000/81585/CategoryPhotos/1200x630/5758263.png',
    'Helmen': BASE + '/Files/2/81000/81585/CategoryPhotos/1200x630/5725835.png',
    'New Arrivals': BASE + '/Files/2/81000/81585/CategoryPhotos/1200x630/33411954.png',
    'Outlet': BASE + '/Files/2/81000/81585/CategoryPhotos/1200x630/10665083.png'
  };
  NAV.forEach(n => n.img = CAT_IMG[n.name] || '');

  // Product photos (og:image from each product page). Missing ones show a neutral placeholder.
  const PH = BASE + '/Files/2/81000/81585/ProductPhotos/1200x630/';
  const PHOTO = {
  'Rawlings-Pro-Preferred-Mike-Trout-12.75-Outfield-Glove-Black/Gray-RHT': PH + '2401957967.png',
  'Wilson-A2K-FALL-2024-B23-BLACK-12%E2%80%9D': PH + '2105045046.jpg',
  'Rawlings-Heart-of-the-Hide-33.5-Catcher-Glove-Black/Red/Splatter-RHT': PH + '2366995640.png',
  'Rawlings-Heart-Of-The-Hide-13-First-Base-Glove-Tan/Black-RHT': PH + '2366995622.png',
  'Easton-Ghost-Advanced-2026-10': PH + '2363268062.png',
  'Rawlings-Mantra-2026-10': PH + '2363268137.png',
  'DeMarini-The-Goods-26-BBCOR-3': PH + '2354495435.png',
  'Easton-Hype-Fire-2026-USA-5': PH + '2363268023.png',
  'CBB96-Champro-9-Control-Flight-Ball': PH + '400387691.jpg',
  'Champro-CSB24Y-12-Slowpitch-Softball': PH + '2097276075.jpg',
  'Baseball-Nordics-Weighted-Plyo-Ball-Set': PH + '2120016678.jpg',
  'Champro-Contour-Fit-Body-Protector-14.5-Navy': PH + '274531413.jpg',
  'Champro-Pro-Plus-Catcher-Helmet-Silver-Adult-Navy': PH + '2123885808.jpg',
  'A121899-Easton-Adult-an-Youth-Walk-Off-Army-Camo-Batting-Gloves': PH + '641473022.jpg',
  'Rawlings-Pro-Preferred-Vladimir-Guerrero-Jr-13-First-Base-Glove-Navy/Scarlet-RHT': PH + '2410112359.png',
  'Rawlings-Heart-of-the-Hide-Fun-Burst-2.0-11.5-Infield-Glove-Navy/Mint-RHT': PH + '2410154631.png',
  'Wilson-A2000-M23SS-33.5%E2%80%9D-Catcher-Glove-Seafoam/Black/Pink': PH + '2382787655.png',
  'Rawlings-RX2-Matte-Batting-Helmet-Navy': PH + '2382794561.png',
  'Rawlings-RX2-Gloss-Batting-Helmet-Black': PH + '2382805259.png',
  'GDN200-SSK-Baseball': PH + '2417010134.png',
    'GDN100-SSK-Baseball': PH + '2417010101.png',
    'Rawlings-REV1X-34-Catcher-Glove-Columbia-blue/Black/Pink-RHT': PH + '2410122391.png',
    'FP27-Louisville-Slugger-Air-Gold-Ultra-Light-Aluminium-Softbal-Knuppel-%2834/24%29': PH + '1034731165.jpg'
  };
  const LOGO = BASE + '/Files/2/81000/81585/Protom/3046376/Media/300x300/ssk%20logo_nl.jpg';
  // c = colourway used for the product tile when no photo is available
  const P = (brand, name, price, was, icon, c, tag, url) => ({ brand, name, price, was, icon, c, tag, url: BASE + '/' + url, photo: PHOTO[url] || '' });
  const PRODUCTS = {
    gloves: [
      P('Rawlings', 'Pro Preferred Vladimir Guerrero Jr 13" First Base Glove Navy/Scarlet RHT', 499.95, 0, 'glove', ['#1d2947', '#b3222b'], 'Nieuw', 'Rawlings-Pro-Preferred-Vladimir-Guerrero-Jr-13-First-Base-Glove-Navy/Scarlet-RHT'),
      P('Rawlings', 'Heart of the Hide Fun Burst 2.0 11.5" Infield Glove Navy/Mint RHT', 449.95, 0, 'glove', ['#1d2947', '#8fd9c0'], 'Nieuw', 'Rawlings-Heart-of-the-Hide-Fun-Burst-2.0-11.5-Infield-Glove-Navy/Mint-RHT'),
      P('Wilson', 'A2000 M23SS 33.5" Catcher Glove Seafoam/Black/Pink', 379.95, 0, 'glove', ['#9fd6c8', '#e58fa6'], 'Nieuw', 'Wilson-A2000-M23SS-33.5%E2%80%9D-Catcher-Glove-Seafoam/Black/Pink'),
      P('Rawlings', 'REV1X 34" Catcher Glove Columbia blue/Black/Pink RHT', 494.95, 0, 'glove', ['#8db8e0', '#1b1a19'], 'Nieuw', 'Rawlings-REV1X-34-Catcher-Glove-Columbia-blue/Black/Pink-RHT')
    ],
    more: [
      P('Rawlings', 'Pro Preferred Mike Trout 12.75" Outfield Glove Black/Gray RHT', 499.95, 0, 'glove', ['#1b1a19', '#80827f'], '', 'Rawlings-Pro-Preferred-Mike-Trout-12.75-Outfield-Glove-Black/Gray-RHT'),
      P('Wilson', 'A2K Fall 2024 B23 12" Pitcher Glove Black/Red RHT', 475.00, 0, 'glove', ['#1b1a19', '#b3222b'], '', 'Wilson-A2K-FALL-2024-B23-BLACK-12%E2%80%9D'),
      P('Rawlings', 'Heart of the Hide 33.5" Catcher Glove Black/Red/Splatter RHT', 449.95, 0, 'glove', ['#1b1a19', '#b3222b'], '', 'Rawlings-Heart-of-the-Hide-33.5-Catcher-Glove-Black/Red/Splatter-RHT'),
      P('Rawlings', 'Heart of the Hide 13" First Base Glove Tan/Black RHT', 449.95, 0, 'glove', ['#c9935b', '#1b1a19'], '', 'Rawlings-Heart-Of-The-Hide-13-First-Base-Glove-Tan/Black-RHT')
    ],
    bats: [
      P('Easton', 'Ghost Advanced 2026 -10', 544.95, 0, 'bat', ['#1b1a19', '#80827f'], 'Nieuw', 'Easton-Ghost-Advanced-2026-10'),
      P('Rawlings', 'Mantra 2026 -10', 539.95, 0, 'bat', ['#1b1a19', '#80827f'], 'Nieuw', 'Rawlings-Mantra-2026-10'),
      P('DeMarini', 'The Goods 26 BBCOR -3', 529.95, 0, 'bat', ['#1b1a19', '#80827f'], 'Nieuw', 'DeMarini-The-Goods-26-BBCOR-3'),
      P('Easton', 'Hype Fire 2026 USA -5', 449.95, 0, 'bat', ['#1b1a19', '#80827f'], 'Nieuw', 'Easton-Hype-Fire-2026-USA-5')
    ],
    balls: [
      P('SSK', 'GDN100 - SSK Baseball', 4.95, 5.95, 'ball', ['#efe9df', '#b3222b'], 'Sale', 'GDN100-SSK-Baseball'),
      P('SSK', 'GDN200 - SSK Baseball', 5.95, 6.95, 'ball', ['#efe9df', '#b3222b'], 'Sale', 'GDN200-SSK-Baseball'),
      P('Champro', 'CBB96 - Champro 9" Control Flight Ball', 9.00, 0, 'ball', ['#efe9df', '#b3222b'], '', 'CBB96-Champro-9-Control-Flight-Ball'),
      P('Baseball Nordics', 'Weighted Plyo Ball Set', 65.00, 0, 'ball', ['#2a2a2a', '#e3ae27'], '', 'Baseball-Nordics-Weighted-Plyo-Ball-Set')
    ],
    outlet: [
      P('Louisville Slugger', 'FP27 Air Gold Ultra Light Aluminium Softbal Knuppel (34/24)', 100.00, 200.00, 'bat', ['#d9b44a', '#1b1a19'], '−50%', 'FP27-Louisville-Slugger-Air-Gold-Ultra-Light-Aluminium-Softbal-Knuppel-%2834/24%29'),
      P('Champro', 'Contour Fit Body Protector 14.5" Navy', 37.50, 75.00, 'mask', ['#1d2947', '#80827f'], '−50%', 'Champro-Contour-Fit-Body-Protector-14.5-Navy'),
      P('Champro', 'Pro-Plus Catcher Helmet Silver Adult Navy', 70.00, 95.00, 'mask', ['#9aa3ad', '#1d2947'], '−26%', 'Champro-Pro-Plus-Catcher-Helmet-Silver-Adult-Navy'),
      P('Easton', 'Walk-Off Army Camo Batting Gloves', 30.00, 40.00, 'bglove', ['#4f5a3a', '#8a8a6a'], '−25%', 'A121899-Easton-Adult-an-Youth-Walk-Off-Army-Camo-Batting-Gloves')
    ]
  };

  const BRANDS = ['SSK', 'Rawlings', 'Wilson', 'Easton', 'DeMarini', 'Louisville Slugger', 'Champro', 'Evoshield'];
  const HOURS = [['Maandag', 'Gesloten'], ['Dinsdag', '12:00 – 16:30'], ['Woensdag', '10:00 – 17:30'], ['Donderdag', '12:00 – 16:30'], ['Vrijdag', '12:00 – 20:30'], ['Zaterdag', '10:00 – 16:00'], ['Zondag', 'Gesloten']];
  const PAGES = ['Openingstijden', 'Algemene voorwaarden', 'Privacy Verklaring', 'Prijslijst', 'Levertijden', 'Retour Zenden', 'Niet Te Ruilen', 'Maten', 'Garantie', '3D Geborduurde Caps en Sublimatie Jerseys', 'Was Voorschrift', 'Welke Bal Koopt U?', 'Bedrukken Kleding / Caps', 'Voorverkoop Aanbieding Ballen 2027'];
  const CONTACT = { name: 'SSK European Baseball Center', street: 'Heulweg 128B', city: '2295 KK Kwintsheul', phone: '+31 174 501 888', email: 'info@sskeurope.com', instagram: 'https://www.instagram.com/ssk_europe', facebook: 'https://www.facebook.com/SSK-Europe-1806900749536624/' };
  const LEAD = [['Op voorraad (webshop)', '3 – 5 werkdagen'], ['Bedrukken op voorraad', '+ 3 – 5 werkdagen'], ['Standaard wedstrijdkleding', '30 – 35 werkdagen'], ['Speciale broeken', '36 – 45 werkdagen'], ['Club- en studentenjassen', '36 – 45 werkdagen']];

  const eur = n => '€ ' + n.toFixed(2).replace('.', ',');
  // Image with graceful fallback: if the shop image fails, the tile keeps its icon.
  const img = (src, alt) => src ? `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()">` : '';

  window.SSK = { LOGO, BASE, CUSTOMIZER_URL, CUSTOMIZER_IMG, NAV, PRODUCTS, BRANDS, HOURS, PAGES, CONTACT, LEAD, icon, eur, img };
})();
