/**
 * The Latin name exactly as printed on the bag, as a small line under the
 * Arabic name (Mhadjeb: "MAHAJOUBE"; owner decision). Renders
 * nothing for flavors without a `printedName`.
 */
export function PrintedName({ flavor, className = '' }) {
  if (!flavor.printedName) return null;
  return <span className={`block text-ui font-semibold tracking-[0.12em] text-mist ${className}`}>{flavor.printedName}</span>;
}
