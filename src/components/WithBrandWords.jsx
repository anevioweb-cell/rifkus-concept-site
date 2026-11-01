import { Fragment } from 'react';
import { Ar } from './Ar.jsx';
import { BRAND_TOKEN, BRAND_WORDS } from '../lib/brandWords.js';

/**
 * Renders English copy that contains the `{zfiti}` or `{mhadjeb}` token,
 * with the token written as the Arabic brand word («زفيطي», «محاجب»).
 */
export function WithBrandWords({ text, className = '' }) {
  return text.split(BRAND_TOKEN).map((part, i) => <Fragment key={i}>{BRAND_WORDS[part] ? <Ar className={className}>{BRAND_WORDS[part]}</Ar> : part}</Fragment>);
}
