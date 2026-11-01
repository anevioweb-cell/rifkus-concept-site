import { useLocale } from '../../hooks/useLocale.js';
import { Field } from './Field.jsx';
import { controlClass, describedBy } from './fieldUtils.js';

/** Native select (best keyboard + mobile support). `options`: [{ value, label }]. */
export function SelectField({ id, label, hint, error, required = false, options, className = '', ...selectProps }) {
  const { t } = useLocale();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={id}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        className={`${controlClass(error)} h-12 bg-ink ${className}`}
        {...selectProps}
      >
        <option value="">{t('form.selectPlaceholder')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
