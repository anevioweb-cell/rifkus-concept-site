import { useId, useState } from 'react';
import { useSearchParams } from 'react-router';
import { wilayas } from '../data/wilayas.js';
import { photoImages } from '../data/images.generated.js';
import { enabledSocial } from '../config/site.js';
import { DeferredImg } from '../components/DeferredImg.jsx';
import { avifSource } from '../lib/imageSources.js';
import { stores } from '../data/stores.js';
import { testStores } from '../data/stores.test-data.js';
import { useLocale } from '../hooks/useLocale.js';
import { useDemoForm } from '../hooks/useDemoForm.js';
import { Accordion } from '../components/Accordion.jsx';
import { Button } from '../components/Button.jsx';
import { Reveal } from '../components/Reveal.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { TextField } from '../components/form/TextField.jsx';
import { TextareaField } from '../components/form/TextareaField.jsx';
import { SelectField } from '../components/form/SelectField.jsx';
import { CheckboxField } from '../components/form/CheckboxField.jsx';
import { DemoNotice } from '../components/form/DemoNotice.jsx';
import { DemoSuccess } from '../components/form/DemoSuccess.jsx';
import { ErrorSummary } from '../components/form/ErrorSummary.jsx';
import { DistributorCta } from '../sections/home/DistributorCta.jsx';
import { HomeFaq } from '../sections/home/HomeFaq.jsx';

/** Demo request form (useDemoForm: validation only, nothing is ever sent). */
const schema = {
  name: { required: true, minLength: 2 },
  business: { required: true, minLength: 2 },
  phone: { required: true, type: 'phone' },
  email: { required: true, type: 'email' },
  wilaya: { required: true },
  type: { required: true },
  volume: {},
  message: {},
  consent: { required: true, type: 'checkbox' },
};
const WAYS = ['wholesale', 'retail', 'regional'];
const wilayaName = Object.fromEntries(wilayas.map((w) => [w.code, w.name]));
const photo = photoImages['zfiti-photo'];

