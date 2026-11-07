"""Build the standalone pages from src/.

src/v2-homepage.html (+ home.css, home.js)          -> index.html (the chosen version 2, served by GitHub Pages)
src/category.html (+ cat.css, cat.js, catalog/*.json) -> <slug>/index.html, one page per category
src/0*.html                                         -> concepts/ (the five earlier versions)
"""
import glob, html as H, json, os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
css, js, head = rd('base.css'), rd('data.js') + '\n' + rd('ui.js'), rd('head.html')
home_css, home_js = rd('home.css'), rd('home.js')
cat_css, cat_js, cat_tpl = rd('cat.css'), rd('cat.js'), rd('category.html')


def page(text, assets, extra=None):
    title, body = text.split('\n', 1)
    body = body.replace('/*DATA*/', js.replace('/*ASSETS*/', assets)).replace('/*HOME_CSS*/', home_css).replace('/*HOME_JS*/', home_js)
    for k, v in (extra or {}).items():
        body = body.replace(k, v)
    return head.replace('{{TITLE}}', H.escape(title.strip(), quote=False)).replace('/*CSS*/', css) + body


def write(dest, text):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(text)
    print('built', os.path.relpath(dest, here))


write(os.path.join(here, 'index.html'), page(rd('v2-homepage.html'), ''))

for f in sorted(glob.glob(os.path.join(src, 'catalog', '*.json'))):
    cat = json.load(open(f, encoding='utf-8'))
    data = json.dumps(cat, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    text = cat_tpl.replace('{{CAT_NAME}}', H.escape(cat['name'])).replace('{{CAT_COUNT}}', str(cat['count']))
    write(os.path.join(here, cat['slug'], 'index.html'),
          page(text, '../', {'/*CAT_CSS*/': cat_css, '/*CAT_JS*/': cat_js, '/*CAT_JSON*/': data}))

for f in sorted(glob.glob(os.path.join(src, '0*.html'))):
    write(os.path.join(here, 'concepts', os.path.basename(f)), page(open(f, encoding='utf-8').read(), '../'))
