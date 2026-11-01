/**
 * <picture> sources for the pipeline's AVIF twins: AVIF first,
 * the <img> keeps the WebP as the fallback. `media` adds art direction.
 * Usage: sources={[...avifSource(image, sizes)]} on DeferredImg / <picture>.
 */
export const avifSource = (image, sizes, media) => (image?.avifSrcSet ? [{ media, type: 'image/avif', srcSet: image.avifSrcSet, sizes }] : []);
