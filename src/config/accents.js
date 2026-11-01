/**
 * Flavor accents: each maps to a fixed background/text pair whose contrast
 * is checked in docs/DESIGN_SYSTEM.md. `dark` marks surfaces where the
 * focus ring must switch to yellow (data-surface="dark").
 * Class strings are written out in full so Tailwind can detect them.
 */
export const accents = {
  zfiti: { surface: 'bg-zfiti', text: 'text-ink', subtle: 'text-ink', dark: false }, // 6.30
  ink: { surface: 'bg-ink', text: 'text-white', subtle: 'text-bg', dark: true }, // 19.65
  heat: { surface: 'bg-heat', text: 'text-white', subtle: 'text-white', dark: true }, // 5.24
  'heat-deep': { surface: 'bg-heat-deep', text: 'text-white', subtle: 'text-white', dark: true }, // 7.16
  'brand-ink': { surface: 'bg-brand-ink', text: 'text-white', subtle: 'text-bg', dark: true }, // 13.80
  brand: { surface: 'bg-brand', text: 'text-ink', subtle: 'text-ink', dark: false }, // 13.46
  'brand-soft': { surface: 'bg-brand-soft', text: 'text-ink', subtle: 'text-ink', dark: false }, // 15.45
  surface: { surface: 'bg-surface', text: 'text-ink', subtle: 'text-muted', dark: false }, // 17.70 / 7.30
};
