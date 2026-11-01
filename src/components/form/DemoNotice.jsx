import { useLocale } from '../../hooks/useLocale.js';
import { AlertIcon } from '../icons/index.jsx';

/** Notice shown above every demo form: makes clear nothing is sent. */
export function DemoNotice() {
  const { t } = useLocale();
  return (
    <p className="flex items-start gap-2 text-small text-ash">
      <AlertIcon className="mt-0.5 size-4 shrink-0" />
      {t('form.demoNotice')}
    </p>
  );
}
