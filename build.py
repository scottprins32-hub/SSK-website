"""Build the standalone pages from src/.

src/v2-homepage.html (+ home.css, home.js)          -> index.html (the chosen version 2, served by GitHub Pages)
src/category.html (+ cat.css, cat.js, catalog/*.json) -> <slug>/index.html, one page per category
src/0*.html                                         -> concepts/ (the five earlier versions)
"""
import glob, html as H, json, os, re
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
css, js, head = rd('base.css'), rd('data.js') + '\n' + rd('ui.js'), rd('head.html')
home_css, home_js = rd('home.css'), rd('home.js')
cat_css, cat_js, cat_tpl = rd('cat.css'), rd('cat.js'), rd('category.html')
theme_css = rd('theme.css')  # light and dark themes, last so they win over every page style


def page(text, assets, extra=None):
    title, body = text.split('\n', 1)
    body = body.replace('/*DATA*/', js.replace('/*ASSETS*/', assets)).replace('/*HOME_CSS*/', home_css).replace('/*HOME_JS*/', home_js)
    for k, v in (extra or {}).items():
        body = body.replace(k, v)
    out = head.replace('{{TITLE}}', H.escape(title.strip(), quote=False)).replace('{{ASSETS}}', assets).replace('/*CSS*/', css) + body
    # Theme styles go last in <head>, after the page's own styles, so they win and apply before the first paint.
    return out.replace('</head>', '<style>\n' + theme_css + '\n</style>\n</head>', 1)


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
    urls = []
    for p in hero[:1] + ps[:4] + hero[1:]:
        u = '../' + p['t'] if p.get('t') else p.get('i')
        if u and u not in urls:
            urls.append(u)
    return '\n'.join('<link rel="preload" as="image" href="%s"%s>' % (H.escape(u), ' fetchpriority="high"' if i < 2 else '') for i, u in enumerate(urls))


def write(dest, text):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(text)
    print('built', os.path.relpath(dest, here))


write(os.path.join(here, 'index.html'), page(rd('v2-homepage.html'), ''))

for f in sorted(glob.glob(os.path.join(src, 'catalog', '*.json'))):
    cat = json.load(open(f, encoding='utf-8'))
    data = json.dumps(cat, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    text = cat_tpl.replace('{{CAT_NAME}}', H.escape(cat['name'])).replace('{{CAT_COUNT}}', str(cat['count'])).replace('{{PRELOAD}}', preloads(cat))
    write(os.path.join(here, cat['slug'], 'index.html'),
          page(text, '../', {'/*CAT_CSS*/': cat_css, '/*CAT_JS*/': cat_js, '/*CAT_JSON*/': data}))

for f in sorted(glob.glob(os.path.join(src, '0*.html'))):
    write(os.path.join(here, 'concepts', os.path.basename(f)), page(open(f, encoding='utf-8').read(), '../'))
