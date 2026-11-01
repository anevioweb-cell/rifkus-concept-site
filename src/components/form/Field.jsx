import { useLocale } from '../../hooks/useLocale.js';
import { AlertIcon } from '../icons/index.jsx';
import { fieldIds } from './fieldUtils.js';

/**
 * Label + hint + inline error wrapper shared by every field. The required
 * marker is visible text (not only a color or asterisk).
 */
export function Field({ id, label, hint, error, required, children, labelHidden = false }) {
  const { t } = useLocale();
  const ids = fieldIds(id);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={labelHidden ? 'sr-only' : 'text-micro font-medium text-ash uppercase'}>
        {label} <span className="text-smoke normal-case">{required ? t('form.required') : t('form.optional')}</span>
      </label>
      {hint && (
        <p id={ids.hint} className="text-small text-smoke">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={ids.error} className="flex items-start gap-1.5 text-small font-semibold text-error-on-dark">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
