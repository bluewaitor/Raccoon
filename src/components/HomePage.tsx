import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Command } from 'cmdk';
import { getTools } from '../registry';
import { useT } from '../i18n/context';

export function HomePage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useT();
  const tools = getTools(t);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const selectTool = useCallback(
    (id: string) => {
      setOpen(false);
      navigate({ to: '/tool/$toolId', params: { toolId: id } });
    },
    [navigate],
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] px-6">
      <div className="text-center mb-12">
        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer text-2xl text-text-muted hover:text-text-secondary transition-colors"
        >
          {t('home.searchPrompt')}
        </div>
        <div className="mt-2 text-sm text-text-dim">{t('home.tagline')}</div>
        <div className="mt-1 text-sm text-text-dim">
          {t('home.pressToStart')}
          <kbd className="bg-surface-2 border border-surface-3 rounded px-1.5 py-0.5 text-[11px] font-mono">
            ⌘K
          </kbd>
          {t('home.toStart')}
        </div>
      </div>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search tools"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[120px]"
      >
        <div
          className="fixed inset-0 bg-black/60"
          onClick={() => setOpen(false)}
          style={{ animation: 'fadeIn 150ms ease-out' }}
        />
        <div
          className="relative bg-surface-1 border border-surface-3 rounded-xl w-full max-w-[520px] overflow-hidden shadow-2xl"
          style={{ animation: 'scaleIn 150ms ease-out' }}
        >
          <Command.Input
            placeholder={t('home.searchPlaceholder')}
            className="w-full bg-transparent border-b border-surface-2 px-4 py-4 text-text-primary text-base outline-none placeholder:text-text-dim"
          />
          <Command.List className="p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-muted">
              {t('home.emptyTools')}
            </Command.Empty>
            {tools.map((tool) => (
              <Command.Item
                key={tool.id}
                value={`${tool.name} ${tool.keywords.join(' ')}`}
                onSelect={() => selectTool(tool.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-text-muted data-[selected=true]:bg-accent-muted data-[selected=true]:text-text-primary transition-colors"
              >
                <div className="w-8 h-8 bg-surface-2 rounded-md flex items-center justify-center text-sm font-mono text-text-secondary">
                  {tool.icon}
                </div>
                <div>
                  <div className="text-sm text-text-primary">{tool.name}</div>
                  <div className="text-xs text-text-dim">{tool.description}</div>
                </div>
              </Command.Item>
            ))}
          </Command.List>
        </div>
      </Command.Dialog>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
