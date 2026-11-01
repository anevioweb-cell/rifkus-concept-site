import { Fragment, useState } from 'react';
import { flavors } from '../data/flavors.js';
import { useLocale } from '../hooks/useLocale.js';
import { FlavorName } from './FlavorName.jsx';
import { PauseIcon, PlayIcon } from './icons/index.jsx';

/**
 * Yellow flavor ticker between sections (owner request; the
 * reference itself has no marquee). Decorative: the names are on the page
 * already, so the moving text is hidden from screen readers. It pauses on
 * hover and with its pause button (WCAG 2.2.2), and stands still under
 * reduced motion (the button is then hidden). Navy on yellow, 9.45:1.
 */
export function Marquee() {
  const { t } = useLocale();
  const [paused, setPaused] = useState(false);
  const items = (
    <ul className="flex shrink-0 items-center gap-8 pe-8">
      {flavors.map((flavor) => (
        <Fragment key={flavor.slug}>
          <li>
            <FlavorName flavor={flavor} />
          </li>
          <li aria-hidden="true">•</li>
        </Fragment>
      ))}
      <li>{t('site.strip')}</li>
      <li aria-hidden="true">•</li>
    </ul>
  );
  return (
    <div data-surface="light" className="relative flex h-16 items-center overflow-hidden bg-brand text-brand-ink tablet:h-20">
      <div aria-hidden="true" data-paused={paused} className="marquee-track flex w-max text-sub font-semibold whitespace-nowrap uppercase tablet:text-sub-lg">
        {items}
        {items}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? t('marquee.play') : t('marquee.pause')}
        className="absolute end-gutter inline-flex size-11 items-center justify-center rounded-ui bg-brand motion-reduce:hidden"
      >
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  );
}
