import { useState, useMemo } from 'react';
import { ToolLayout, InputPanel, OutputPanel, Explanation } from '../../components/ToolLayout';
import { formatJSON, minifyJSON } from './logic';

type Mode = 'format' | 'minify';

export default function JSONTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return mode === 'format' ? formatJSON(input) : minifyJSON(input);
  }, [input, mode]);

  const error = result.ok ? null : result.error;
  const output = result.ok ? result.formatted : '';

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const clear = () => {
    setInput('');
  };

  return (
    <>
      <ToolLayout error={error}>
        <InputPanel
          label="Input"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setMode(mode === 'format' ? 'minify' : 'format')}
                className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
              >
                {mode === 'format' ? 'Minify' : 'Format'}
              </button>
              <button
                onClick={clear}
                className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear
              </button>
            </div>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
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
            <pre className="p-4 text-[13px] leading-relaxed min-h-[240px] text-text-secondary whitespace-pre-wrap font-mono">
              {output}
            </pre>
          ) : (
            <div className="p-4 text-[13px] text-text-dim min-h-[240px]">
              Paste your input above to see the result.
            </div>
          )}
        </OutputPanel>
      </ToolLayout>
      <Explanation title="What does this tool do?">
        <p className="text-[13px] text-text-muted leading-relaxed">
          Formats compressed or minified JSON into a readable, indented structure.
          Also validates JSON syntax and highlights errors with the exact position.
        </p>
        <ul className="mt-2 text-[13px] text-text-muted leading-loose list-disc pl-5">
          <li>Toggle between Format and Minify modes</li>
          <li>Instant output as you type or paste</li>
          <li>Copy formatted result with one click</li>
        </ul>
      </Explanation>
    </>
  );
}
