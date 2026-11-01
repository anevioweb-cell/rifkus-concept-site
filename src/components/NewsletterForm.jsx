import { useLocale } from '../hooks/useLocale.js';
import { useDemoForm } from '../hooks/useDemoForm.js';
import { Button } from './Button.jsx';
import { TextField } from './form/TextField.jsx';
import { DemoSuccess } from './form/DemoSuccess.jsx';
import { ErrorSummary } from './form/ErrorSummary.jsx';

const schema = { newsName: { required: true }, newsEmail: { required: true, type: 'email' } };

/** Footer newsletter (reference layout: 2 underline fields + 60 px button). Demo only: sends nothing. */
export function NewsletterForm() {
  const { t } = useLocale();
  const { field, handleSubmit, reset, status, errorCount, submitted } = useDemoForm(schema);
  if (status === 'success') {
    return (
      <div className="mt-6">
        <DemoSuccess onReset={reset} />
      </div>
    );
  }
  return (
    <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
      <TextField label={t('footer.newsName')} autoComplete="name" autoCapitalize="words" enterKeyHint="next" {...field('newsName')} />
      <TextField
        label={t('footer.newsEmail')}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="done"
        {...field('newsEmail')}
      />
      {submitted && <ErrorSummary count={errorCount} />}
      <Button type="submit" className="mt-4 w-full">
        {t('footer.newsSubmit')}
      </Button>
    </form>
  );
}
