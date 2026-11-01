import en from './en.js';

function lookup(key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), en);
}

/**
 * Translate a dotted key from the English dictionary, with `{var}`
 * interpolation. A missing key renders as the key itself (and warns in dev)
 * so it is visible, never blank. `npm run i18n:check` catches it earlier.
 */
export function translate(key, vars) {
  const value = lookup(key);
  if (value === undefined && import.meta.env.DEV) console.warn(`[i18n] missing "${key}"`);
  if (typeof value !== 'string') return value ?? key;
  return vars ? value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`)) : value;
}
