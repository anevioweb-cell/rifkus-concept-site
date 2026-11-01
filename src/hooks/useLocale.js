import { translate } from '../i18n/index.js';

/**
 * Copy access for components: `t('a.b', vars)` reads src/i18n/en.js and
 * `to(path)` builds an internal link. The site is English-only,
 * so `to` is the identity; it stays so a locale prefix can return later
 * without touching every component.
 */
const copy = { locale: 'en', t: translate, to: (path) => path };

export function useLocale() {
  return copy;
}
