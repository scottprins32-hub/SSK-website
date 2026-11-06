# SSK Europe website redesigns

Five homepage redesigns of [sskeurope.ccvshop.nl](https://sskeurope.ccvshop.nl/), each in a different style. Every version keeps the content of the current shop: all 17 categories, new arrivals, balls, outlet, club apparel and printing, the Hoofdklasse Holland Series 2026, brands, the showroom and opening hours, and the full footer. Each one gives the glove customiser a prominent spot and button.

Open `index.html` for an overview, or open any file in `concepts/` on its own. Every file is self-contained (fonts load from Google Fonts), so it can be emailed or opened straight from disk.

| # | Version | Style |
|---|---------|-------|
| 01 | Kuro | Dark luxury, serif and gold, editorial |
| 02 | Raster | Swiss grid, huge type, A–Q category index |
| 03 | Floodlight | Night game under stadium lights, bento grid and scoreboard |
| 04 | Atelier | Warm leather and paper, polaroids, tags and stitching |
| 05 | Lab | Clean app feel, mega menu, category filters and product tabs |

## Placeholders

- **Customiser link:** set `CUSTOMIZER_URL` in `src/data.js` to the real customiser URL.
- **Product photos:** product tiles show an icon in the product's colourway. The category pages' share images from the live shop load where available.
- **Logo:** a text wordmark stands in for the SSK logo.

## Editing

Content lives in `src/data.js`. Edit `src/`, then run `python3 build.py` to rebuild the files in `concepts/`.
