import { Field } from './Field.jsx';
import { controlClass, describedBy } from './fieldUtils.js';

/**
 * Text-like input (text, email, tel), underline style (48 px row).
 *
 * @param {object} props other props go to the <input> (autoComplete, inputMode, enterKeyHint, value, onChange…)
 * @param {string} props.id also the field name
 * @param {string} props.label visible label
 * @param {string} [props.hint] help text under the label
 * @param {string} [props.error] error message (sets aria-invalid)
 * @param {boolean} [props.required=false]
 * @param {'text' | 'email' | 'tel'} [props.type='text']
 */
export function TextField({ id, label, hint, error, required = false, type = 'text', className = '', ...inputProps }) {
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={id}
        type={type}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        className={`${controlClass(error)} h-12 ${className}`}
        {...inputProps}
      />
    </Field>
  );
}
