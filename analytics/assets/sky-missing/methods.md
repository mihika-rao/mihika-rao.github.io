# The sky we're missing: analysis from raw spatial data

## What this project does

This is a new spatial aggregation of the World Atlas sky-brightness raster, not a transcription of the paper's country statistics. It calculates the percentage of mapped area above the atlas's Milky Way loss-of-visibility cutoff for eight selected European territories, then maps the classified locations.

**Question:** How much of each country lies under skies that hide the Milky Way?

**Denominator:** Valid mapped area inside the boundary polygon. No population data are used. The shaded regions represent locations, not illustrations.

## Reproduce

Dependencies: Python, numpy, matplotlib, rasterio, shapely and pyproj.

1. `python analyse.py` reads the included raw raster extract and boundary GeoJSON; writes `results.csv` and `results.json`.
2. `python draw.py` makes the PNG and SVG from the computed results and map cells.

The package includes the unclassified input raster extract so re-running does not require downloading the 653 MiB global archive. `fetch_inputs.py` documents and reproduces the acquisition/cropping step (also requires pyshp). The global archive itself is not bundled.

## Method

- Original raster: `World_Atlas_2015.tif`, WGS84, approximately 30 arcseconds per cell. Values are artificial zenith brightness in mcd/m² (natural brightness excluded).
- Cutoff: strictly greater than 0.688 mcd/m² = 688 μcd/m², following the atlas's Milky Way loss-of-visibility classification (paper, Figure 9). At or below is the complementary category, not a promise of visibility on a specific night.
- Boundaries: Natural Earth 1:10m Admin 0 Countries, without boundary lakes, version 5.1.1. Geometry is intersected with longitude −12 to 20 and latitude 35 to 61 degrees. This retains metropolitan France (including Corsica), European Spain (including Balearics but excluding Canaries/Ceuta/Melilla), and the represented European territory of the other six countries. Overseas possessions are excluded. Generalized boundaries and remaining small water bodies mean these are mapped polygon areas, not official surveyed land areas.
- Native-resolution pixel centers determine country membership. No-data, negative and nonfinite values are excluded. Every included cell is weighted by its WGS84 ellipsoidal area calculated with `pyproj.Geod` from its latitude bounds. Longitude/latitude grid cells do not all have equal area.
- Result: 100 × sum(area of valid cells above cutoff) / sum(area of all valid cells).
- Presentation: descending obscured share, rounded to one decimal. France and Spain both display 6.6%; their unrounded values determine order. Maps use Europe LAEA (EPSG:3035), nearest-neighbor categorical reprojection at 1 km, and are resized independently to fit their panels. All quantitative calculations remain at native resolution.

## Checks and interpretation

No missing cells occur inside the included pixel-center masks. Changing boundary inclusion to all-touched alters each main result by less than 0.4 percentage points. A separate ±20% cutoff sensitivity is recorded in the CSV; these are scenarios, not uncertainty intervals. For Belgium, the obscured share varies from about 40.5% to 63.4% across those cutoffs, so the cutoff definition materially matters.

This is a historical model-based analysis using the atlas's 2014 satellite inputs and publication in 2016; it is not a 2026 sky survey. Weather, moonlight, atmospheric clarity, terrain, time of night and observer differences can affect actual visibility. The eight-country selection is illustrative, not a Europe-wide ranking. The countries were chosen before calculation as a familiar geographic comparison, not selected to maximize a result.

## Data credits

**Short display credit:** Data: World Atlas of Artificial Night Sky Brightness / GFZ (2016). Boundaries: Natural Earth.

**Raw dataset:** Falchi, F., Cinzano, P., Duriscoe, D., Kyba, C. C. M., Elvidge, C. D., Baugh, K., Portnov, B., Rybnikova, N. A., & Furgoni, R. (2016). Supplement to: The New World Atlas of Artificial Night Sky Brightness. GFZ Data Services. https://doi.org/10.5880/GFZ.1.4.2016.001

**Dataset paper:** Falchi, F., et al. (2016). The new world atlas of artificial night sky brightness. Science Advances, 2(6), e1600377. https://doi.org/10.1126/sciadv.1600377

**Boundary database:** Natural Earth, Admin 0 Countries, 1:10m, version 5.1.1. https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/

Accessed 13 October 2026. The archive contains an old embargo-era README; the current GFZ landing page explicitly records its change to CC BY-NC 4.0 on 13 November 2019. The included atlas extract is a crop of that dataset, with its license and attribution retained. Natural Earth boundary data are public domain. See `provenance.json` for input URLs and archive hashes.

Atlas license: https://creativecommons.org/licenses/by-nc/4.0/
Current data landing page: https://dataservices.gfz-potsdam.de/contact/showshort.php?id=escidoc:1541893

## Add to the website

Copy `sky-missing-raw-analysis.svg` to the site's `images/` folder and paste `embed.html` into your page. Source details and data are in an expandable element beneath the graphic. Nothing has been published.
