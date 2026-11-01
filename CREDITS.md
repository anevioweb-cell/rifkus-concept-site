# Credits

Assets and licenses actually used by this repository. The source code is MIT-licensed (see `LICENSE`). Everything listed below keeps its own license or belongs to its owner (see `NOTICE.md`).

## Brand material (owned by the brand)

The Rifkus name, logo, mascot, packaging and identity belong to their owners. They appear here only because this is an unofficial design concept for that brand.

| Asset | Files | Origin |
|---|---|---|
| Harissa and Pizza bag packshots | `public/images/flavors/harissa/`, `public/images/flavors/pizza/` | Product photos from a retailer page (epicerie-saintbrieuc.fr). The background was removed locally with rembg |
| Ketchup and Chicken bag packshots | `public/images/flavors/ketchup/`, `public/images/flavors/chicken/` | Product photos from a retailer page (midiminuit-epinal.com). The background was removed locally with rembg |
| Zfiti bag | `public/images/flavors/zfiti/` | An image of the real bag supplied by the site's owner (an AI clean-up of a photo of the bag), cut out locally |
| Mhadjeb bag | `public/images/flavors/mhadjeb/` | An image of the real bag supplied by the site's owner (sharpened with AI; the printed text was checked against the original photo), cut out locally |
| Zfiti in a shop and on a shelf | `public/images/photos/zfiti-photo/`, `public/images/photos/zfiti-shelf/` | Photos posted by a retailer (@legrandtopshop) on Instagram; cropped, not retouched |

## AI-generated imagery

| Asset | Files | Origin |
|---|---|---|
| Hero scene backgrounds (one per flavor) | `public/images/scenes/*-desktop-*`, `public/images/scenes/*-mobile-*` | **AI-generated** images supplied by the site's owner for this concept. Resized and encoded locally; a few areas of AI pseudo-text are softened |
| Ingredient pieces | `public/images/scenes/elements/` | Cut locally (rembg) from the same AI-generated backgrounds |
| Open Graph image | `public/images/og/og-home.jpg` | Composed by `npm run images` from the Mhadjeb background and the Mhadjeb bag |

## Fonts (SIL Open Font License 1.1)

| Font | Files | License text |
|---|---|---|
| Plus Jakarta Sans, by Tokotype | `public/fonts/plus-jakarta-sans-*.woff2` | `public/fonts/licenses/PlusJakartaSans-OFL.txt` |
| Baloo Bhaijaan 2, by Ek Type (the Arabic file is subset to the letters of the brand words) | `public/fonts/baloo-bhaijaan-2-*.woff2` | `public/fonts/licenses/BalooBhaijaan2-OFL.txt` |

## Own work

- **Graphics:** the favicon, icons, arrows, grain and motes (inline SVG and CSS) were drawn for this project.
- **Text:** the code and the copy were written for this project.
- **Design:** the layout and motion language are inspired by the Framer studio template **Pitch**, by its author. No code, text or assets were copied from it.

## Open-source software

| Package | License |
|---|---|
| React, React DOM | MIT |
| React Router | MIT |
| Motion | MIT |
| Lenis | MIT |
| Vite, Tailwind CSS | MIT |
| sharp (image pipeline, development only) | Apache-2.0 |
| rembg (background removal, run locally outside the project) | MIT |

No stock photos are used.
