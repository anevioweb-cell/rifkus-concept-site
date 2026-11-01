import { useLocale } from '../../hooks/useLocale.js';

/** Polite live summary of the error count after a failed submit. */
export function ErrorSummary({ count }) {
  const { t } = useLocale();
  return (
    <p role="status" className="text-small font-semibold text-error-on-dark">
      {count > 0 ? t('form.errorSummary', { count }) : ''}
    </p>
  );
}
