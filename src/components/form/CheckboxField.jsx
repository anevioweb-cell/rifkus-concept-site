import { useLocale } from '../../hooks/useLocale.js';
import { AlertIcon } from '../icons/index.jsx';
import { describedBy, fieldIds } from './fieldUtils.js';

/** Checkbox with its label after it; 24 px box. The whole row is the label (≥ 44 px tap target). */
export function CheckboxField({ id, label, error, required = false, ...inputProps }) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex min-h-tap cursor-pointer items-start gap-3 py-2.5">
        <input
          id={id}
          name={id}
          type="checkbox"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { error })}
          className={`mt-0.5 size-6 shrink-0 accent-brand ${error ? 'outline-2 outline-error' : ''}`}
          {...inputProps}
        />
        <span className="text-body text-white tablet:text-small">
          {label} <span className="text-smoke">{required ? t('form.required') : t('form.optional')}</span>
        </span>
      </label>
      {error && (
        <p id={fieldIds(id).error} className="flex items-start gap-1.5 text-small font-semibold text-error-on-dark">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
