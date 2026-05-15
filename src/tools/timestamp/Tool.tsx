import { useState, useMemo, useEffect } from 'react';
import { ToolLayout, InputPanel, OutputPanel, Explanation } from '../../components/ToolLayout';
import { parseTimestamp, nowTimestamp } from './logic';
import { useT } from '../../i18n/context';

export default function TimestampTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useT();

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parseTimestamp(input, t);
  }, [input, t]);

  const [current, setCurrent] = useState(() => nowTimestamp(t));
  useEffect(() => {
    setCurrent(nowTimestamp(t));
    const id = setInterval(() => setCurrent(nowTimestamp(t)), 1000);
    return () => clearInterval(id);
  }, [t]);

  const error = result && 'error' in result ? result.error : null;
  const data = result && !('error' in result) ? result : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <>
      <ToolLayout error={error}>
        <InputPanel
          label={t('common.input')}
          action={
            <button
              onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
              className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
            >
              {t('timestamp.now')}
            </button>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('timestamp.placeholder')}
            className="w-full bg-transparent border-none text-text-secondary text-[13px] leading-relaxed p-4 resize-none min-h-[240px] outline-none font-mono placeholder:text-text-dim"
            spellCheck={false}
          />
        </InputPanel>
        <OutputPanel
          label={t('common.output')}
          action={
            data ? (
              <button
                onClick={() => copy(data.iso)}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                  copied ? 'bg-green-500/20 text-green-400' : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                {copied ? t('common.copied') : t('common.copy')}
              </button>
            ) : (
              <button disabled className="text-[11px] px-2.5 py-1 rounded bg-surface-2 text-text-dim cursor-not-allowed">
                {t('common.copy')}
              </button>
            )
          }
        >
          {data ? (
            <div className="p-4 text-[13px] leading-loose min-h-[240px] font-mono space-y-3">
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">{t('timestamp.unixEpoch')}</div>
                <div className="text-text-primary">{data.unix}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">{t('timestamp.iso8601')}</div>
                <div className="text-text-primary">{data.iso}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">{t('timestamp.rfc2822')}</div>
                <div className="text-text-primary">{data.rfc}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">{t('timestamp.relative')}</div>
                <div className="text-text-primary">{data.relative}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-[13px] text-text-dim min-h-[240px]">
              {t('timestamp.pasteToSee')}
              <div className="mt-4 text-text-dim text-[11px]">{t('timestamp.currentTime')}</div>
              <div className="text-text-secondary">Unix: {current.unix}</div>
              <div className="text-text-secondary">ISO: {current.iso}</div>
            </div>
          )}
        </OutputPanel>
      </ToolLayout>
      <Explanation title={t('common.whatDoesThisDo')}>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {t('timestamp.explanation')}
        </p>
        <ul className="mt-2 text-[13px] text-text-muted leading-loose list-disc pl-5">
          <li>{t('timestamp.feature1')}</li>
          <li>{t('timestamp.feature2')}</li>
          <li>{t('timestamp.feature3')}</li>
        </ul>
      </Explanation>
    </>
  );
}
