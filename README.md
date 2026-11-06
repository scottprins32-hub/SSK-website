# SSK Europe website redesigns

Five homepage layouts for [sskeurope.ccvshop.nl](https://sskeurope.ccvshop.nl/), all built on the SSK Europe design system: the SSK colours black, white and red `#C8102E` (red as the action colour), Barlow Condensed headings, Barlow body text, IBM Plex Mono prices, 3/6px radii, a 1200px container and the dashed red stitch line once per page. The versions share one stylesheet and one set of components and differ only in layout.

Every version keeps the content of the current shop: all 17 categories, new arrivals, balls, outlet, club apparel and printing with lead times, the Hoofdklasse Holland Series 2026, brands, the showroom with opening hours, and the full footer. Each one gives the glove customiser a prominent spot and button. The customiser itself is not changed.

Open `index.html` for an overview, or open any file in `concepts/` on its own. Every file is self-contained (fonts load from Google Fonts), so it can be emailed or opened straight from disk.

| # | Version | Layout |
|---|---------|--------|
| 01 | Klassiek | Split hero with a featured glove, category tiles, customiser block mid-page |
| 02 | Customizer voorop | Customiser as the hero, all categories as buttons below |
| 03 | Catalogus | Shop layout with a sticky category sidebar and a customiser card |
| 04 | Rustig | White header, lots of whitespace, products in tabs |
| 05 | Promoraster | Large customiser tile next to New Arrivals and Outlet tiles |

## Homepage versie 2 (gekozen richting)

`homepage/v2-homepage.html` is version 02 "Customizer voorop" worked out as a complete homepage: the customiser as the hero, then gloves, the 2026 bats, outlet and balls, a short SSK heritage strip, club apparel and Holland Series, the showroom with opening hours, brands and the footer. Every product shown is a real product from the shop with its real name, price, link and product photo (the `og:image` of its product page). The heritage line "Baseball, it's our game." comes from SSK's US site, sskbaseballshop.com.

Still to fill in: `CUSTOMIZER_URL` (the customiser link) and `CUSTOMIZER_IMG` (a customiser screenshot for the hero) in `src/data.js`.

## Placeholders

- **Customiser link:** set `CUSTOMIZER_URL` in `src/data.js` to the real customiser URL.
- **Customiser image:** the customiser blocks show a grey placeholder labelled "Beeld uit de customizer". Drop in a screenshot of the customiser.
- **Product photos:** product photos load from the live shop. Three products have no product page URL yet and show a grey "Productfoto" placeholder.
- **Logo:** the design system uses a text wordmark ("SSK EUROPE"), so the pages do too.

## Editing

`src/base.css` holds the design tokens and components, `src/ui.js` the shared header, cards, customiser block, showroom and footer, and `src/data.js` the content. Edit `src/`, then run `python3 build.py` to rebuild the files in `concepts/` and `homepage/`.
