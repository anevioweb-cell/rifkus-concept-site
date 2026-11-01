import { getFlavor } from '../data/flavors.js';
import { heroSceneOrder, heroScenes } from '../data/heroScenes.js';
import { sceneImages } from '../data/images.generated.js';

/**
 * Home hero slides (docs/IMAGES.md): flavor, scene data (focal points,
 * pocket, glow, pieces) and the processed base images. Mhadjeb (new) first,
 * then Zfiti; short
 * names only, so the desktop title (130 px) never reaches the bag.
 */
const slideOf = (slug) => ({ flavor: getFlavor(slug), scene: heroScenes[slug], images: sceneImages[slug] });

export const heroSlides = heroSceneOrder.map(slideOf);

/** Any flavor's scene (the flavor page covers), in or out of the hero order. */
export const sceneSlide = (slug) => (heroScenes[slug] ? slideOf(slug) : null);
