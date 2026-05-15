import { useT } from '../i18n/context';

export function LanguageToggle() {
  const { locale, setLocale } = useT();
  return (
    <button
      onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
      className="text-[11px] px-2.5 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors font-mono"
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  );
}