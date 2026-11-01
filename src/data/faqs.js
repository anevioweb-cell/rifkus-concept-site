/**
 * FAQ entries (copy in i18n). Only safe, generic answers: the concept
 * notice, the heat estimate (founder announcement + our scale) and the demo
 * form; unknown facts (points of sale, ingredients, nutrition) are visible
 * placeholders. `source` says where each answer's facts come from.
 *
 * @typedef {{ id: string, questionKey: string, answerKey: string, category: 'product' | 'buy' | 'wholesale' | 'site', source: string }} Faq
 */

/** @type {Faq[]} */
export const faqs = [
  { id: 'official', questionKey: 'faq.officialQ', answerKey: 'faq.officialA', category: 'site', source: 'site.isConcept' },
  { id: 'hottest', questionKey: 'faq.hottestQ', answerKey: 'faq.hottestA', category: 'product', source: 'founder TikTok; our heat scale' },
  { id: 'newest', questionKey: 'faq.newestQ', answerKey: 'faq.newestA', category: 'product', source: 'the bag' },
  { id: 'buy', questionKey: 'faq.buyQ', answerKey: 'faq.buyA', category: 'buy', source: 'site (no official list of points of sale)' },
  { id: 'ingredients', questionKey: 'faq.ingredientsQ', answerKey: 'faq.ingredientsA', category: 'product', source: 'placeholder (none found)' },
  { id: 'wholesale', questionKey: 'faq.wholesaleQ', answerKey: 'faq.wholesaleA', category: 'wholesale', source: 'site.formsAreDemo' },
];
