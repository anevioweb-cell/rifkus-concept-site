/**
 * Points of sale (store finder on /distributors). Ships EMPTY: no official
 * list exists, and nothing may be invented. The page then
 * shows an honest empty state that links to the request form.
 *
 * To add a store, append an object with ALL fields and a real source:
 * @typedef {{
 *   id: string,            // unique, e.g. 'alger-001'
 *   name: string,          // shop name as written on its sign or listing
 *   wilaya: string,        // 2-digit code from data/wilayas.js
 *   address: string,
 *   phone: string | null,  // only if the shop publishes it itself
 *   type: 'retail' | 'wholesale' | 'distributor',
 *   source: { url: string, confidence: 'confirmed' | 'reported' },
 * }} Store
 *
 * Fictional test data for development lives in stores.test-data.js; it is
 * only loaded by `npm run dev` with ?stores=test and never reaches the build.
 */

/** @type {Store[]} */
export const stores = [];
