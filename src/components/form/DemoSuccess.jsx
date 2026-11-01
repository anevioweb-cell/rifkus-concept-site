import { useEffect, useRef } from 'react';
import { useLocale } from '../../hooks/useLocale.js';
import { Button } from '../Button.jsx';
import { CheckIcon } from '../icons/index.jsx';

/**
 * Success panel: announced via role="status"; repeats that nothing was sent.
 * It replaces a tall form, so it scrolls into view (below the bar) and takes
 * focus when it appears (phones: the confirmation is never off screen).
 */
export function DemoSuccess({ onReset }) {
  const { t } = useLocale();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < 0 || el.getBoundingClientRect().bottom > innerHeight) el.scrollIntoView({ block: 'center' });
    el.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="flex scroll-mt-nav flex-col items-start gap-3 border-t border-smoke pt-6">
      <p className="flex items-center gap-2 text-title font-medium text-white">
        <CheckIcon className="size-6" />
        {t('form.successTitle')}
      </p>
      <p className="text-body text-ash">{t('form.successBody')}</p>
      <Button size="sm" onClick={onReset}>
        {t('form.reset')}
      </Button>
    </div>
  );
}
