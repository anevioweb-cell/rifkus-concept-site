/**
 * Copy tokens → Arabic brand words (owner rule, docs/DESIGN_SYSTEM.md (Arabic words)).
 * Rendered by <WithBrandWords>; `plainBrandWords` gives the plain-text form
 * (meta, JSON-LD): "Latin (Arabic)".
 */
export const BRAND_WORDS = { '{zfiti}': 'زفيطي', '{mhadjeb}': 'محاجب' };
export const BRAND_TOKEN = /(\{zfiti\}|\{mhadjeb\})/;
const PLAIN = { '{zfiti}': 'Zfiti (زفيطي)', '{mhadjeb}': 'Mahajoube (محاجب)' };
export const plainBrandWords = (text) => text.replace(/\{zfiti\}|\{mhadjeb\}/g, (token) => PLAIN[token]);
