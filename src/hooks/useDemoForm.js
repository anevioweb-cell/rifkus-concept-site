import { useState } from 'react';
import { useLocale } from './useLocale.js';

const PHONE_DZ = /^0[567]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Demo form state: validates on submit (then live per field), focuses the
 * first invalid field, and switches to a success state. NOTHING is sent:
 * there is no network call anywhere in this hook (site.formsAreDemo).
 *
 * schema: { [name]: { required?, type?: 'email' | 'phone' | 'checkbox', minLength? } }
 * Field order in the schema defines focus order for errors.
 */
export function useDemoForm(schema) {
  const { t } = useLocale();
  const initial = Object.fromEntries(Object.entries(schema).map(([name, rule]) => [name, rule.type === 'checkbox' ? false : '']));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success'

  const validateField = (name, value) => {
    const rule = schema[name];
    const text = typeof value === 'string' ? value.trim() : value;
    if (rule.type === 'checkbox') return rule.required && !value ? t('form.errorConsent') : undefined;
    if (!text) return rule.required ? t('form.errorRequired') : undefined;
    if (rule.type === 'email' && !EMAIL.test(text)) return t('form.errorEmail');
    if (rule.type === 'phone' && !PHONE_DZ.test(text.replace(/[\s.-]/g, ''))) return t('form.errorPhone');
    if (rule.minLength && text.length < rule.minLength) return t('form.errorMinLength', { min: rule.minLength });
    return undefined;
  };

  const validateAll = (current) =>
    Object.fromEntries(
      Object.keys(schema)
        .map((name) => [name, validateField(name, current[name])])
        .filter(([, error]) => error),
    );

  const field = (name) => {
    const isCheckbox = schema[name].type === 'checkbox';
    return {
      id: name,
      required: Boolean(schema[name].required),
      error: errors[name],
      ...(isCheckbox ? { checked: values[name] } : { value: values[name] }),
      onChange: (event) => {
        const value = isCheckbox ? event.target.checked : event.target.value;
        setValues((v) => ({ ...v, [name]: value }));
        if (submitted) setErrors((e) => ({ ...e, [name]: validateField(name, value) }));
      },
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(schema).find((name) => nextErrors[name]);
    if (firstInvalid) {
      event.currentTarget.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus('success');
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setSubmitted(false);
    setStatus('idle');
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  /** Set a value from outside (e.g. an "Apply" button preselecting a select). */
  const setValue = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  return { field, handleSubmit, reset, setValue, status, errorCount, submitted };
}
