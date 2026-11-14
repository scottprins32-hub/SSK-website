"""Build the standalone pages from src/.

src/v2-homepage.html (+ home.css, home.js)          -> index.html (the chosen version 2, served by GitHub Pages)
src/category.html (+ cat.css, cat.js, catalog/*.json) -> <slug>/index.html, one page per category
src/0*.html                                         -> concepts/ (the five earlier versions)
"""
import base64, glob, html as H, json, os, re
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
try:  # smaller pages when the minifiers are installed (pip install rjsmin rcssmin); the site builds the same without
    import rcssmin, rjsmin
    mincss, minjs = rcssmin.cssmin, rjsmin.jsmin
except ImportError:
    mincss = minjs = lambda t: t
_rd = rd
rd = lambda f: mincss(_rd(f)) if f.endswith('.css') else minjs(_rd(f)) if f.endswith('.js') else _rd(f)
css, js, head = rd('base.css'), rd('data.js') + ';\n' + rd('ui.js'), rd('head.html')
home_css, home_js = rd('home.css'), rd('home.js')
cat_css, cat_js, cat_tpl = rd('cat.css'), rd('cat.js'), rd('category.html')
theme_css = rd('theme.css')  # light and dark themes, last so they win over every page style
catimg = {}  # slug -> the first locally stored product photo of that category, for the round category photos
for f in sorted(glob.glob(os.path.join(src, 'catalog', '*.json'))):
    c = json.load(open(f, encoding='utf-8'))
    catimg[c['slug']] = next((p['t'] for p in c['products'] if p.get('t')), '')
js = 'window.SSK_CATIMG=' + json.dumps(catimg, separators=(',', ':')) + ';\n' + js
perf_css, motion_js = rd('perf.css'), rd('motion.js')  # the Performance mix: homepage and category pages only


def page(text, assets, extra=None, perf=False):
    title, body = text.split('\n', 1)
    body = body.replace('/*DATA*/', js.replace('/*ASSETS*/', assets)).replace('/*HOME_CSS*/', home_css).replace('/*HOME_JS*/', home_js)
    for k, v in (extra or {}).items():
        body = body.replace(k, v)
    body = body.replace('/*MOTION_JS*/', motion_js)
    out = head.replace('{{TITLE}}', H.escape(title.strip(), quote=False)).replace('{{HEADFONT}}', 'archivo-wide-900' if perf else 'barlow-condensed-800').replace('{{ASSETS}}', assets).replace('/*CSS*/', css) + body
    # Theme styles go last in <head>, after the page's own styles, so they win and apply before the first paint.
    return out.replace('</head>', '<style>\n' + (perf_css + '\n' if perf else '') + theme_css + '\n</style>\n</head>', 1)


def preloads(cat):
    """Preload the hero photos and the first row of products, so the browser fetches them while it reads
    the page instead of after the script has drawn it. Mirrors the hero pick in src/cat.js."""
    ps = [dict(p, k=k, off=round((1 - p['p'] / p['w']) * 100) if p.get('w') else 0) for k, p in enumerate(cat['products'])]
    pool = sorted(ps, key=lambda p: (-p['off'], p['k'])) if re.search('korting|outlet', cat['name'], re.I) else ps
    pool = [p for p in pool if p.get('i')]
    seen, hero = set(), []
    for p in pool:
        key = p['s'][0] if p.get('s') else p.get('b', '') + str(p['k'])
        if key not in seen:
            seen.add(key); hero.append(p)
        if len(hero) == 3:
            break
    urls, wide = [], set()  # wide: only needed where four products fit in a row, so a phone skips them
    for k, p in enumerate(hero[:1] + ps[:2] + hero[1:] + ps[2:4]):
        u = '../' + p['t'] if p.get('t') else p.get('i')
        if u and u not in urls:
            urls.append(u)
            if k >= 5:
                wide.add(u)
    return '\n'.join('<link rel="preload" as="image" href="%s"%s%s>' % (H.escape(u), ' fetchpriority="high"' if i < 2 else '', ' media="(min-width:700px)"' if u in wide else '') for i, u in enumerate(urls))


def write(dest, text):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(text)
    print('built', os.path.relpath(dest, here))


count = lambda slug: json.load(open(os.path.join(src, 'catalog', slug + '.json'), encoding='utf-8'))
hero_ids = re.findall(r"'(\d{8,12})', '#", _rd('home.js'))  # the hero products, in order (see HERO in src/home.js)
hero_pre = '<link rel="preload" as="image" href="assets/hero/%s.webp" fetchpriority="high">\n' % hero_ids[0]
# The small photos of the hero picker go into the page as data, so the first screen needs six requests fewer.
hero_th = {i: 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(here, 'assets', 'hero', i + '-s.webp'), 'rb').read()).decode() for i in hero_ids}
home = rd('v2-homepage.html').replace('<meta name="theme-color"', hero_pre + '<meta name="theme-color"', 1).replace('/*HOME_JS*/', 'window.SSK_HEROTH=' + json.dumps(hero_th, separators=(',', ':')) + ';\n/*HOME_JS*/', 1).replace('{{N_GLOVES}}', str(count('handschoenen')['count'])).replace('{{N_BATS}}', str(count('knuppels')['count'])).replace('{{N_CLUBS}}', str(len(count('clubkleding')['subs'])))
write(os.path.join(here, 'index.html'), page(home, '', perf=True))

for f in sorted(glob.glob(os.path.join(src, 'catalog', '*.json'))):
    cat = json.load(open(f, encoding='utf-8'))
    data = json.dumps(cat, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    text = cat_tpl.replace('{{CAT_NAME}}', H.escape(cat['name'])).replace('{{CAT_COUNT}}', str(cat['count'])).replace('{{PRELOAD}}', preloads(cat))
    write(os.path.join(here, cat['slug'], 'index.html'),
          page(text, '../', {'/*CAT_CSS*/': cat_css, '/*CAT_JS*/': cat_js, '/*CAT_JSON*/': data}, perf=True))

for f in sorted(glob.glob(os.path.join(src, '0*.html'))):
    write(os.path.join(here, 'concepts', os.path.basename(f)), page(open(f, encoding='utf-8').read(), '../'))
