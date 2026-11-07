"""Fetch every product of every category from the live shop into src/catalog/<slug>.json.

For each category in src/data.js (NAV) this reads all result pages, the subcategories the shop
lists for it and which products sit in each subcategory. Product photos stay on the shop's own
server (its 620x620 WebP thumbnails), so nothing heavy is copied into the repo.

Run: python3 scripts/fetch_catalog.py            (all categories)
     python3 scripts/fetch_catalog.py Handschoenen (one category)
"""
import html, json, os, re, sys, time, unicodedata, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor

here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = 'https://sskeurope.ccvshop.nl'
OUT = os.path.join(here, 'src', 'catalog')
UA = {'User-Agent': 'Mozilla/5.0 (SSK catalogue sync)'}
# Brands spelled the way the shop spells them; the first one found at the start of a name wins.
BRANDS = ['Louisville Slugger', 'Baseball Nordics', 'Under Armour', 'All-Star', 'All Star', 'Victus', 'Marucci', 'Mizuno',
          'Rawlings', 'Wilson', 'Easton', 'DeMarini', 'Champro', 'Evoshield', 'EvoShield', 'SSK', 'Nike', 'Franklin',
          'Akadema', '44 Pro', 'Diamond', 'Worth', 'Miken', 'Boombah', 'Lizard Skins', 'Pine Tar', 'Axe', 'Mattingly',
          'Adidas', 'New Balance', 'Jugs', 'Bownet', 'Sklz', 'SKLZ', 'Zett', 'Hatakeyama', 'Kubota Slugger', 'Old Hickory',
          'Teamwear', 'Stinger', 'Pure', 'Holland']


def get(url, tries=3):
    # Shop links can hold HTML entities (&amp;) and accents (Biënto): unescape, then percent-encode.
    url = urllib.parse.quote(html.unescape(url), safe=':/?&=%#+,;@')
    for k in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read().decode('utf-8', 'ignore')
        except Exception as e:
            if k == tries - 1:
                print('  FAILED', url, e); return ''
            time.sleep(2 * (k + 1))


def slug(name):
    s = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def brand_of(name):
    low = name.lower()
    for b in BRANDS:
        if low.startswith(b.lower() + ' ') or re.search(r'[\s-]' + re.escape(b.lower()) + r'\s', ' ' + low[:40]):
            return {'EvoShield': 'Evoshield', 'All Star': 'All-Star', 'SKLZ': 'Sklz'}.get(b, b)
    return ''


def money(t):
    t = html.unescape(t).replace('\xa0', ' ')
    m = re.search(r'([0-9.]+,[0-9]{2}|[0-9]+)', t.replace('.', '') if ',' in t else t)
    return float(m.group(1).replace(',', '.')) if m else 0.0


def parse_products(page):
    out = []
    # Category pages use a landscape card, subcategory pages a portrait one.
    for blk in re.split(r'class=" product-block-(?:landscape|portrait)"', page)[1:]:
        u = re.search(r'class="product__name[^"]*" href="([^"]+)">(.*?)</a>', blk, re.S)
        if not u:
            continue
        imgs = re.findall(r'data-src="([^"]+/ProductPhotos/[^"]+)"', blk)
        old = re.search(r'product__price--old[^>]*>(.*?)<', blk, re.S)
        new = re.search(r'product__price--new[^>]*>(.*?)<', blk, re.S)
        cur = re.search(r'class="product__price ?"[^>]*>(.*?)<', blk, re.S)
        lab = re.search(r'discount__perc[^>]*>(.*?)<', blk, re.S)
        name = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', u.group(2)))).strip()
        price = money(new.group(1)) if new else (money(cur.group(1)) if cur else 0.0)
        p = {'n': name, 'u': u.group(1), 'p': price, 'b': brand_of(name)}
        if old:
            p['w'] = money(old.group(1))
        if lab:
            p['d'] = re.sub(r'\s+', '', html.unescape(lab.group(1)))
        if imgs:
            p['i'] = imgs[0].replace('//Files', '/Files') + '.webp'
        if len(imgs) > 1:
            p['j'] = imgs[1].replace('//Files', '/Files') + '.webp'
        out.append(p)
    return out


