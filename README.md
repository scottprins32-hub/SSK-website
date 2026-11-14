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

- **Hero:** the shop first. Six new products from the shop (gloves, a 2026 bat, a helmet, the SSK ball) cycle on their own, each with its name, price and a link; thumbnails switch them. The cut-outs in `assets/hero/` are the shop's own product photos with their transparent background kept.
- **Shop per categorie:** a photo grid with real product photos, plus buttons for the other categories.
- **Nieuw binnen:** a drag-to-scroll rail with eleven new gloves and a customiser card at the end.
- **Uitgelicht:** tabs for 2026 bats, helmets, balls and outlet.
- **Glove Customizer:** one compact block after the shop: the seven steps next to a real screenshot of each, which play on their own and open the customiser when clicked. Kept secondary on purpose (feedback from Pim: the custom gloves were too much in the foreground).
- **Heritage, club apparel, Holland Series, showroom** (with a live open/closed label, route and call buttons), **brands** and the footer.

Motion: line-by-line title reveal, scroll reveals, a red stitch scroll bar, marquees, magnetic buttons and Everything respects *reduce motion*.

Every product shown is a real product from the shop, with its real name, price, link and photo. Every button and link goes somewhere real: shop categories, shop pages, search (it searches the shop), account, cart, Google Maps, phone, e-mail and the customiser. The heritage line "Baseball, it's our game." comes from SSK's US site, sskbaseballshop.com.

### Category pages

Every category has its own page: `handschoenen/`, `knuppels/`, `ballen/`, `helmen/` and so on, 17 in all, linked from the menu, the homepage and the search. Each page lists every product of that category in the shop, with its real name, price, sale price and photo, and links each product to the shop, where it is bought.

- **Hero:** the category name, the number of products, the main brands, buttons for the subcategories (or a "Kies je vereniging" list for Clubkleding) and three floating product photos.
- **Filters:** subcategory, brand (with live counts), a price slider, "alleen aanbiedingen" and a search within the category. Sorting by price, discount or name. On phones the filters open as a panel.
- **Shareable:** the filters live in the address, so `handschoenen/?merk=Wilson&sub=catcher-handschoenen` opens exactly that selection.
- **Grid:** 24 products at a time with "Toon meer"; the second product photo shows on hover; 3 or 4 per row on large screens.

The products come from `src/catalog/<slug>.json`, written by `scripts/fetch_catalog.py`, which reads every page and subcategory of each category in the shop. Photos load from the shop's own 620×620 thumbnails. The *Catalogue* GitHub Action runs it every Monday (or on demand from the Actions tab), rebuilds the pages and commits the result, so prices stay current.

### Performance mix

The live site is the homepage and category pages above, restyled with the Performance concept from `stijlen/`: wide black capitals for every heading (one small self-hosted font file, `assets/fonts/archivo-wide-900.woff2`), hard edges, a red diagonal in the hero, a stats bar with counters, black label bars on the category tiles and flush tags on the product cards. `src/perf.css` holds the look and `src/motion.js` the movement; `build.py` adds both to the homepage and the category pages only.

Motion: the red diagonal opens the page by sweeping back from full width while the headline slams in line by line; hero products change with a diagonal wipe and a white stripe crossing the slab; the counters run when the stats bar comes into view; marquees and the big heritage type lean and speed up with the scroll speed; section rules draw themselves; the dark sections arrive with a slanted edge that straightens; product cards tilt towards the pointer and show a red corner; category tiles fill red on hover; a red pointer label says what a click does; and going from one page to the next wipes the new page in on the diagonal. All of it is off with *reduce motion*.

### Themes

A picker in the header switches between **Licht** (the whole site light), **Standaard** (the original look: black header and hero, light content) and **Donker** (the whole site dark). The choice is remembered per visitor and applied before the first paint; switching reveals the new theme in a circle from the button. On phones the picker is one button that steps through the three. The themes live in `src/theme.css`, which `build.py` adds last on every page.

### Product photos

Every product photo sits on a soft studio spotlight with a contact shadow underneath; white photo backgrounds melt into it, colours get a little more saturation, and on hover the product lifts. In the dark theme the photos keep their light stage, so they stand out against the dark page.

### Speed

Fonts are hosted with the site (`assets/fonts/`, preloaded), so nothing waits on Google. The photos a category page shows first (its first 32 products and its hero) are copied small into `assets/thumbs/` by `scripts/fetch_thumbs.py` and load from the site itself; every other photo still comes from the shop when it is needed. The Catalogue workflow refreshes the thumbnails along with the products.

### Customiser

The customiser is `scottprins32-hub/ssk-glove-demo`, live at https://scottprins32-hub.github.io/ssk-glove-demo/ (`CUSTOMIZER_URL` in `src/data.js`). `assets/customizer/` holds what was captured from it: `glove-*.webp` (a transparent render of each starter glove), `step-1.webp` … `step-7.webp` (a screenshot of each step, in Dutch) and `og.jpg` (the share image). The share link for each starter (`CZ_LINKS` in `src/data.js`) was made with the customiser's own Share button.

### Product photos

Copies live in `assets/products/`. `scripts/fetch_photos.py` downloads any that are missing; the *Product photos* GitHub Action runs it whenever `src/data.js` changes. If a copy is missing, the page loads the photo from the live shop instead.

### GitHub Pages

Turn it on once in the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`**. The site is then at https://scottprins32-hub.github.io/SSK-website/. On a free GitHub plan, Pages only works for public repositories.

## Placeholders

- **Logo:** the design system uses a text wordmark ("SSK EUROPE"), so the pages do too.

## Editing

`src/base.css` holds the design tokens and components, `src/ui.js` the shared header, cards, customiser block, showroom and footer, `src/data.js` the content, and `src/home.css` / `src/home.js` the layout and motion of the version 2 homepage. `src/category.html`, `src/cat.css` and `src/cat.js` make the category pages. Edit `src/`, then run `python3 build.py` to rebuild `index.html`, the category pages and the files in `concepts/`.
