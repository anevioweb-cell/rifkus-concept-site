import { useEffect, useState } from 'react';
import { site } from '../config/site.js';
import { useLocale } from '../hooks/useLocale.js';

const format = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: site.clock.timeZone });

/**
 * Live local time in Algiers, "8:47 PM, ALGIERS" (reference: minute
 * resolution). The server and the first client render show an empty slot
 * of the same width, then the time appears after mount: no hydration
 * mismatch and no layout shift. Screen readers get "Local time in
 * Algiers" before the time (not a live region: no announcement per minute).
 */
export function Clock({ className = '' }) {
  const { t } = useLocale();
  const [now, setNow] = useState(null);

  useEffect(() => {
    let timer;
    const tick = () => {
      const date = new Date();
      setNow(date);
      // Re-render on the next minute boundary.
      timer = setTimeout(tick, 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds()) + 20);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <p className={`min-w-[6.25rem] text-ui leading-none whitespace-nowrap uppercase ${className}`}>
      <span className="sr-only">{t('clock.label')}: </span>
      {now ? (
        <>
          {format.format(now).replace(/\u202f/g, ' ')}
          {/* Under 380 px the city is for screen readers only (a crowded bar). */}
          <span className="xs:sr-only">, {t(site.clock.cityKey)}</span>
        </>
      ) : (
        ' '
      )}
    </p>
  );
}
