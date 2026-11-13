"""Four homepage concepts for SSK Europe, each in the layout language of a different sports brand's shop.

  python3 stijlen/build.py   ->  stijlen/1-clean.html, 2-performance.html, 3-game-ready.html, 4-heritage.html

Every page is one self-contained file plus the photos in stijlen/img/. Product names, prices and links
come from src/catalog/*.json (the live shop); nothing is invented. The pages are written as artifact
pages: no <html>/<head>/<body> of their own, colours as theme tokens, images referenced relatively.
"""
import html, json, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
IMG = os.path.join(HERE, 'img')
os.makedirs(IMG, exist_ok=True)
SHOP = 'https://sskeurope.ccvshop.nl'
CZ = 'https://scottprins32-hub.github.io/ssk-glove-demo/'
MAPS = 'https://www.google.com/maps/search/?api=1&query=Heulweg+128B%2C+2295+KK+Kwintsheul'
HOURS = [('Maandag', 'Gesloten'), ('Dinsdag', '12:00 – 16:30'), ('Woensdag', '10:00 – 17:30'), ('Donderdag', '12:00 – 16:30'),
         ('Vrijdag', '12:00 – 20:30'), ('Zaterdag', '10:00 – 16:00'), ('Zondag', 'Gesloten')]
e = lambda s: html.escape(str(s), quote=True)
eur = lambda n: '€ ' + ('%.2f' % n).replace('.', ',')


def img(rel):
    """Copy a photo from the repo into stijlen/img/ and return its page-relative path."""
    dest = os.path.join(IMG, os.path.basename(rel))
    if not os.path.exists(dest):
        shutil.copyfile(os.path.join(ROOT, rel), dest)
    return 'img/' + os.path.basename(rel)


def cat(slug):
    return json.load(open(os.path.join(ROOT, 'src', 'catalog', slug + '.json'), encoding='utf-8'))


def pick(slug, n, words=None):
    """First n products with a local photo; `words` de-duplicates on the first words of the name."""
    seen, out = set(), []
    for p in cat(slug)['products']:
        if not p.get('t'):
            continue
        key = ' '.join(p['n'].split()[:words]) if words else p['t']
        if key in seen or img(p['t']) in [x['i'] for x in out]:
            continue
        seen.add(key)
        b = p.get('b', '')
        name = p['n'][len(b) + 1:] if b and p['n'].lower().startswith(b.lower() + ' ') else p['n']
        out.append({'n': name, 'b': b, 'p': p['p'], 'w': p.get('w'), 'u': p['u'], 'i': img(p['t'])})
        if len(out) == n:
            break
    return out


NAV = dict(re.findall(r"\['([^']+)', '[^']+', '([^']+)', '[^']*'\]", open(os.path.join(ROOT, 'src', 'data.js'), encoding='utf-8').read()))
url = lambda name: SHOP + NAV[name]
COUNT = {s: cat(s)['count'] for s in ['handschoenen', 'knuppels', 'clubkleding', 'outlet', 'new-arrivals']}
CLUBS = len(cat('clubkleding')['subs'])

NEW = pick('new-arrivals', 8)
GLOVES = pick('handschoenen', 8)
BATS = pick('knuppels', 4, words=2)
SALE = pick('outlet', 4, words=3)
BGLOVES = pick('slaghandschoenen', 4, words=4)
SHOES = pick('schoenen', 2, words=2)
BAGS = pick('tassen', 2, words=2)
CUT = {k: img('assets/hero/%s.webp' % v) for k, v in dict(glove='2410112359', catcher='2382787655', rev='2410122391', bat='2363268062', helmet='2382805112', ball='2417010101').items()}
CW = {k: img('assets/customizer/glove-%s.webp' % k) for k in ['cardinal', 'zwart-goud', 'navy-columbia', 'nederland', 'roze-wit', 'zalm-mint', 'curacao', 'japan']}
CATS = [('Handschoenen', CUT['glove']), ('Knuppels', CUT['bat']), ('Ballen', CUT['ball']), ('Helmen', CUT['helmet']),
        ('Catcher', CUT['catcher']), ('Slaghandschoenen', BGLOVES[0]['i']), ('Schoenen', SHOES[0]['i']), ('Tassen', BAGS[0]['i'])]

ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
BACK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
CAR_JS = """<script>
document.querySelectorAll('[data-car]').forEach(function (b) {
  b.addEventListener('click', function () {
    var t = document.getElementById(b.dataset.car);
    t.scrollBy({ left: (+b.dataset.dir) * t.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
});
</script>"""
BASE = """*,*::before,*::after{box-sizing:border-box}
h1,h2,h3,p,ul,ol,dl,dd,figure{margin:0;padding:0}
ul,ol{list-style:none}
a{color:inherit;text-decoration:none}
img{display:block}
table{color:inherit;font:inherit}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.w{max-width:1320px;margin-inline:auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.car{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.car::-webkit-scrollbar{display:none}
.car>*{scroll-snap-align:start}
.ftr .w>*{min-width:0}
@media (max-width:560px){.ftr .w{grid-template-columns:1fr!important}}
.concept{font-size:12px;text-align:center;padding-block:7px;letter-spacing:.02em}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
"""


def head(title, fonts, css):
    return ('<meta charset="utf-8">\n<title>%s</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?%s&display=swap">\n<style>\n%s%s</style>\n' % (title, fonts, BASE, css))


def concept(n, name):
    return '<div class="concept"><div class="w">Conceptontwerp voor SSK Europe · stijl %d van 4: %s · producten, prijzen en links komen uit de webshop</div></div>\n' % (n, name)


def hours_rows():
    return ''.join('<tr><th scope="row">%s</th><td>%s</td></tr>' % (d, t) for d, t in HOURS)


def price(p, cls='price'):
    if p['w']:
        return '<span class="%s sale">%s <s>%s</s></span>' % (cls, eur(p['p']), eur(p['w']))
    return '<span class="%s">%s</span>' % (cls, eur(p['p']))


