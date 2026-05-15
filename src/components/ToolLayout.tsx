import { type ReactNode } from 'react';

interface ToolLayoutProps {
  children: ReactNode;
  error?: string | null;
}

export function ToolLayout({ children, error }: ToolLayoutProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {children}
      </div>
      {error && (
        <div
          className="bg-error-bg border border-error/20 rounded-lg px-4 py-3 text-sm text-error mb-4"
          role="alert"
          style={{ animation: 'slideDown 200ms ease-out' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

interface PanelProps {
  label: string;
  action?: ReactNode;
  children: ReactNode;
}

export function InputPanel({ label, action, children }: PanelProps) {
  return (
    <div className="bg-surface-1 border border-surface-2 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-2 text-xs text-text-muted uppercase tracking-wider font-medium">
        {label}
        {action}
      </div>
      {children}
    </div>
  );
}

export function OutputPanel({ label, action, children }: PanelProps) {
  return (
    <div className="bg-surface-1 border border-surface-2 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-2 text-xs text-text-muted uppercase tracking-wider font-medium">
        {label}
        {action}
      </div>
      {children}
    </div>
  );
}

interface ExplanationProps {
  title: string;
  children: ReactNode;
}

export function Explanation({ title, children }: ExplanationProps) {
  return (
    <div className="bg-surface-1 border border-surface-2 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-muted mb-2">{title}</h3>
      {children}
    </div>
  );
}
