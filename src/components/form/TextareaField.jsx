import { Field } from './Field.jsx';
import { controlClass, describedBy } from './fieldUtils.js';

/** Multi-line text field; same props as TextField, plus `rows` (default 5). */
export function TextareaField({ id, label, hint, error, required = false, rows = 5, className = '', ...textareaProps }) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        className={`${controlClass(error)} py-3 ${className}`}
        {...textareaProps}
      />
    </Field>
  );
}
