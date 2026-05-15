import { useState, useMemo } from 'react';
import { ToolLayout, InputPanel, OutputPanel, Explanation } from '../../components/ToolLayout';
import { encode, decode } from './logic';

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim() && mode === 'decode') return { ok: true as const, output: '' };
    if (!input.trim()) return { ok: true as const, output: '' };
    return mode === 'encode' ? encode(input) : decode(input);
  }, [input, mode]);

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
          label="Input"
          action={
            <button
              onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
              className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
            >
              {mode === 'encode' ? 'Decode' : 'Encode'}
            </button>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 to decode...'}
            className="w-full bg-transparent border-none text-text-secondary text-[13px] leading-relaxed p-4 resize-none min-h-[240px] outline-none font-mono placeholder:text-text-dim"
            spellCheck={false}
          />
        </InputPanel>
        <OutputPanel
          label="Output"
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
              {copied ? 'Copied!' : 'Copy'}
            </button>
          }
        >
          {output ? (
            <pre className="p-4 text-[13px] leading-relaxed min-h-[240px] text-text-secondary whitespace-pre-wrap break-all font-mono">
              {output}
            </pre>
          ) : (
            <div className="p-4 text-[13px] text-text-dim min-h-[240px]">
              {mode === 'encode' ? 'Type text to see the Base64 encoded output.' : 'Paste Base64 to see the decoded text.'}
            </div>
          )}
        </OutputPanel>
      </ToolLayout>
      <Explanation title="What does this tool do?">
        <p className="text-[13px] text-text-muted leading-relaxed">
          Encodes text to Base64 or decodes Base64 strings back to text.
          Handles Unicode characters including Chinese and emoji.
        </p>
        <ul className="mt-2 text-[13px] text-text-muted leading-loose list-disc pl-5">
          <li>Toggle between Encode and Decode modes</li>
          <li>Supports full Unicode (emoji, CJK characters)</li>
          <li>Instant output as you type</li>
        </ul>
      </Explanation>
    </>
  );
}