def list_all(url):
    """All products of a category or subcategory, following ?page=N until nothing new comes back."""
    seen, items, n, first = set(), [], 1, ''
    while n < 40:
        page = get(url + ('&' if '?' in url else '?') + 'page=%d' % n) if n > 1 else get(url)
        if n == 1:
            first = page
        new = [p for p in parse_products(page) if p['u'] not in seen]
        if not new:
            break
        for p in new:
            seen.add(p['u']); items.append(p)
        if 'page=%d' % (n + 1) not in page:
            break
        n += 1
    return items, first


MEGA = {}


def mega_menu():
    """The shop's mega menu: top category URL -> its subcategories. Read once from the home page."""
    if MEGA:
        return MEGA
    page = get(BASE + '/')
    for blk in page.split('navbar__mega-block"')[1:]:
        blk = blk.split('navbar__mega-block"')[0]
        top = re.search(r'class="navbar__mega-item" href="([^"]+)"', blk)
        if not top:
            continue
        subs = []
        for href, label in re.findall(r'class="navbar__mega-subitem" href="([^"]+)"[^>]*>(.*?)</a>', blk, re.S):
            label = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', label))).strip()
            href = href if href.startswith('http') else BASE + href
            if label and href not in [s['url'] for s in subs]:
                subs.append({'name': label, 'url': href})
        MEGA[top.group(1)] = subs
    return MEGA


def cat_id(url):
    m = re.search(r'Category-(\d+)', url)
    return m.group(1) if m else url.rstrip('/').lower()


def subcats(url):
    for top, subs in mega_menu().items():
        if cat_id(top) == cat_id(url):
            return subs
    return []


def nav_categories():
    data = open(os.path.join(here, 'src', 'data.js'), encoding='utf-8').read()
    block = data[data.index('const NAV = ['):data.index('].map(([name, icon, url, sub])')]
    return [(n, u if u.startswith('http') else BASE + u) for n, _, u, _ in re.findall(r"\['([^']+)', '([^']+)', '([^']+)', '([^']*)'\]", block)]


def fetch(name, url):
    t0 = time.time()
    products, first = list_all(url)
    subs = subcats(url)
    def sub_items(s):
        items, _ = list_all(s['url'])
        return s, {p['u'] for p in items}
    with ThreadPoolExecutor(4) as ex:
        tagged = list(ex.map(sub_items, subs))
    index = {p['u']: p for p in products}
    for k, (s, urls) in enumerate(tagged):
        s['n'] = len(urls)
        for u in urls:
            if u in index:
                index[u].setdefault('s', []).append(k)
    subs = [s for s in subs if s['n']]
    # Re-number sub indexes after dropping empty subcategories.
    keep = {id(s): i for i, s in enumerate(subs)}
    old = [s for s, _ in tagged]
    for p in products:
        if 's' in p:
            p['s'] = sorted({keep[id(old[k])] for k in p['s'] if id(old[k]) in keep})
            if not p['s']:
                del p['s']
    out = {'name': name, 'slug': slug(name), 'shop': url, 'count': len(products), 'fetched': time.strftime('%Y-%m-%d'),
           'subs': [{'name': s['name'], 'url': s['url'], 'n': s['n']} for s in subs], 'products': products}
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, out['slug'] + '.json'), 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',', ':'))
    print('%-34s %4d products %3d subcategories  %.0fs' % (name, len(products), len(subs), time.time() - t0))
    return out


if __name__ == '__main__':
    want = set(sys.argv[1:])
    cats = [c for c in nav_categories() if not want or c[0] in want]
    for name, url in cats:
        fetch(name, url)
