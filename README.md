# SSK Europe website redesigns

Five homepage layouts for [sskeurope.ccvshop.nl](https://sskeurope.ccvshop.nl/), all built on the SSK Europe design system: the SSK colours black, white and red `#C8102E` (red as the action colour), Barlow Condensed headings, Barlow body text, IBM Plex Mono prices, 3/6px radii, a 1200px container and the dashed red stitch line once per page. The versions share one stylesheet and one set of components and differ only in layout.

Every version keeps the content of the current shop: all 17 categories, new arrivals, balls, outlet, club apparel and printing with lead times, the Hoofdklasse Holland Series 2026, brands, the showroom with opening hours, and the full footer. Each one gives the glove customiser a prominent spot and button. The customiser itself is not changed.

Open `concepts/index.html` for an overview of the five earlier versions, or open any file in `concepts/` on its own. Every file is self-contained (fonts load from Google Fonts), so it can be emailed or opened straight from disk.

| # | Version | Layout |
|---|---------|--------|
| 01 | Klassiek | Split hero with a featured glove, category tiles, customiser block mid-page |
| 02 | Customizer voorop | Customiser as the hero, all categories as buttons below |
| 03 | Catalogus | Shop layout with a sticky category sidebar and a customiser card |
| 04 | Rustig | White header, lots of whitespace, products in tabs |
| 05 | Promoraster | Large customiser tile next to New Arrivals and Outlet tiles |

## Homepage versie 2 (gekozen richting)

`index.html` is version 02 "Customizer voorop" worked out as a complete homepage:

- **Hero:** the glove customiser, shown with real renders taken from it. Nine starter colourways crossfade on their own; the swatches switch them, and "Open met deze kleuren" opens the customiser with that glove already loaded. The glove tilts towards the pointer.
- **Shop per categorie:** a photo grid with real product photos, plus buttons for the other categories.
- **Nieuw binnen:** a drag-to-scroll rail with eleven new gloves and a customiser card at the end.
- **In zeven stappen:** a walkthrough of the customiser with a real screenshot of each step. On a computer the screenshot stays in place while you scroll through the steps.
- **Uitgelicht:** tabs for 2026 bats, helmets, balls and outlet.
- **Heritage, club apparel, Holland Series, showroom** (with a live open/closed label, route and call buttons), **brands** and the footer.

Motion: line-by-line title reveal, scroll reveals, a red stitch scroll bar, marquees, magnetic buttons and a sticky "Ontwerp je handschoen" button on phones. Everything respects *reduce motion*.

Every product shown is a real product from the shop, with its real name, price, link and photo. Every button and link goes somewhere real: shop categories, shop pages, search (it searches the shop), account, cart, Google Maps, phone, e-mail and the customiser. The heritage line "Baseball, it's our game." comes from SSK's US site, sskbaseballshop.com.

### Customiser

The customiser is `scottprins32-hub/ssk-glove-demo`, live at https://scottprins32-hub.github.io/ssk-glove-demo/ (`CUSTOMIZER_URL` in `src/data.js`). `assets/customizer/` holds what was captured from it: `glove-*.webp` (a transparent render of each starter glove), `step-1.webp` … `step-7.webp` (a screenshot of each step, in Dutch) and `og.jpg` (the share image). The share link for each starter (`CZ_LINKS` in `src/data.js`) was made with the customiser's own Share button.

### Product photos

Copies live in `assets/products/`. `scripts/fetch_photos.py` downloads any that are missing; the *Product photos* GitHub Action runs it whenever `src/data.js` changes. If a copy is missing, the page loads the photo from the live shop instead.

### GitHub Pages

Turn it on once in the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**. The site is then at https://scottprins32-hub.github.io/SSK-website/. On a free GitHub plan, Pages only works for public repositories.

## Placeholders

- **Logo:** the design system uses a text wordmark ("SSK EUROPE"), so the pages do too.

## Editing

`src/base.css` holds the design tokens and components, `src/ui.js` the shared header, cards, customiser block, showroom and footer, `src/data.js` the content, and `src/home.css` / `src/home.js` the layout and motion of the version 2 homepage. Edit `src/`, then run `python3 build.py` to rebuild `index.html` and the files in `concepts/`.
