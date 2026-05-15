import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Command } from 'cmdk';
import { findTool, getTools } from '../registry';
import { useT } from '../i18n/context';

export function ToolPage() {
  const { toolId } = useParams({ from: '/tool/$toolId' });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { t } = useT();
  const tool = findTool(toolId, t);
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

  if (!tool) {
    return (
      <main className="max-w-[960px] mx-auto px-6 py-8">
        <div className="text-text-muted">{t('tool.notFound')}</div>
      </main>
    );
  }

  const ToolComponent = tool.component;

  return (
    <>
      <main className="max-w-[960px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">{tool.name}</h1>
          <p className="text-sm text-text-muted leading-relaxed">{tool.description}</p>
        </div>
        <ToolComponent />
      </main>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search tools"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[120px]"
      >
        <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
        <div className="relative bg-surface-1 border border-surface-3 rounded-xl w-full max-w-[520px] overflow-hidden shadow-2xl">
          <Command.Input
            placeholder={t('tool.searchPlaceholder')}
            className="w-full bg-transparent border-b border-surface-2 px-4 py-4 text-text-primary text-base outline-none placeholder:text-text-dim"
          />
          <Command.List className="p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-muted">
              {t('tool.noToolsFound')}
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
    </>
  );
}
