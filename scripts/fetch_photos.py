"""Download the product photos listed in src/data.js into assets/products/<id>.jpg.

Runs in GitHub Actions (.github/workflows/product-photos.yml), because the shop is reachable there.
Photos are flattened on white and resized to 800px wide so the pages stay light.
"""
import io, os, re, sys, urllib.request
from PIL import Image

here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REMOTE = 'https://sskeurope.ccvshop.nl/Files/2/81000/81585/ProductPhotos/1200x630/'
out = os.path.join(here, 'assets', 'products')
os.makedirs(out, exist_ok=True)
data = open(os.path.join(here, 'src', 'data.js'), encoding='utf-8').read()
names = sorted(set(re.findall(r"PH \+ '([0-9]+\.(?:png|jpg|jpeg))'", data)))
failed = []
for n in names:
    dest = os.path.join(out, os.path.splitext(n)[0] + '.jpg')
    if os.path.exists(dest):
        continue
    try:
        req = urllib.request.Request(REMOTE + n, headers={'User-Agent': 'Mozilla/5.0 (photo sync)'})
        raw = urllib.request.urlopen(req, timeout=30).read()
        im = Image.open(io.BytesIO(raw))
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        if bg.width > 800:
            bg = bg.resize((800, round(bg.height * 800 / bg.width)), Image.LANCZOS)
        bg.save(dest, 'JPEG', quality=85, optimize=True, progressive=True)
        print('saved', n, '->', os.path.basename(dest), os.path.getsize(dest), 'bytes')
    except Exception as e:
        failed.append(n)
        print('FAILED', n, e)
print(len(names), 'photos listed,', len(failed), 'failed')
sys.exit(1 if failed else 0)
