import { useNavigate, useRouterState } from '@tanstack/react-router';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === '/';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-2.5 text-lg font-semibold text-text-primary hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center text-sm font-mono text-white font-bold">
            R
          </div>
          <span className="font-mono">Raccoon</span>
        </button>
        <LanguageToggle />
      </div>
      <button
        onClick={() => {
          if (isHome) {
            const input = document.querySelector<HTMLInputElement>('[cmdk-input]');
            input?.focus();
          } else {
            navigate({ to: '/' });
          }
        }}
        className="flex items-center gap-2 bg-surface-1 border border-surface-3 rounded-lg px-4 py-2 text-text-muted text-sm cursor-pointer min-w-[280px] hover:border-surface-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search tools...
        <kbd className="ml-auto bg-surface-2 border border-surface-3 rounded px-1.5 py-0.5 text-[11px] text-text-muted font-mono">
          ⌘K
        </kbd>
      </button>
    </header>
  );
}
