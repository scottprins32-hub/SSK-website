"""Copy the photos a category page shows first into assets/thumbs/, small and same-origin.

The first screen of every category page (the first 32 products in the default order, plus the
three biggest discounts that sale pages show in their hero) then loads from this site instead of
the shop's server, which keeps those pages under half a second. Every other photo still loads
from the shop when it is needed. Run after scripts/fetch_catalog.py; it marks each copied product
with "t" in src/catalog/<slug>.json and removes thumbnails no category uses any more.
"""
import glob, io, json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(here, 'assets', 'thumbs')
FIRST, SIZE, QUALITY = 32, 400, 72
FORCE = '--force' in sys.argv  # make every thumbnail again, e.g. after changing SIZE or QUALITY


DONE = set()


def thumb(url):
    m = re.search(r'/(\d+)\.(?:png|jpe?g)(?:\.webp)?$', url)
    if not m:
        return None
    rel = 'assets/thumbs/%s.webp' % m.group(1)
    dest = os.path.join(here, rel)
    if os.path.exists(dest) and not (FORCE and rel not in DONE):
        return rel
    try:
        raw = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (SSK thumbnails)'}), timeout=40).read()
        im = Image.open(io.BytesIO(raw)).convert('RGBA')
        im.thumbnail((SIZE, SIZE), Image.LANCZOS)
        im.save(dest, 'WEBP', quality=QUALITY, method=6)
        DONE.add(rel)
        return rel
    except Exception as e:
        print('  FAILED', url, e)
        return None


def main():
    os.makedirs(OUT, exist_ok=True)
    used = set()
    for f in sorted(glob.glob(os.path.join(here, 'src', 'catalog', '*.json'))):
        cat = json.load(open(f, encoding='utf-8'))
        ps = cat['products']
        pick = ps[:FIRST] + sorted([p for p in ps if p.get('w')], key=lambda p: p['p'] / p['w'])[:3]
        # The hero shows three products from different subcategories (same rule as src/cat.js).
        seen = set()
        for k, p in enumerate(ps):
            key = p['s'][0] if p.get('s') else (p.get('b', ''), k)
            if p.get('i') and key not in seen:
                seen.add(key); pick.append(p)
            if len(seen) == 3:
                break
        jobs = [p for p in pick if p.get('i')]
        with ThreadPoolExecutor(8) as ex:
            for p, rel in zip(jobs, ex.map(lambda p: thumb(p['i']), jobs)):
                if rel:
                    p['t'] = rel; used.add(rel)
        for p in ps:
            if p not in pick:
                p.pop('t', None)
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(cat, fh, ensure_ascii=False, separators=(',', ':'))
        print('%-34s %d thumbnails' % (cat['name'], sum(1 for p in ps if p.get('t'))))
    for old in glob.glob(os.path.join(OUT, '*.webp')):
        if 'assets/thumbs/' + os.path.basename(old) not in used:
            os.remove(old)
    total = sum(os.path.getsize(x) for x in glob.glob(os.path.join(OUT, '*.webp')))
    print(len(used), 'thumbnails,', total // 1024, 'kB')


if __name__ == '__main__':
    main()
