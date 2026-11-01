import { useId, useState } from 'react';
import { m } from 'motion/react';
import { useLocale } from '../hooks/useLocale.js';
import { Button } from './Button.jsx';
import { PlusIcon } from './icons/index.jsx';

/**
 * Accordion rows (disclosure pattern), styled and timed like the reference's
 * Careers rows: title 24 px + optional 10 px
 * uppercase meta, dotted rules, plus icon at the end. The row opens at once
 * and its details fade in after 0.2 s over 0.3 s (opacity only).
 * Each question is a button in a heading with aria-expanded / aria-controls;
 * the answer is a labelled region. One open at a time unless `multiple`.
 * Ends with a "contact us" fallback row unless `fallback={false}`.
 * `tone="light"`: navy text and rules for a brand-yellow band.
 * `item.action`: optional node under the answer (e.g. an "Apply" button).
 *
 * @param {object} props
 * @param {{ id: string, question: import('react').ReactNode, meta?: string, answer: import('react').ReactNode, action?: import('react').ReactNode }[]} props.items
 * @param {2 | 3 | 4} [props.headingLevel=3] heading level of each question
 * @param {boolean} [props.multiple=false] allow several rows open at once
 * @param {boolean} [props.fallback=true] add the "contact us" row
 * @param {string} [props.fallbackTo] link of the fallback row
 * @param {'dark' | 'light'} [props.tone='dark']
 */
export function Accordion({ items, headingLevel = 3, multiple = false, fallback = true, fallbackTo = '/distributors#request-form', tone = 'dark' }) {
  const light = tone === 'light';
  const rule = light ? 'rule-dotted-ink' : 'rule-dotted';
  const muted = light ? 'text-brand-ink' : 'text-smoke';
  const { t } = useLocale();
  const baseId = useId();
  const [openIds, setOpenIds] = useState([]);
  const Heading = `h${headingLevel}`;

  const toggle = (id) => setOpenIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : multiple ? [...current, id] : [id]));

  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className={rule}>
            <Heading className="text-lead tablet:text-lead-lg">
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-4 pt-6.5 pb-7 text-start"
              >
                <span className="flex flex-col gap-1.5">
                  <span>{item.question}</span>
                  {item.meta && <span className={`text-micro font-medium uppercase ${muted}`}>{item.meta}</span>}
                </span>
                <PlusIcon className={`size-5 shrink-0 transition-transform duration-(--duration-base) ease-out-soft ${open ? 'rotate-45' : ''}`} />
              </button>
            </Heading>
            {open && (
              <m.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
              >
                <p className={`max-w-[51rem] px-4 pb-6 text-body ${muted}`}>{item.answer}</p>
                {item.action && <div className="px-4 pb-7">{item.action}</div>}
              </m.div>
            )}
          </div>
        );
      })}
      {fallback && (
        <div className="flex flex-col items-start gap-3 rule-dotted px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{t('accordion.fallbackTitle')}</p>
            <p className="text-small text-smoke">{t('accordion.fallbackBody')}</p>
          </div>
          <Button to={fallbackTo} size="sm" arrow>
            {t('accordion.fallbackCta')}
          </Button>
        </div>
      )}
    </div>
  );
}
