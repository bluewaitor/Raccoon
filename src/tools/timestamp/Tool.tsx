import { useState, useMemo, useEffect } from 'react';
import { ToolLayout, InputPanel, OutputPanel, Explanation } from '../../components/ToolLayout';
import { parseTimestamp, nowTimestamp } from './logic';

export default function TimestampTool() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parseTimestamp(input);
  }, [input]);

  const [current, setCurrent] = useState(nowTimestamp);
  useEffect(() => {
    const id = setInterval(() => setCurrent(nowTimestamp()), 1000);
    return () => clearInterval(id);
  }, []);

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
          label="Input"
          action={
            <button
              onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
              className="text-[11px] px-2 py-1 bg-surface-2 rounded text-text-muted hover:text-text-secondary transition-colors"
            >
              Now
            </button>
          }
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a timestamp, date string, or Unix epoch..."
            className="w-full bg-transparent border-none text-text-secondary text-[13px] leading-relaxed p-4 resize-none min-h-[240px] outline-none font-mono placeholder:text-text-dim"
            spellCheck={false}
          />
        </InputPanel>
        <OutputPanel
          label="Output"
          action={
            data ? (
              <button
                onClick={() => copy(data.iso)}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                  copied ? 'bg-green-500/20 text-green-400' : 'bg-accent text-white hover:bg-accent-hover'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            ) : (
              <button disabled className="text-[11px] px-2.5 py-1 rounded bg-surface-2 text-text-dim cursor-not-allowed">
                Copy
              </button>
            )
          }
        >
          {data ? (
            <div className="p-4 text-[13px] leading-loose min-h-[240px] font-mono space-y-3">
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">Unix Epoch</div>
                <div className="text-text-primary">{data.unix}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">ISO 8601</div>
                <div className="text-text-primary">{data.iso}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">RFC 2822</div>
                <div className="text-text-primary">{data.rfc}</div>
              </div>
              <div>
                <div className="text-text-dim text-[11px] uppercase tracking-wider mb-0.5">Relative</div>
                <div className="text-text-primary">{data.relative}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-[13px] text-text-dim min-h-[240px]">
              Paste a timestamp to see all formats.
              <div className="mt-4 text-text-dim text-[11px]">Current time:</div>
              <div className="text-text-secondary">Unix: {current.unix}</div>
              <div className="text-text-secondary">ISO: {current.iso}</div>
            </div>
          )}
        </OutputPanel>
      </ToolLayout>
      <Explanation title="What does this tool do?">
        <p className="text-[13px] text-text-muted leading-relaxed">
          Converts between Unix epoch, ISO 8601, RFC 2822, and relative time formats.
          Shows all formats simultaneously for any input.
        </p>
        <ul className="mt-2 text-[13px] text-text-muted leading-loose list-disc pl-5">
          <li>Supports Unix timestamps (seconds or milliseconds)</li>
          <li>Supports ISO 8601 and most date string formats</li>
          <li>Click "Now" to get the current timestamp</li>
        </ul>
      </Explanation>
    </>
  );
}
