# SSK Europe website concepts

Five redesign directions for [sskeurope.ccvshop.nl](https://sskeurope.ccvshop.nl/). Each one puts the new glove customiser in the hero.

Open `index.html` for an overview, or open any file in `concepts/` on its own. Every concept is a single self-contained HTML file (fonts load from Google Fonts), so it can be emailed or opened straight from disk.

| # | Concept | Style |
|---|---------|-------|
| 01 | Kuro | Dark luxury, Japanese craft, serif and gold |
| 02 | Raster | Swiss grid, huge type, red and black |
| 03 | Floodlight | Night game under stadium lights, scoreboard customiser |
| 04 | Atelier | Warm leather and paper, swatch book on a workbench |
| 05 | Glove Lab | Clean tech configurator with callouts and a spec sheet |

## The customiser

All five share one glove engine (`src/glove.js`): 8 colourable parts (palm, fingers, thumb, web, binding, laces, stitching, logo), 14 leather colours, 4 web types, left/right hand, position, size, thumb embroidery, presets and an indicative price.

The price rules and colour list are placeholders until SSK supplies the real ones.

## Editing

Edit `src/`, then run `python3 build.py` to inline `glove.js` into each page in `concepts/`.