/** Beside the form (reference: a portrait column): the demo flow, the confirmed links, a real photo. */
function NextSteps() {
  const { t } = useLocale();
  return (
    <aside aria-labelledby="next-label" className="flex flex-col gap-10">
      <div>
        <h3 id="next-label" className="text-micro font-medium text-smoke uppercase">
          {t('distributors.nextLabel')}
        </h3>
        <ol className="mt-4">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex gap-4 rule-dotted py-5 text-body text-ash">
              <span className="text-lead text-brand">{String(n).padStart(2, '0')}</span>
              <span>{t(`distributors.next${n}`)}</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="text-micro font-medium text-smoke uppercase">{t('distributors.followLabel')}</h3>
        <ul className="mt-3 flex flex-col">
          {enabledSocial.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center text-ui font-semibold uppercase underline-offset-4 hover:underline"
              >
                {s.network} {s.handle}
                <span className="sr-only"> {t('a11y.externalLink')}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-media bg-ink-soft desktop:block">
        <DeferredImg
          sources={avifSource(photo, '30vw')}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="30vw"
          width={photo.width}
          height={photo.height}
          alt={t('distributors.imageAlt')}
          className="absolute inset-0 size-full object-cover object-[50%_12%]"
        />
      </div>
    </aside>
  );
}

/** Store finder: a wilaya filter over data/stores.js (empty → honest empty state). */
function StoreFinder() {
  const { t } = useLocale();
  const [params] = useSearchParams();
  const [wilaya, setWilaya] = useState('');
  const selectId = useId();
  // Fictional test stores only in `npm run dev` with ?stores=test (never in the build).
  const all = import.meta.env.DEV && params.get('stores') === 'test' ? testStores : stores;
  const shown = wilaya ? all.filter((s) => s.wilaya === wilaya) : all;
  return (
    <section aria-labelledby="find-label" className="px-gutter pb-20">
      <div className="rule-dotted pt-14 tablet:pt-6">
        <SectionLabel id="find-label">{t('distributors.findLabel')}</SectionLabel>
      </div>
      {all.length === 0 ? (
        <Reveal kind="line" className="mt-6 flex flex-col items-start gap-6 rule-dotted px-4 py-10 tablet:flex-row tablet:items-end tablet:justify-between">
          <div>
            <p className="text-statement font-medium tablet:text-statement-md desktop:text-statement-lg">{t('distributors.findEmptyTitle')}</p>
            <p className="mt-4 text-lead text-ash tablet:text-lead-lg">{t('distributors.findEmptyBody')}</p>
          </div>
          <Button href="#request-form" variant="brand" arrow className="w-full shrink-0 tablet:w-[18.9375rem]">
            {t('distributors.findEmptyCta')}
          </Button>
        </Reveal>
      ) : (
        <div className="mt-6 px-4">
          <label htmlFor={selectId} className="text-micro font-medium text-ash uppercase">
            {t('distributors.findFilter')}
          </label>
          <select
            id={selectId}
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className="mt-2 block h-12 w-full max-w-[25rem] border-b border-smoke bg-ink text-body"
          >
            <option value="">{t('distributors.findAll')}</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} · {w.name}
              </option>
            ))}
          </select>
          <p role="status" className="mt-4 text-ui text-smoke uppercase">
            {shown.length ? t('distributors.findCount', { count: shown.length }) : t('distributors.findNone')}
          </p>
          <ul className="mt-4">
            {shown.map((s) => (
              <li key={s.id} className="flex flex-col gap-1.5 rule-dotted py-6">
                <span className="text-lead tablet:text-lead-lg">{s.name}</span>
                <span className="text-micro font-medium text-smoke uppercase">
                  {wilayaName[s.wilaya]} · {s.address}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * /distributors, after the template's Careers page: a 132 px title + 16 px lead at y 200; a 10 px label, then rows with a 24 px
 * title and 10 px meta that open at once, their text fading in, with a
 * 165×45 "Apply" button; then a 132 px title, a lead and an 812 px form).
 * "Apply" preselects the business type and moves focus to the form. Then the
 * store finder (empty by design), the FAQ and the CTA band.
 */
export default function DistributorsPage() {
  const { t } = useLocale();
  const form = useDemoForm(schema);
  const { field, handleSubmit, reset, setValue, status, errorCount, submitted } = form;

  const apply = (type) => {
    setValue('type', type);
    const target = document.getElementById('request-form');
    target?.scrollIntoView({ block: 'start' });
    target?.querySelector('input, select, textarea')?.focus({ preventScroll: true });
  };

  const rows = WAYS.map((way) => ({
    id: way,
    question: t(`distributors.${way}Title`),
    meta: t(`distributors.${way}Meta`),
    answer: t(`distributors.${way}Body`),
    action: (
      <Button size="sm" variant="brand" arrow onClick={() => apply(way)}>
        {t('distributors.apply')}
      </Button>
    ),
  }));
  const typeOptions = [...WAYS, 'other'].map((v) => ({ value: v, label: t(`distributors.type${v[0].toUpperCase()}${v.slice(1)}`) }));
  const volumeOptions = [1, 2, 3, 4, 5].map((n) => ({ value: `v${n}`, label: t(`distributors.volume${n}`) }));
  const wilayaOptions = wilayas.map((w) => ({ value: w.code, label: `${w.code} · ${w.name}` }));

  return (
    <>
      <section aria-labelledby="dist-title" className="px-gutter pt-30 pb-20 tablet:pt-50">
        <h1 id="dist-title" className="text-page font-semibold tablet:text-page-md desktop:text-page-lg">
          {t('distributors.title')}
        </h1>
        <p className="mt-6 max-w-200 text-body text-ash">{t('distributors.lead')}</p>
        <h2 className="mt-15 px-4 text-micro font-medium text-smoke uppercase tablet:mt-20">{t('distributors.waysLabel')}</h2>
        <div className="mt-6">
          <Accordion items={rows} headingLevel={3} fallback={false} />
        </div>
      </section>

      <section id="request-form" aria-labelledby="form-title" className="scroll-mt-nav px-gutter pt-10 pb-20 tablet:pt-20">
        <h2 id="form-title" className="text-page font-semibold tablet:text-page-md desktop:text-page-lg">
          {t('distributors.formTitle')}
        </h2>
        <p className="mt-6 max-w-150 text-body text-ash">{t('distributors.formLead')}</p>
        <div className="mt-12 grid gap-16 desktop:grid-cols-[50.75rem_1fr] desktop:gap-15">
          <div>
            {status === 'success' ? (
              <DemoSuccess onReset={reset} />
            ) : (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-8">
                <DemoNotice />
                <div className="grid gap-8 tablet:grid-cols-2">
                  <TextField label={t('distributors.name')} autoComplete="name" autoCapitalize="words" enterKeyHint="next" {...field('name')} />
                  <TextField label={t('distributors.business')} autoComplete="organization" autoCapitalize="words" enterKeyHint="next" {...field('business')} />
                  <TextField
                    label={t('distributors.phone')}
                    hint={t('distributors.phoneHint')}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    enterKeyHint="next"
                    {...field('phone')}
                  />
                  <TextField
                    label={t('distributors.email')}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="off"
                    spellCheck={false}
                    enterKeyHint="next"
                    {...field('email')}
                  />
                  <SelectField label={t('distributors.wilaya')} options={wilayaOptions} {...field('wilaya')} />
                  <SelectField label={t('distributors.type')} options={typeOptions} {...field('type')} />
                </div>
                <SelectField label={t('distributors.volume')} hint={t('distributors.volumeHint')} options={volumeOptions} {...field('volume')} />
                <TextareaField label={t('distributors.message')} {...field('message')} />
                <CheckboxField label={t('distributors.consent')} {...field('consent')} />
                {submitted && <ErrorSummary count={errorCount} />}
                <Button type="submit" variant="brand" className="w-full tablet:w-[18.9375rem]">
                  {t('distributors.submit')}
                </Button>
              </form>
            )}
          </div>
          <NextSteps />
        </div>
      </section>

      <StoreFinder />
      <HomeFaq id="dist-faq" fallbackTo="#request-form" />
      <DistributorCta id="dist-cta" to="#request-form" />
    </>
  );
}
