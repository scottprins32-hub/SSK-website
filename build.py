"""Build the standalone pages from src/.

src/v2-homepage.html -> index.html (the chosen version 2, served by GitHub Pages)
src/0*.html          -> concepts/ (the five earlier versions)
"""
import glob, os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
rd = lambda f: open(os.path.join(src, f), encoding='utf-8').read()
css, js, head = rd('base.css'), rd('data.js') + '\n' + rd('ui.js'), rd('head.html')

def build(f, dest, assets):
    page = open(f, encoding='utf-8').read()
    title, body = page.split('\n', 1)
    html = head.replace('{{TITLE}}', title.strip()).replace('/*CSS*/', css) + body.replace('/*DATA*/', js.replace('/*ASSETS*/', assets))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(html)
    print('built', os.path.relpath(dest, here))

build(os.path.join(src, 'v2-homepage.html'), os.path.join(here, 'index.html'), '')
for f in sorted(glob.glob(os.path.join(src, '0*.html'))):
    build(f, os.path.join(here, 'concepts', os.path.basename(f)), '../')
