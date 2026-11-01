/**
 * Text wordmark in the bubbly Baloo face (stand-in for the official logo,
 * which belongs to the brand; owner decision). Rifkus yellow on ink (13.46:1).
 */
export function Wordmark({ className = '' }) {
  return (
    <span className={`font-wordmark font-extrabold leading-none tracking-normal text-brand ${className}`} translate="no">
      Rifkus
    </span>
  );
}