# =====================================================================================================
# 1. CLEAN — white canvas, full-bleed grey image fields, centred condensed display type, pill buttons
# =====================================================================================================
def clean():
    css = """/* Layout: white canvas, full-bleed grey image fields, centred display type, pill buttons, edge-to-edge carousels */
:root{--bg:#ffffff;--fg:#111111;--muted:#707072;--tile:#f5f5f5;--on-tile:#111111;--line:#e5e5e5;--accent:#c8102e;--inv:#111111;--inv-fg:#ffffff;--ink:#111111;--paper:#ffffff;--red:#c8102e;
  --display:'Anton','Arial Narrow',Impact,sans-serif;--body:'Inter Tight','Helvetica Neue',Helvetica,Arial,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#101011;--fg:#f5f5f5;--muted:#a3a3a8;--tile:#ebebed;--line:#2b2b2f;--accent:#ff5468;--inv:#ffffff;--inv-fg:#111111;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#101011;--fg:#f5f5f5;--muted:#a3a3a8;--tile:#ebebed;--line:#2b2b2f;--accent:#ff5468;--inv:#ffffff;--inv-fg:#111111;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:400 16px/1.5 var(--body);-webkit-font-smoothing:antialiased}
.concept{background:var(--tile);color:var(--on-tile)}
.util{background:var(--tile);color:var(--on-tile);font-size:12px;font-weight:500}
.util .w{display:flex;justify-content:space-between;gap:16px;padding-block:8px}
.util ul{display:flex;gap:18px}
.util a:hover{color:var(--muted)}
.hdr .w{display:flex;align-items:center;gap:24px;min-height:64px}
.logo{font:400 30px/1 var(--display);letter-spacing:.01em;text-transform:uppercase;white-space:nowrap}
.logo small{font:600 11px/1 var(--body);letter-spacing:.22em;margin-left:6px;vertical-align:middle}
.nav{display:flex;gap:26px;margin-inline:auto;font-weight:500}
.nav a{padding-block:8px;border-bottom:2px solid transparent}
.nav a:hover{border-bottom-color:var(--fg)}
.find{display:flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:99px;background:var(--tile);color:var(--on-tile);font-weight:500;font-size:15px}
.find:hover{background:var(--line);color:var(--fg)}
.promo{text-align:center;font-size:14px;padding-block:10px;background:var(--bg);border-block:1px solid var(--line)}
.promo a{text-decoration:underline;text-underline-offset:3px;font-weight:500}
.pill{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border-radius:99px;background:var(--inv);color:var(--inv-fg);font-weight:500;font-size:16px;transition:opacity .2s}
.pill:hover{opacity:.72}
.pill.w2{background:var(--paper);color:var(--ink)}
.hero-img{position:relative;background:var(--tile);aspect-ratio:21/9;overflow:hidden}
.hero-img img{position:absolute;object-fit:contain;filter:drop-shadow(0 30px 34px rgba(0,0,0,.22))}
.hero-img .a{height:92%;left:50%;top:4%;transform:translateX(-50%)}
.hero-img .b{height:74%;left:6%;top:16%;transform:rotate(-8deg)}
.hero-img .c{height:60%;right:7%;top:24%;transform:rotate(7deg)}
.hero-tx{text-align:center;padding-block:44px 12px}
.eyebrow{font-weight:500;font-size:16px}
.hero-tx h1{font:400 clamp(48px,8.2vw,112px)/.92 var(--display);text-transform:uppercase;letter-spacing:-.005em;margin:8px 0 14px;text-wrap:balance}
.hero-tx p{max-width:46ch;margin-inline:auto;color:var(--fg)}
.btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:24px}
section{padding-block:42px}
.sh{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}
.sh h2{font:500 24px/1.2 var(--body)}
.arrows{display:flex;gap:8px}
.arrows button{width:48px;height:48px;border-radius:50%;background:var(--tile);color:var(--on-tile);display:grid;place-items:center}
.arrows button:hover{background:var(--line);color:var(--fg)}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ft{position:relative;display:block;aspect-ratio:1/1;max-height:720px;width:100%;overflow:hidden;color:var(--paper)}
.ft.k{background:var(--ink)}
.ft.r{background:var(--red)}
.ft img{position:absolute;right:-6%;top:2%;height:88%;object-fit:contain;transition:transform .7s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 30px 40px rgba(0,0,0,.4))}
.ft.r img{right:-2%;top:6%;height:80%;transform:rotate(-14deg)}
.ft:hover img{transform:scale(1.05)}
.ft.r:hover img{transform:rotate(-10deg) scale(1.05)}
.ft-tx{position:absolute;left:clamp(20px,4vw,48px);bottom:clamp(20px,4vw,48px);right:20px}
.ft-tx small{display:block;font-weight:500;font-size:16px}
.ft-tx b{display:block;font:500 clamp(22px,2.4vw,30px)/1.15 var(--body);margin:4px 0 18px;max-width:16ch}
.car{gap:12px;padding-bottom:4px}
.pc{flex:0 0 clamp(250px,29vw,420px);min-width:0}
.pc .ti{aspect-ratio:1/1;background:var(--tile);overflow:hidden;position:relative}
.pc img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:8%;mix-blend-mode:multiply;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.pc:hover img{transform:scale(1.06)}
.pc .tx{padding-top:12px;display:grid;gap:2px}
.pc .new{color:var(--accent);font-weight:500}
.pc b{font-weight:500}
.pc .br{color:var(--muted)}
.price{font-weight:500;margin-top:6px}
.price s{color:var(--muted);font-weight:400;margin-left:6px}
.cc{position:relative;flex:0 0 clamp(230px,24vw,350px);aspect-ratio:3/4;background:var(--tile);overflow:hidden}
.cc img{position:absolute;inset:8% 8% 22%;width:84%;height:70%;object-fit:contain;mix-blend-mode:multiply;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.cc:hover img{transform:scale(1.07) rotate(-3deg)}
.cc .pill{position:absolute;left:24px;bottom:24px;height:38px;padding:0 18px}
.cz{background:var(--ink);color:var(--paper);text-align:center;padding-block:64px 0;overflow:hidden}
.cz h2{font:400 clamp(44px,7.4vw,104px)/.92 var(--display);text-transform:uppercase;margin:8px 0 12px;text-wrap:balance}
.cz p{max-width:44ch;margin-inline:auto;color:#c9c9cc}
.cz-row{display:flex;justify-content:center;margin-top:36px;margin-bottom:-6%}
.cz-row img{width:22%;max-width:300px;margin-inline:-2.5%;filter:drop-shadow(0 20px 30px rgba(0,0,0,.6));transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.cz-row img:hover{transform:translateY(-16px)}
.links{display:grid;grid-template-columns:repeat(4,1fr);gap:28px 24px}
.links h3{font:500 20px/1.2 var(--body);margin-bottom:16px}
.links li{margin-bottom:8px}
.links a,.links span{color:var(--muted);font-weight:500}
.links a:hover{color:var(--fg)}
.ftr{border-top:1px solid var(--line);padding-block:28px;color:var(--muted);font-size:13px}
.ftr .w{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
@media (max-width:900px){.nav{display:none}.find{margin-left:auto}.util ul li:nth-child(n+2){display:none}.duo{grid-template-columns:1fr}.links{grid-template-columns:1fr 1fr}.hero-img{aspect-ratio:4/3}.hero-img .a{height:78%;top:10%}.hero-img .b{height:50%;left:-6%}.hero-img .c{height:42%;right:-4%}.cz-row img{width:30%}.cz-row img:nth-child(n+4){display:none}}
"""
    def pc(p, new=True):
        return ('<a class="pc" href="%s"><div class="ti"><img src="%s" alt="%s" loading="lazy" width="480" height="480"></div><div class="tx">%s<b>%s</b><span class="br">%s</span>%s</div></a>'
                % (e(p['u']), p['i'], e(p['n']), '<span class="new">Net binnen</span>' if new else '', e(p['n']), e(p['b']), price(p)))
    b = head('SSK Concept Clean', 'family=Anton&family=Inter+Tight:wght@400;500;600', css)
    b += concept(1, 'Clean')
    b += '<div class="util"><div class="w"><span>SSK European Baseball Center · Kwintsheul</span><ul><li><a href="%s/Openingstijden">Openingstijden</a></li><li><a href="%s/Webwinkel-Page-1182239/Levertijden.html">Levertijden</a></li><li><a href="%s/website/index.php?Show=WebShopUserLogin">Inloggen</a></li></ul></div></div>\n' % (SHOP, SHOP, SHOP)
    b += '<header class="hdr"><div class="w"><a class="logo" href="%s">SSK<small>EUROPE</small></a><nav class="nav" aria-label="Hoofdmenu">%s</nav><a class="find" href="%s/website/index.php?Show=Search&KeyWord=handschoen">Zoeken</a></div></header>\n' % (
        SHOP, ''.join('<a href="%s">%s</a>' % (url(n), l) for n, l in [('New Arrivals', 'Nieuw'), ('Handschoenen', 'Handschoenen'), ('Knuppels', 'Knuppels'), ('Ballen', 'Ballen'), ('Kleding', 'Kleding'), ('Outlet', 'Outlet')]), SHOP)
    b += '<div class="promo"><div class="w">Op voorraad? Dan binnen 3–5 werkdagen in huis. <a href="%s">Bekijk wat nieuw is</a></div></div>\n' % url('New Arrivals')
    b += '<main>\n<div class="hero-img"><img class="b" src="%s" alt=""><img class="c" src="%s" alt=""><img class="a" src="%s" alt="Rawlings Pro Preferred eerste-honkhandschoen" fetchpriority="high"></div>\n' % (CUT['bat'], CUT['helmet'], CUT['glove'])
    b += '<div class="hero-tx"><div class="w"><div class="eyebrow">Seizoen 2026</div><h1>Klaar voor de eerste bal</h1><p>De nieuwe handschoenen, knuppels en helmen zijn binnen. %d nieuwe producten in de webshop.</p><div class="btns"><a class="pill" href="%s">Shop nieuw</a><a class="pill" href="%s">Alle handschoenen</a></div></div></div>\n' % (COUNT['new-arrivals'], url('New Arrivals'), url('Handschoenen'))
    b += '<section><div class="w"><div class="sh"><h2>Uitgelicht</h2></div><div class="duo">'
    b += '<a class="ft k" href="%s"><img src="%s" alt="Zwart met gouden SSK-handschoen uit de customizer" loading="lazy"><span class="ft-tx"><small>Glove Customizer</small><b>Ontwerp je eigen SSK Pro Custom</b><span class="pill w2">Start met ontwerpen</span></span></a>' % (CZ, CW['zwart-goud'])
    b += '<a class="ft r" href="%s"><img src="%s" alt="Easton Ghost Advanced knuppel" loading="lazy"><span class="ft-tx"><small>Knuppels 2026</small><b>De nieuwe modellen zijn binnen</b><span class="pill w2">Shop knuppels</span></span></a></div></div></section>\n' % (url('Knuppels'), CUT['bat'])
    b += '<section><div class="w"><div class="sh"><h2>Nieuw binnen</h2><div class="arrows"><button data-car="c1" data-dir="-1" aria-label="Vorige">%s</button><button data-car="c1" data-dir="1" aria-label="Volgende">%s</button></div></div><div class="car" id="c1">%s</div></div></section>\n' % (BACK, ARROW, ''.join(pc(p) for p in NEW))
    b += '<section><div class="w"><div class="sh"><h2>Shop per categorie</h2><div class="arrows"><button data-car="c2" data-dir="-1" aria-label="Vorige">%s</button><button data-car="c2" data-dir="1" aria-label="Volgende">%s</button></div></div><div class="car" id="c2">%s</div></div></section>\n' % (
        BACK, ARROW, ''.join('<a class="cc" href="%s"><img src="%s" alt="" loading="lazy"><span class="pill w2">%s</span></a>' % (url(n), i, n) for n, i in CATS))
    b += '<div class="cz"><div class="w"><div class="eyebrow">SSK Pro Custom · vanaf € 374,95</div><h2>Geen twee dezelfde</h2><p>Kies web, leer en veters, kleur twintig onderdelen en zet je naam op de duim.</p><div class="btns"><a class="pill w2" href="%s">Ontwerp je handschoen</a></div><div class="cz-row">%s</div></div></div>\n' % (
        CZ, ''.join('<img src="%s" alt="" loading="lazy">' % CW[k] for k in ['navy-columbia', 'cardinal', 'zalm-mint', 'nederland', 'roze-wit']))
    b += '<section><div class="w"><div class="sh"><h2>Outlet</h2><a class="pill" href="%s">Alles in de outlet</a></div><div class="car" id="c3">%s</div></div></section>\n' % (url('Outlet'), ''.join(pc(p, False) for p in SALE + BGLOVES))
    cols = [('Handschoenen', [('Veldhandschoenen', '/Webwinkel-Category-32330970/Veld-Handschoenen.html'), ('Catcherhandschoenen', '/Webwinkel-Category-32330976/Catcher-Handschoenen.html'), ('Eerste honk', '/Webwinkel-Category-32330979/Eerste-Honk-Handschoenen.html'), ('Slaghandschoenen', NAV['Slaghandschoenen'])]),
            ('Uitrusting', [('Knuppels', NAV['Knuppels']), ('Ballen', NAV['Ballen']), ('Helmen', NAV['Helmen']), ('Schoenen', NAV['Schoenen'])]),
            ('Voor clubs', [('Clubkleding', NAV['Clubkleding']), ('Bedrukken en borduren', '/3d-borduring'), ('Scheidsrechter', NAV['Scheidsrechter']), ('Veldmateriaal', NAV['Veld'])])]
    b += '<section><div class="w"><div class="links">%s<div><h3>Showroom</h3><ul><li><span>Heulweg 128B, 2295 KK Kwintsheul</span></li><li><span>+31 174 501 888</span></li><li><span>info@sskeurope.com</span></li><li><a href="%s">Route plannen</a></li></ul></div></div></div></section>\n</main>\n' % (
        ''.join('<div><h3>%s</h3><ul>%s</ul></div>' % (t, ''.join('<li><a href="%s%s">%s</a></li>' % (SHOP, u, l) for l, u in ls)) for t, ls in cols), MAPS)
    b += '<footer class="ftr"><div class="w"><span>© 2026 SSK Europe</span><span>Honkbal en softbal sinds Kyoto, Japan</span></div></footer>\n' + CAR_JS
    return b


