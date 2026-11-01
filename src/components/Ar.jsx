/**
 * An Arabic brand word inside English text (docs/DESIGN_SYSTEM.md (Arabic words)).
 * <bdi> isolates the right-to-left run from the surrounding LTR text;
 * `lang="ar"` gives screen readers and the font matcher the right language.
 * The `ar` utility (base.css) sets Baloo Bhaijaan 2, no letter-spacing, no
 * case transform, and a size matched to the Latin cap height.
 */
export function Ar({ children, className = '' }) {
  return (
    <bdi lang="ar" dir="rtl" className={`ar ${className}`}>
      {children}
    </bdi>
  );
}
