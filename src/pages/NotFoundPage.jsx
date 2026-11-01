import { Link } from 'react-router';
import { useLocale } from '../hooks/useLocale.js';

/** 404 (reference layout: centered "404", a gray line, "BACK TO HOME"). */
export default function NotFoundPage() {
  const { t } = useLocale();
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4 px-gutter text-center">
      <h1 className="text-page font-semibold tablet:text-page-lg">{t('pages.notFound.title')}</h1>
      <p className="text-slogan text-smoke tablet:text-slogan-lg">{t('pages.notFound.body')}</p>
      <Link to="/" className="mt-2 inline-flex min-h-11 items-center text-ui font-semibold uppercase underline-offset-4 hover:underline">
        {t('pages.notFound.back')}
      </Link>
    </section>
  );
}