# =====================================================================================================
# 2. PERFORMANCE — black, white and red, hard edges, wide heavy capitals, dense grids
# =====================================================================================================
def performance():
    css = """/* Layout: black header and hero with a red diagonal, wide heavy capitals, square bordered cards in dense grids */
:root{--bg:#ffffff;--fg:#0b0b0b;--muted:#5d5d5d;--panel:#f1f1f1;--line:#d6d6d6;--accent:#c8102e;--ink:#0b0b0b;--paper:#ffffff;--red:#c8102e;--ink-muted:#a8a8a8;--ink-line:#2a2a2a;--photo:#ffffff;
  --display:'Archivo','Arial Black',Arial,sans-serif;--body:'Archivo',Arial,Helvetica,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b0b0b;--fg:#ffffff;--muted:#a8a8a8;--panel:#171717;--line:#2a2a2a;--accent:#ff3b52;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0b0b0b;--fg:#ffffff;--muted:#a8a8a8;--panel:#171717;--line:#2a2a2a;--accent:#ff3b52;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:400 15px/1.5 var(--body);-webkit-font-smoothing:antialiased}
.wide{font-family:var(--display);font-stretch:125%;font-weight:900;text-transform:uppercase;letter-spacing:-.01em}
.concept{background:var(--panel);color:var(--fg)}
.promo{background:var(--red);color:var(--paper);font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;text-align:center;padding-block:9px}
.promo a{text-decoration:underline;text-underline-offset:3px}
.hdr{background:var(--ink);color:var(--paper)}
.hdr .w{display:flex;align-items:center;gap:28px;min-height:68px}
.logo{font:900 26px/1 var(--display);font-stretch:125%;letter-spacing:-.02em}
.logo i{font-style:normal;color:var(--red)}
.nav{display:flex;gap:24px;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
.nav a{padding-block:24px;border-bottom:3px solid transparent}
.nav a:hover{border-bottom-color:var(--red)}
.acts{margin-left:auto;display:flex;gap:18px;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-muted)}
.acts a:hover{color:var(--paper)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:50px;padding:0 26px;font-weight:800;font-size:13px;letter-spacing:.1em;text-transform:uppercase;border:2px solid transparent;transition:background-color .15s,color .15s,border-color .15s}
.btn.wh{background:var(--paper);color:var(--ink)}
.btn.wh:hover{background:var(--red);color:var(--paper)}
.btn.ol{border-color:var(--paper);color:var(--paper)}
.btn.ol:hover{background:var(--paper);color:var(--ink)}
.btn.bk{background:var(--fg);color:var(--bg)}
.btn.bk:hover{background:var(--accent);color:var(--paper)}
.hero{background:var(--ink);color:var(--paper);position:relative;overflow:hidden}
.hero:before{content:'';position:absolute;right:-8%;top:0;bottom:0;width:52%;background:var(--red);transform:skewX(-14deg)}
.hero:after{content:'';position:absolute;right:38%;top:0;bottom:0;width:10px;background:var(--paper);transform:skewX(-14deg);opacity:.9}
.hero .w{position:relative;z-index:1;display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:center;padding-block:56px}
.kick{font-weight:800;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--red)}
.hero .kick{color:var(--paper);display:inline-block;background:var(--red);padding:6px 10px}
.hero h1{font-size:clamp(40px,6.6vw,96px);line-height:.9;margin:18px 0 18px}
.hero h1 em{font-style:normal;color:transparent;-webkit-text-stroke:2px var(--paper)}
.hero p{max-width:42ch;color:#d2d2d2;font-size:17px}
.btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:26px}
.hero img{width:100%;max-width:520px;justify-self:center;filter:drop-shadow(0 40px 40px rgba(0,0,0,.55));transform:rotate(-6deg)}
.stats{background:var(--ink);color:var(--paper);border-top:1px solid var(--ink-line)}
.stats .w{display:grid;grid-template-columns:repeat(4,1fr)}
.stats .w>div{padding:22px 20px 22px 0;border-right:1px solid var(--ink-line)}
.stats .w>div+div{padding-left:20px}
.stats .w>div:last-child{border-right:0}
.stats b{display:block;font-size:clamp(22px,2.6vw,34px);line-height:1}
.stats span{display:block;margin-top:8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-muted)}
section{padding-block:56px}
.sh{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:22px;border-bottom:3px solid var(--fg);padding-bottom:12px}
.sh h2{font-size:clamp(24px,3.4vw,44px);line-height:1}
.sh a{font-weight:800;font-size:12px;letter-spacing:.1em;text-transform:uppercase;display:inline-flex;gap:8px;align-items:center}
.sh a:hover{color:var(--accent)}
.cats{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
.cat{display:block;border:1px solid var(--line);background:var(--photo)}
.cat .im{aspect-ratio:1/1;overflow:hidden;position:relative}
.cat img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:14%;transition:transform .4s}
.cat:hover img{transform:scale(1.1)}
.cat b{display:block;background:var(--ink);color:var(--paper);font-weight:800;font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:10px 6px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cat:hover b{background:var(--red)}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.pc{display:flex;flex-direction:column;border:1px solid var(--line);background:var(--bg);transition:border-color .15s,transform .15s;min-width:0}
.pc:hover{border-color:var(--fg);transform:translateY(-3px)}
.pc .im{background:var(--photo);aspect-ratio:1/1;position:relative;border-bottom:1px solid var(--line);overflow:hidden}
.pc img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:9%}
.tag{position:absolute;left:0;top:12px;background:var(--ink);color:var(--paper);font-weight:800;font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:5px 9px}
.tag.s{background:var(--red)}
.pc .tx{padding:14px;display:grid;gap:4px}
.pc .br{font-weight:800;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.pc b{font-weight:700;font-size:14px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
.price{font-weight:800;font-size:16px;margin-top:4px;font-variant-numeric:tabular-nums}
.price.sale{color:var(--accent)}
.price s{color:var(--muted);font-weight:500;font-size:13px;margin-left:6px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pro{position:relative;min-height:340px;padding:36px;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;gap:10px;overflow:hidden}
.pro.r{background:var(--red);color:var(--paper)}
.pro.k{background:var(--ink);color:var(--paper)}
.pro .big{font-size:clamp(48px,7vw,104px);line-height:.85}
.pro p{max-width:34ch}
.pro img{position:absolute;right:-4%;top:-4%;height:86%;transform:rotate(10deg);filter:drop-shadow(0 30px 30px rgba(0,0,0,.4))}
.pro>*:not(img){position:relative}
.cz{background:var(--ink);color:var(--paper);background-image:repeating-linear-gradient(-55deg,transparent 0 22px,rgba(255,255,255,.035) 22px 24px)}
.cz .w{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;padding-block:64px}
.cz h2{font-size:clamp(32px,5vw,72px);line-height:.9;margin:14px 0}
.cz h2 em{font-style:normal;color:var(--red)}
.cz p{color:#d2d2d2;max-width:42ch}
.cz ul{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}
.cz li{border:1px solid var(--ink-line);padding:8px 12px;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.cz-vis{display:flex;justify-content:center}
.cz-vis img{width:46%;margin-inline:-7%;filter:drop-shadow(0 30px 30px rgba(0,0,0,.6))}
.cz-vis img:nth-child(2){transform:translateY(-8%) scale(1.12);z-index:1}
.ftr{background:var(--ink);color:var(--ink-muted);border-top:4px solid var(--red)}
.ftr .w{display:grid;grid-template-columns:1.3fr 1fr 1fr 1.2fr;gap:28px;padding-block:44px}
.ftr h3{color:var(--paper);font-weight:800;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px}
.ftr li{margin-bottom:7px;font-size:14px}
.ftr a:hover{color:var(--paper)}
.ftr table{border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}
.ftr th{text-align:left;font-weight:400;padding:2px 18px 2px 0}
@media (max-width:1000px){.cats{grid-template-columns:repeat(4,1fr)}.grid{grid-template-columns:repeat(2,1fr)}.nav{display:none}}
@media (max-width:760px){.cats{grid-template-columns:repeat(2,1fr)}.hero .w,.cz .w,.split{grid-template-columns:1fr}.hero:before{width:120%;right:-60%;top:46%}.hero:after{display:none}.hero img{max-width:320px;order:-1}.stats .w{grid-template-columns:1fr 1fr}.stats .w>div{padding:16px 12px 16px 0;border-bottom:1px solid var(--ink-line)}.stats .w>div+div{padding-left:0}.stats .w>div:nth-child(2n){border-right:0;padding-left:14px}.ftr .w{grid-template-columns:1fr 1fr}.pro img{height:60%}.acts a:first-child{display:none}}
"""
    def pc(p, tag):
        t = ('<span class="tag s">−%d%%</span>' % round((1 - p['p'] / p['w']) * 100)) if p['w'] else ('<span class="tag">%s</span>' % tag if tag else '')
        return ('<a class="pc" href="%s"><div class="im">%s<img src="%s" alt="%s" loading="lazy" width="480" height="480"></div><div class="tx"><span class="br">%s</span><b>%s</b>%s</div></a>'
                % (e(p['u']), t, p['i'], e(p['n']), e(p['b']), e(p['n']), price(p)))
    b = head('SSK Concept Performance', 'family=Archivo:wdth,wght@62..125,400..900', css)
    b += concept(2, 'Performance')
    b += '<div class="promo"><div class="w">Outlet: tot 50%% korting · <a href="%s">Shop de outlet</a></div></div>\n' % url('Outlet')
    b += '<header class="hdr"><div class="w"><a class="logo" href="%s">SSK<i>/</i>EUROPE</a><nav class="nav" aria-label="Hoofdmenu">%s</nav><div class="acts"><a href="%s/website/index.php?Show=WebShopUserLogin">Account</a><a href="%s/website/index.php?Show=WebShopBasket">Winkelwagen</a></div></div></header>\n' % (
        SHOP, ''.join('<a href="%s">%s</a>' % (url(n), n if n != 'New Arrivals' else 'Nieuw') for n in ['New Arrivals', 'Handschoenen', 'Knuppels', 'Helmen', 'Catcher', 'Clubkleding', 'Outlet']), SHOP, SHOP)
    b += '<main>\n<div class="hero"><div class="w"><div><span class="kick">Seizoen 2026</span><h1 class="wide">Gebouwd<br>voor het<br><em>veld.</em></h1><p>Handschoenen, knuppels en bescherming van SSK, Rawlings, Wilson en Easton. Online besteld, of gepast in de showroom in Kwintsheul.</p><div class="btns"><a class="btn wh" href="%s">Shop nieuw binnen %s</a><a class="btn ol" href="%s">Alle handschoenen</a></div></div><img src="%s" alt="Rawlings REV1X catcherhandschoen" fetchpriority="high"></div></div>\n' % (url('New Arrivals'), ARROW, url('Handschoenen'), CUT['rev'])
    b += '<div class="stats"><div class="w"><div><b class="wide">3–5</b><span>Werkdagen levertijd op voorraad</span></div><div><b class="wide">%d</b><span>Handschoenen in de webshop</span></div><div><b class="wide">%d</b><span>Knuppels in de webshop</span></div><div><b class="wide">%d</b><span>Verenigingen met clubkleding</span></div></div></div>\n' % (COUNT['handschoenen'], COUNT['knuppels'], CLUBS)
    b += '<section><div class="w"><div class="sh"><h2 class="wide">Shop per categorie</h2></div><div class="cats">%s</div></div></section>\n' % ''.join('<a class="cat" href="%s"><div class="im"><img src="%s" alt="" loading="lazy"></div><b>%s</b></a>' % (url(n), i, n) for n, i in CATS)
    b += '<section style="padding-top:0"><div class="w"><div class="sh"><h2 class="wide">Nieuw binnen</h2><a href="%s">Alles bekijken %s</a></div><div class="grid">%s</div></div></section>\n' % (url('New Arrivals'), ARROW, ''.join(pc(p, 'Nieuw') for p in NEW))
    b += '<section style="padding-top:0"><div class="w"><div class="split"><a class="pro r" href="%s"><img src="%s" alt="" loading="lazy"><span class="kick" style="color:inherit">Outlet</span><span class="big wide">−50%%</span><p>Catcher-uitrusting, knuppels en handschoenen. Op is op.</p><span class="btn wh">Naar de outlet</span></a><a class="pro k" href="%s"><span class="kick">Voor verenigingen</span><span class="big wide" style="font-size:clamp(34px,4.4vw,64px)">Club&shy;kleding</span><p>Jerseys, caps en jassen voor %d verenigingen. Met logo, nummers en namen.</p><span class="btn ol">Zoek je club</span></a></div></div></section>\n' % (url('Outlet'), CUT['helmet'], url('Clubkleding'), CLUBS)
    b += '<section style="padding-top:0"><div class="w"><div class="sh"><h2 class="wide">Knuppels 2026</h2><a href="%s">Alle knuppels %s</a></div><div class="grid">%s</div></div></section>\n' % (url('Knuppels'), ARROW, ''.join(pc(p, '2026') for p in BATS))
    b += '<div class="cz"><div class="w"><div><span class="kick">Glove Customizer</span><h2 class="wide">Jouw model.<br><em>Jouw kleuren.</em></h2><p>Stel een SSK Pro Custom samen en zie hem meteen van vier kanten. Vanaf € 374,95.</p><ul><li>20 onderdelen</li><li>5 webs</li><li>Naam op de duim</li></ul><div class="btns"><a class="btn wh" href="%s">Start de customizer %s</a></div></div><div class="cz-vis"><img src="%s" alt="" loading="lazy"><img src="%s" alt="SSK Pro Custom in cardinal en wit" loading="lazy"><img src="%s" alt="" loading="lazy"></div></div></div>\n' % (CZ, ARROW, CW['zwart-goud'], CW['cardinal'], CW['navy-columbia'])
    b += '<section><div class="w"><div class="sh"><h2 class="wide">Outlet</h2><a href="%s">Alles in de outlet %s</a></div><div class="grid">%s</div></div></section>\n</main>\n' % (url('Outlet'), ARROW, ''.join(pc(p, '') for p in SALE))
    b += '<footer class="ftr"><div class="w"><div><div class="logo" style="color:var(--paper);margin-bottom:14px">SSK<i>/</i>EUROPE</div><p>SSK European Baseball Center<br>Heulweg 128B, 2295 KK Kwintsheul<br>+31 174 501 888 · info@sskeurope.com</p></div><div><h3>Shop</h3><ul>%s</ul></div><div><h3>Service</h3><ul>%s</ul></div><div><h3>Openingstijden</h3><table>%s</table></div></div></footer>\n' % (
        ''.join('<li><a href="%s">%s</a></li>' % (url(n), n) for n in ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Schoenen', 'Tassen']),
        ''.join('<li><a href="%s%s">%s</a></li>' % (SHOP, u, l) for l, u in [('Levertijden', '/Webwinkel-Page-1182239/Levertijden.html'), ('Retour zenden', '/Webwinkel-Page-1182445/Retour-Zenden.html'), ('Maten', '/Maten'), ('Garantie', '/Garantie')]) + '<li><a href="%s">Route plannen</a></li>' % MAPS, hours_rows())
    return b


# =====================================================================================================
# 3. GAME READY — SSK's own US shop: centred logo, gloves lined up on the field, outlined label tiles
# =====================================================================================================
def game_ready():
    css = """/* Layout: centred logo over a centred menu, a field scene with gloves lined up on the grass, photo tiles with outlined labels */
:root{--bg:#ffffff;--fg:#161616;--muted:#676767;--line:#dedede;--panel:#f4f4f4;--accent:#d7182a;--bar:#1d1d1d;--gold:#e3b758;--red:#d7182a;--ink:#141414;--paper:#ffffff;--sky1:#8fc4ea;--sky2:#e6f3fb;--turf1:#3f8f3a;--turf2:#2c6e2a;--photo:#ffffff;
  --display:'Montserrat',Arial,Helvetica,sans-serif;--body:'Karla',Arial,Helvetica,sans-serif;--brush:'Permanent Marker','Comic Sans MS',cursive}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#131313;--fg:#f3f3f3;--muted:#a5a5a5;--line:#303030;--panel:#1c1c1c;--accent:#ff4a5b;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#131313;--fg:#f3f3f3;--muted:#a5a5a5;--line:#303030;--panel:#1c1c1c;--accent:#ff4a5b;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:400 16px/1.5 var(--body);-webkit-font-smoothing:antialiased}
.concept{background:var(--panel);color:var(--fg)}
.top{background:var(--bar);color:var(--gold);font:700 12px/1 var(--display);letter-spacing:.06em;text-transform:uppercase;text-align:center;padding-block:11px}
.hdr .w:not(.nav){display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding-block:14px}
.find{justify-self:start;display:flex;align-items:center;justify-content:space-between;gap:10px;width:min(100%,280px);height:36px;padding:0 14px;border:1px solid var(--line);border-radius:99px;color:var(--muted);font-size:14px}
.find:hover{border-color:var(--fg)}
.logo{font:italic 900 44px/1 var(--display);letter-spacing:-.04em;color:var(--red);text-align:center}
.logo small{display:block;font:700 10px/1 var(--display);letter-spacing:.42em;color:var(--fg);font-style:normal;margin-top:2px;text-indent:.42em}
.acts{justify-self:end;display:flex;gap:20px;font:600 12px/1 var(--display);letter-spacing:.04em;text-transform:uppercase}
.acts a:hover,.nav a:hover{color:var(--accent)}
.nav{display:flex;justify-content:center;gap:clamp(18px,4vw,64px);font:700 13px/1 var(--display);letter-spacing:.03em;text-transform:uppercase;padding-block:12px 16px;flex-wrap:wrap}
.strip{background:var(--ink);color:#8d8d8d;overflow:hidden;white-space:nowrap;font:italic 800 13px/26px var(--display);letter-spacing:.04em}
.strip span{display:inline-block;padding-right:56px}
.strip b{color:var(--paper)}
.hero{position:relative;background:linear-gradient(var(--sky1),var(--sky2) 58%,var(--turf1) 58%,var(--turf2));overflow:hidden;text-align:center}
.hero:after{content:'';position:absolute;left:0;right:0;bottom:0;height:42%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 90px,transparent 90px 180px);pointer-events:none}
.hero .w{position:relative;z-index:1;padding-block:40px 34px}
.splash{display:inline-block;background:var(--paper);color:var(--ink);padding:14px 34px 16px;clip-path:polygon(2% 12%,9% 2%,31% 6%,52% 0,74% 5%,97% 3%,100% 44%,96% 90%,71% 97%,48% 92%,22% 100%,4% 93%,0 52%);transform:rotate(-2deg)}
.splash small{display:block;font:400 clamp(18px,2.6vw,32px)/1.1 var(--brush)}
.splash b{display:block;font:400 clamp(30px,5.4vw,70px)/1 var(--brush);text-transform:uppercase}
.swipe{display:block;width:min(52%,440px);height:14px;margin:-4px auto 0;color:var(--red)}
.lineup{display:flex;justify-content:center;align-items:flex-end;margin-top:14px}
.lineup img{width:19%;max-width:250px;margin-inline:-1.2%;filter:drop-shadow(0 18px 12px rgba(0,0,0,.4));transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.lineup a:hover img,.lineup img:hover{transform:translateY(-12px) rotate(-3deg)}
.lineup img:nth-child(odd){transform:rotate(-5deg)}
.lineup img:nth-child(even){transform:rotate(4deg)}
.box{display:inline-block;background:var(--ink);color:var(--paper);font:800 clamp(14px,1.5vw,19px)/1 var(--display);letter-spacing:.06em;text-transform:uppercase;padding:10px 20px;outline:2px solid var(--paper);outline-offset:-6px;transition:background-color .2s}
a:hover>.box,a.box:hover{background:var(--red)}
.hero .box{margin-top:22px;padding:14px 30px}
section{padding-block:44px}
h2.t{font:800 clamp(22px,3vw,34px)/1.1 var(--display);text-transform:uppercase;text-align:center;margin-bottom:6px}
.sub{text-align:center;color:var(--muted);margin-bottom:24px}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.tile{position:relative;display:block;aspect-ratio:1/1;background:var(--photo);overflow:hidden;border:1px solid var(--line)}
.tile img{position:absolute;inset:6% 10% 20%;width:80%;height:74%;object-fit:contain;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.tile:hover img{transform:scale(1.08)}
.tile .box{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);white-space:nowrap;max-width:92%}
.tile.c{border:0}
.tile.c img{inset:4% 8% 6%;height:90%;width:84%;filter:drop-shadow(0 16px 16px rgba(0,0,0,.35))}
.wides{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
.wd{position:relative;display:flex;align-items:flex-end;justify-content:center;min-height:210px;padding:18px;background:var(--ink);overflow:hidden}
.wd img{position:absolute;height:120%;top:-14%;opacity:.95;filter:drop-shadow(0 16px 20px rgba(0,0,0,.5))}
.wd img:nth-of-type(1){left:6%;transform:rotate(-12deg)}
.wd img:nth-of-type(2){right:6%;transform:rotate(10deg)}
.wd .box{position:relative}
.bold{margin-inline:auto;border:10px solid var(--ink);background:linear-gradient(100deg,#3aa9f0,#8f7cf0 52%,#f04fa6);color:var(--paper);text-align:center;padding:34px 20px 30px;position:relative;overflow:hidden}
.bold:before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(90deg,transparent,#000 60%)}
.bold>*{position:relative}
.bold h2{font:400 clamp(30px,6vw,78px)/1 var(--brush);text-shadow:4px 4px 0 rgba(20,20,20,.55);transform:rotate(-2deg)}
.bold .row{display:flex;justify-content:center;margin:10px 0 6px}
.bold .row img{width:15%;max-width:180px;margin-inline:-1%;filter:drop-shadow(0 14px 12px rgba(0,0,0,.4))}
.hex{display:flex;justify-content:center;gap:clamp(14px,4vw,48px);flex-wrap:wrap;margin:14px 0 20px}
.hex li{display:grid;justify-items:center;gap:8px;font:800 11px/1.15 var(--display);letter-spacing:.06em;text-transform:uppercase;max-width:110px}
.hex i{display:grid;place-items:center;width:58px;height:64px;background:var(--ink);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);font:800 20px/1 var(--display);font-style:normal}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.pc{display:flex;flex-direction:column;text-align:center;border:1px solid var(--line);background:var(--bg);min-width:0}
.pc .im{background:var(--photo);aspect-ratio:1/1;position:relative;overflow:hidden}
.pc img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:8%;transition:transform .4s}
.pc:hover img{transform:scale(1.06)}
.pc .tx{padding:14px 12px 16px;display:grid;gap:6px;justify-items:center;flex:1}
.pc b{font:700 14px/1.3 var(--display);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}
.pc .br{font-size:13px;color:var(--muted)}
.price{font:700 16px/1 var(--display);font-variant-numeric:tabular-nums}
.price s{color:var(--muted);font-weight:500;font-size:13px;margin-left:4px}
.price.sale{color:var(--accent)}
.pc .go{margin-top:6px;border:2px solid var(--fg);font:800 11px/1 var(--display);letter-spacing:.08em;text-transform:uppercase;padding:9px 16px;transition:background-color .2s,color .2s}
.pc:hover .go{background:var(--fg);color:var(--bg)}
.story{background:var(--panel);text-align:center}
.story h2{font:400 clamp(30px,5vw,60px)/1.05 var(--brush);color:var(--accent)}
.story p{max-width:62ch;margin:14px auto 0}
.ftr{background:var(--bar);color:#b9b9b9}
.ftr .w{display:grid;grid-template-columns:1.2fr 1fr 1fr 1.2fr;gap:28px;padding-block:40px}
.ftr h3{font:800 13px/1 var(--display);letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.ftr li{margin-bottom:7px}
.ftr a:hover{color:var(--paper)}
.ftr table{border-collapse:collapse;font-size:14px;font-variant-numeric:tabular-nums}
.ftr th{text-align:left;font-weight:400;padding:2px 18px 2px 0}
@media (max-width:900px){.tiles,.grid{grid-template-columns:repeat(2,1fr)}.ftr .w{grid-template-columns:1fr 1fr}.hdr .w:not(.nav){grid-template-columns:auto 1fr}.find{display:none}.logo{text-align:left;font-size:36px}.lineup img{width:26%}.lineup img:nth-child(n+5){display:none}.wides{grid-template-columns:1fr}.bold .row img{width:22%}.bold .row img:nth-child(n+6){display:none}.tile .box{font-size:10.5px;padding:9px 8px;letter-spacing:.02em}}
"""
    def pc(p):
        return ('<a class="pc" href="%s"><div class="im"><img src="%s" alt="%s" loading="lazy" width="480" height="480"></div><div class="tx"><b>%s</b><span class="br">%s</span>%s<span class="go">Bekijk</span></div></a>'
                % (e(p['u']), p['i'], e(p['n']), e(p['n']), e(p['b']), price(p)))
    b = head('SSK Concept Game Ready', 'family=Montserrat:ital,wght@0,600;0,700;0,800;0,900;1,800;1,900&family=Karla:wght@400;600&family=Permanent+Marker', css)
    b += concept(3, 'Game Ready')
    b += '<div class="top"><div class="w">Op voorraad binnen 3–5 werkdagen in huis</div></div>\n'
    b += '<header class="hdr"><div class="w"><a class="find" href="%s/website/index.php?Show=Search&KeyWord=handschoen"><span>Zoeken</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></a><a class="logo" href="%s">SSK<small>EUROPE</small></a><div class="acts"><a href="%s/website/index.php?Show=WebShopUserLogin">Inloggen</a><a href="%s/website/index.php?Show=WebShopBasket">Winkelwagen</a></div></div><nav class="nav w" aria-label="Hoofdmenu">%s</nav></header>\n' % (
        SHOP, SHOP, SHOP, SHOP, ''.join('<a href="%s">%s</a>' % (url(n), n) for n in ['Handschoenen', 'Knuppels', 'Kleding', 'Accessoires', 'Catcher', 'Clubkleding']))
    b += '<div class="strip" aria-hidden="true">%s</div>\n' % ('<span><b>SSK</b> Pro Custom</span>' * 24)
    b += '<main>\n<div class="hero"><div class="w"><div class="splash"><small>Het thuis van de</small><b>Game Ready Glove</b></div><svg class="swipe" viewBox="0 0 440 14" preserveAspectRatio="none" aria-hidden="true"><path d="M4 9 C 90 2, 180 12, 260 6 S 400 4, 436 8" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg><div class="lineup">%s</div><a class="box" href="%s">Shop nu</a></div></div>\n' % (
        ''.join('<img src="%s" alt="SSK-handschoen uit de customizer">' % CW[k] for k in ['zwart-goud', 'zalm-mint', 'curacao', 'cardinal', 'navy-columbia', 'roze-wit']), url('Handschoenen'))
    b += '<section><div class="w"><div class="tiles">%s</div>' % ''.join('<a class="tile" href="%s"><img src="%s" alt="" loading="lazy"><span class="box">%s</span></a>' % (url(n), i, n) for n, i in CATS)
    b += '<div class="wides"><a class="wd" href="%s"><img src="%s" alt="" loading="lazy"><img src="%s" alt="" loading="lazy"><span class="box">Outlet · tot 50%% korting</span></a><a class="wd" href="%s"><img src="%s" alt="" loading="lazy"><img src="%s" alt="" loading="lazy"><span class="box">Clubkleding · %d verenigingen</span></a></div></div></section>\n' % (url('Outlet'), CUT['helmet'], CUT['catcher'], url('Clubkleding'), CUT['ball'], CUT['glove'], CLUBS)
    b += '<section style="padding-top:0"><div class="w"><div class="bold"><h2>Kies je eigen kleuren</h2><div class="row">%s</div><ul class="hex"><li><i>20</i>Onderdelen te kleuren</li><li><i>4</i>Zijden om te draaien</li><li><i>Aa</i>Naam op de duim</li></ul><a class="box" href="%s">Open de Glove Customizer</a></div></div></section>\n' % (''.join('<img src="%s" alt="" loading="lazy">' % CW[k] for k in CW), CZ)
    b += '<section style="padding-top:0"><div class="w"><h2 class="t">Nieuw binnen</h2><p class="sub">%d nieuwe producten in de webshop</p><div class="grid">%s</div></div></section>\n' % (COUNT['new-arrivals'], ''.join(pc(p) for p in NEW))
    b += '<section class="story"><div class="w"><h2>Baseball, it\'s our game.</h2><p>SSK begon als een kleine winkel in Kyoto, Japan. Vandaag maakt SSK handschoenen met de hand, van premium leer, voor spelers over de hele wereld. In Kwintsheul vind je SSK Europe, samen met de andere topmerken in honkbal en softbal.</p></div></section>\n'
    b += '<section><div class="w"><h2 class="t">Outlet</h2><p class="sub">Op is op</p><div class="grid">%s</div></div></section>\n</main>\n' % ''.join(pc(p) for p in SALE)
    b += '<footer class="ftr"><div class="w"><div><h3>SSK Europe</h3><p>SSK European Baseball Center<br>Heulweg 128B, 2295 KK Kwintsheul<br>+31 174 501 888<br>info@sskeurope.com</p></div><div><h3>Shop</h3><ul>%s</ul></div><div><h3>Service</h3><ul>%s</ul></div><div><h3>Openingstijden</h3><table>%s</table></div></div></footer>\n' % (
        ''.join('<li><a href="%s">%s</a></li>' % (url(n), n) for n in ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Schoenen', 'Outlet']),
        ''.join('<li><a href="%s%s">%s</a></li>' % (SHOP, u, l) for l, u in [('Levertijden', '/Webwinkel-Page-1182239/Levertijden.html'), ('Retour zenden', '/Webwinkel-Page-1182445/Retour-Zenden.html'), ('Maten', '/Maten'), ('Garantie', '/Garantie')]) + '<li><a href="%s">Route plannen</a></li>' % MAPS, hours_rows())
    return b


# =====================================================================================================
# 4. HERITAGE — soft neutrals with one red, rounded cards, sentence-case type, round category photos
# =====================================================================================================
def heritage():
    css = """/* Layout: a large rounded hero card beside two smaller ones, round category photos, quiet carousels, an editorial story block */
:root{--bg:#ffffff;--fg:#171415;--muted:#6d6869;--soft:#f3f1f0;--on-soft:#171415;--line:#e4e0de;--accent:#c8102e;--red:#c8102e;--ink:#171415;--paper:#ffffff;
  --display:'Figtree','Helvetica Neue',Arial,sans-serif;--body:'Figtree','Helvetica Neue',Arial,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#141213;--fg:#f4f1f0;--muted:#a8a2a3;--soft:#ebe8e6;--line:#322e2f;--accent:#ff566a;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#141213;--fg:#f4f1f0;--muted:#a8a2a3;--soft:#ebe8e6;--line:#322e2f;--accent:#ff566a;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:400 16px/1.55 var(--body);-webkit-font-smoothing:antialiased}
.concept{background:var(--soft);color:var(--on-soft)}
.top{border-bottom:1px solid var(--line);font-size:13px;text-align:center;padding-block:9px}
.top a{text-decoration:underline;text-underline-offset:3px}
.hdr .w{display:flex;align-items:center;gap:28px;min-height:72px}
.logo{font:900 28px/1 var(--display);letter-spacing:-.03em}
.logo span{color:var(--accent)}
.nav{display:flex;gap:26px;font-weight:500}
.nav a{padding-block:6px;border-bottom:2px solid transparent}
.nav a:hover{border-bottom-color:var(--accent)}
.acts{margin-left:auto;display:flex;align-items:center;gap:20px;font-size:14px;font-weight:500}
.find{display:flex;align-items:center;gap:8px;min-width:190px;padding:6px 2px;border-bottom:1px solid var(--fg);color:var(--muted)}
.find:hover{color:var(--fg)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 22px;border-radius:4px;font-weight:700;font-size:15px;border:1px solid var(--ink);transition:background-color .2s,color .2s}
.btn.k{background:var(--ink);color:var(--paper)}
.btn.k:hover{background:var(--red);border-color:var(--red)}
.btn.o{background:transparent;color:var(--ink)}
.btn.o:hover{background:var(--ink);color:var(--paper)}
.btn.wh{background:var(--paper);color:var(--ink);border-color:var(--paper)}
.btn.t{background:var(--fg);color:var(--bg);border-color:var(--fg)}
.btn.t:hover{background:var(--accent);border-color:var(--accent);color:var(--paper)}
.hero{display:grid;grid-template-columns:2fr 1fr;gap:10px;padding-top:10px}
.card{position:relative;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(20px,3vw,40px)}
.card.main{background:var(--soft);color:var(--on-soft);min-height:clamp(420px,46vw,600px)}
.card.main img{position:absolute;right:-2%;top:50%;height:96%;transform:translateY(-50%) rotate(-4deg);filter:drop-shadow(0 34px 36px rgba(0,0,0,.2));transition:transform .8s cubic-bezier(.2,.8,.2,1)}
.card.main:hover img{transform:translateY(-52%) rotate(-1deg) scale(1.03)}
.card>*:not(img){position:relative}
.eyebrow{font-weight:700;font-size:13px;letter-spacing:.02em;color:var(--red)}
.card.main h1{font:800 clamp(34px,5vw,68px)/1 var(--display);letter-spacing:-.03em;max-width:9ch;margin:10px 0 12px}
.card.main p{max-width:30ch}
.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}
.side{display:grid;gap:10px}
.card.r{background:var(--red);color:var(--paper)}
.card.g{background:var(--ink);color:var(--paper)}
.card h2{font:800 clamp(22px,2.2vw,30px)/1.1 var(--display);letter-spacing:-.02em;max-width:13ch}
.card.r img,.card.g img{position:absolute;right:-10%;top:-12%;height:62%;transform:rotate(12deg);filter:drop-shadow(0 20px 22px rgba(0,0,0,.35))}
.card.r .btn,.card.g .btn{align-self:flex-start;margin-top:14px;height:40px}
section{padding-block:48px}
.sh{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:22px}
.sh h2{font:800 clamp(24px,2.6vw,34px)/1.1 var(--display);letter-spacing:-.02em}
.sh a{font-weight:700;text-decoration:underline;text-underline-offset:4px;white-space:nowrap}
.sh a:hover{color:var(--accent)}
.rounds{gap:clamp(14px,2.2vw,30px);padding-bottom:6px}
.round{flex:0 0 auto;width:clamp(96px,10.5vw,138px);text-align:center;font-weight:600;font-size:14px}
.round i{display:block;position:relative;aspect-ratio:1/1;border-radius:50%;background:var(--soft);overflow:hidden;margin-bottom:10px;transition:box-shadow .2s}
.round:hover i{box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--accent)}
.round img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:16%;mix-blend-mode:multiply;transition:transform .4s}
.round:hover img{transform:scale(1.1)}
.car.p{gap:14px}
.pc{flex:0 0 clamp(230px,23.5vw,310px);min-width:0}
.pc .im{aspect-ratio:1/1;background:var(--soft);border-radius:8px;overflow:hidden;position:relative}
.pc img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:9%;mix-blend-mode:multiply;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.pc:hover img{transform:scale(1.06)}
.pc .tx{display:grid;gap:2px;padding-top:12px}
.pc .new{color:var(--accent);font-weight:700;font-size:13px}
.pc b{font-weight:600;line-height:1.3}
.pc .br{color:var(--muted);font-size:14px}
.price{font-weight:700;margin-top:4px;font-variant-numeric:tabular-nums}
.price.sale{color:var(--accent)}
.price s{color:var(--muted);font-weight:400;margin-left:6px}
.arrows{display:flex;gap:8px}
.arrows button{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center}
.arrows button:hover{border-color:var(--fg)}
.story{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(20px,4vw,64px);align-items:center}
.story>div>h2{font:800 clamp(34px,5.2vw,72px)/.98 var(--display);letter-spacing:-.035em}
.story>div>h2 span{color:var(--accent)}
.stitch{height:0;border-top:3px dashed var(--accent);width:120px;margin:22px 0}
.story p{max-width:52ch;color:var(--muted);font-size:17px}
.story .card{background:var(--soft);color:var(--on-soft);min-height:380px}
.story .card{min-height:560px}
.story .card img{position:absolute;left:50%;top:5%;height:50%;transform:translateX(-50%);filter:drop-shadow(0 26px 26px rgba(0,0,0,.25))}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.grid .pc{flex:none}
.room{background:var(--soft);color:var(--on-soft)}
.room .w{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,5vw,80px);padding-block:56px}
.room h2{font:800 clamp(26px,3vw,40px)/1.05 var(--display);letter-spacing:-.02em;margin:8px 0 12px}
.room address{font-style:normal;margin-top:14px;line-height:1.8}
.room table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
.room th,.room td{padding:10px 0;border-bottom:1px solid #d9d4d1;text-align:left;font-weight:400}
.room td{text-align:right;font-weight:600}
.ftr .w{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:28px;padding-block:44px 20px}
.ftr h3{font-weight:700;font-size:15px;margin-bottom:12px}
.ftr li{margin-bottom:7px}
.ftr a,.ftr p{color:var(--muted)}
.ftr a:hover{color:var(--fg)}
.sub{border-top:1px solid var(--line);color:var(--muted);font-size:13px}
.sub .w{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-block:16px}
@media (max-width:980px){.nav{display:none}.hero{grid-template-columns:1fr}.side{grid-template-columns:1fr 1fr}.card.r,.card.g{min-height:220px}.grid{grid-template-columns:repeat(2,1fr)}.story,.room .w{grid-template-columns:1fr}.ftr .w{grid-template-columns:1fr 1fr}.find{min-width:0}}
@media (max-width:600px){.side{grid-template-columns:1fr}.card.main{min-height:0;padding-top:84%}.card.main img{width:74%;height:auto;top:16px;right:13%;transform:rotate(-4deg)}.card.main:hover img{transform:rotate(-4deg)}.acts .find span{display:none}.acts a:last-child{display:none}}
"""
    def pc(p, new=False):
        return ('<a class="pc" href="%s"><div class="im"><img src="%s" alt="%s" loading="lazy" width="480" height="480"></div><div class="tx">%s<b>%s</b><span class="br">%s</span>%s</div></a>'
                % (e(p['u']), p['i'], e(p['n']), '<span class="new">Nieuw</span>' if new else '', e(p['n']), e(p['b']), price(p)))
    b = head('SSK Concept Heritage', 'family=Figtree:wght@400;500;600;700;800;900', css)
    b += concept(4, 'Heritage')
    b += '<div class="top"><div class="w">Op voorraad binnen 3–5 werkdagen in huis · <a href="%s/Webwinkel-Page-1182239/Levertijden.html">Alle levertijden</a></div></div>\n' % SHOP
    b += '<header class="hdr"><div class="w"><a class="logo" href="%s">SSK<span>.</span>europe</a><nav class="nav" aria-label="Hoofdmenu">%s</nav><div class="acts"><a class="find" href="%s/website/index.php?Show=Search&KeyWord=handschoen"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>Zoek in de webshop</span></a><a href="%s/website/index.php?Show=WebShopBasket">Winkelwagen</a></div></div></header>\n' % (
        SHOP, ''.join('<a href="%s">%s</a>' % (url(n), l) for n, l in [('New Arrivals', 'Nieuw'), ('Handschoenen', 'Handschoenen'), ('Knuppels', 'Knuppels'), ('Schoenen', 'Schoenen'), ('Clubkleding', 'Clubkleding'), ('Outlet', 'Outlet')]), SHOP, SHOP)
    b += '<main>\n<div class="w"><div class="hero"><div class="card main"><img src="%s" alt="Rawlings Pro Preferred eerste-honkhandschoen in navy en rood" fetchpriority="high"><span class="eyebrow">Nieuw seizoen</span><h1>Gemaakt voor het spel.</h1><p>Handschoenen van SSK, Rawlings en Wilson. Kom ze passen in Kwintsheul of bestel online.</p><div class="btns"><a class="btn k" href="%s">Shop handschoenen</a><a class="btn o" href="%s">Shop knuppels</a></div></div>' % (CUT['glove'], url('Handschoenen'), url('Knuppels'))
    b += '<div class="side"><a class="card r" href="%s"><img src="%s" alt="" loading="lazy"><span style="font-weight:700;font-size:13px">Outlet</span><h2>Tot 50%% korting</h2><span class="btn wh">Bekijk de outlet</span></a><a class="card g" href="%s"><img src="%s" alt="" loading="lazy"><span class="eyebrow" style="color:inherit">Voor verenigingen</span><h2>Clubkleding voor %d clubs</h2><span class="btn wh">Zoek je club</span></a></div></div></div>\n' % (url('Outlet'), CUT['helmet'], url('Clubkleding'), CUT['ball'], CLUBS)
    b += '<section><div class="w"><div class="sh"><h2>Shop per categorie</h2></div><div class="car rounds">%s</div></div></section>\n' % ''.join('<a class="round" href="%s"><i><img src="%s" alt="" loading="lazy"></i>%s</a>' % (url(n), i, n) for n, i in CATS)
    b += '<section style="padding-top:0"><div class="w"><div class="sh"><h2>Net binnen</h2><div class="arrows"><button data-car="h1" data-dir="-1" aria-label="Vorige">%s</button><button data-car="h1" data-dir="1" aria-label="Volgende">%s</button></div></div><div class="car p" id="h1">%s</div></div></section>\n' % (BACK, ARROW, ''.join(pc(p, True) for p in NEW))
    b += '<section><div class="w"><div class="story"><div><span class="eyebrow">Sinds Kyoto, Japan</span><h2>Baseball, it\'s <span>our game.</span></h2><div class="stitch"></div><p>SSK begon als een kleine winkel in Kyoto. Vandaag maakt SSK handschoenen met de hand, van premium leer, voor spelers over de hele wereld. In Kwintsheul vind je SSK Europe, samen met de andere topmerken in honkbal en softbal.</p></div><a class="card" href="%s"><img src="%s" alt="SSK Pro Custom handschoen in navy en columbia-blauw" loading="lazy"><span class="eyebrow">Glove Customizer</span><h2>Ontwerp je eigen SSK Pro Custom</h2><p style="margin-top:6px">Twintig onderdelen in jouw kleuren, je naam op de duim. Vanaf € 374,95.</p><span class="btn k" style="align-self:flex-start;margin-top:14px;height:40px">Start met ontwerpen</span></a></div></div></section>\n' % (CZ, CW['navy-columbia'])
    b += '<section style="padding-top:0"><div class="w"><div class="sh"><h2>Knuppels 2026</h2><a href="%s">Alle knuppels</a></div><div class="grid">%s</div></div></section>\n' % (url('Knuppels'), ''.join(pc(p) for p in BATS))
    b += '<section style="padding-top:0"><div class="w"><div class="sh"><h2>Aanbiedingen</h2><a href="%s">Alles in de outlet</a></div><div class="grid">%s</div></div></section>\n' % (url('Outlet'), ''.join(pc(p) for p in SALE))
    b += '<div class="room"><div class="w"><div><span class="eyebrow">Showroom</span><h2>Handschoenen moet je passen.</h2><p>In de showroom van het SSK European Baseball Center vind je de complete collectie.</p><address>Heulweg 128B, 2295 KK Kwintsheul<br>+31 174 501 888<br>info@sskeurope.com</address><div class="btns"><a class="btn k" href="%s">Route plannen</a></div></div><table><caption class="sr">Openingstijden</caption>%s</table></div></div>\n</main>\n' % (MAPS, hours_rows())
    b += '<footer class="ftr"><div class="w"><div><div class="logo" style="margin-bottom:12px">SSK<span>.</span>europe</div><p>Honkbal en softbal voor spelers, teams en verenigingen.</p></div><div><h3>Shop</h3><ul>%s</ul></div><div><h3>Service</h3><ul>%s</ul></div><div><h3>Voor clubs</h3><ul>%s</ul></div></div><div class="sub"><div class="w"><span>© 2026 SSK Europe</span><span>Heulweg 128B, 2295 KK Kwintsheul</span></div></div></footer>\n' % (
        ''.join('<li><a href="%s">%s</a></li>' % (url(n), n) for n in ['Handschoenen', 'Knuppels', 'Ballen', 'Helmen', 'Tassen']),
        ''.join('<li><a href="%s%s">%s</a></li>' % (SHOP, u, l) for l, u in [('Levertijden', '/Webwinkel-Page-1182239/Levertijden.html'), ('Retour zenden', '/Webwinkel-Page-1182445/Retour-Zenden.html'), ('Maten', '/Maten'), ('Garantie', '/Garantie')]),
        ''.join('<li><a href="%s%s">%s</a></li>' % (SHOP, u, l) for l, u in [('Clubkleding', NAV['Clubkleding']), ('Bedrukken en borduren', '/3d-borduring'), ('Scheidsrechter', NAV['Scheidsrechter'])]))
    return b + CAR_JS


PAGES = [('1-clean.html', clean), ('2-performance.html', performance), ('3-game-ready.html', game_ready), ('4-heritage.html', heritage)]
if __name__ == '__main__':
    for name, fn in PAGES:
        text = fn()
        open(os.path.join(HERE, name), 'w', encoding='utf-8').write(text)
        print('built stijlen/%s  %d kB' % (name, len(text) // 1024))
    print(len(os.listdir(IMG)), 'photos in stijlen/img')
