import { useState, useMemo } from 'react';
import { ToolLayout, InputPanel, OutputPanel, Explanation } from '../../components/ToolLayout';
import { encode, decode } from './logic';
import { useT } from '../../i18n/context';

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);
  const { t } = useT();

  const result = useMemo(() => {
    if (!input.trim()) return { ok: true as const, output: '' };
    return mode === 'encode' ? encode(input, t) : decode(input, t);
  }, [input, mode, t]);

  const error = result.ok ? null : result.error;
  const output = result.ok ? result.output : '';

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
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
              onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
              className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
            >
              {mode === 'encode' ? t('base64.decode') : t('base64.encode')}
            </button>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? t('base64.encodePlaceholder') : t('base64.decodePlaceholder')}
            className="w-full bg-transparent border-none text-text-secondary text-[13px] leading-relaxed p-4 resize-none min-h-[240px] outline-none font-mono placeholder:text-text-dim"
            spellCheck={false}
          />
        </InputPanel>
        <OutputPanel
          label={t('common.output')}
          action={
            <button
              onClick={copy}
              disabled={!output}
              className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : output
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-surface-2 text-text-dim cursor-not-allowed'
              }`}
            >
              {copied ? t('common.copied') : t('common.copy')}
            </button>
          }
        >
          {output ? (
            <pre className="p-4 text-[13px] leading-relaxed min-h-[240px] text-text-secondary whitespace-pre-wrap break-all font-mono">
              {output}
            </pre>
          ) : (
            <div className="p-4 text-[13px] text-text-dim min-h-[240px]">
              {mode === 'encode' ? t('base64.encodeEmpty') : t('base64.decodeEmpty')}
            </div>
          )}
        </OutputPanel>
      </ToolLayout>
      <Explanation title={t('common.whatDoesThisDo')}>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {t('base64.explanation')}
        </p>
        <ul className="mt-2 text-[13px] text-text-muted leading-loose list-disc pl-5">
          <li>{t('base64.feature1')}</li>
          <li>{t('base64.feature2')}</li>
          <li>{t('base64.feature3')}</li>
        </ul>
      </Explanation>
    </>
  );
}
