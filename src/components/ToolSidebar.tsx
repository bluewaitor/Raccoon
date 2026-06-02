import { useNavigate, useRouterState } from '@tanstack/react-router';
import { getTools } from '../registry';
import { useT } from '../i18n/context';

export function ToolSidebar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { t } = useT();
  const tools = getTools(t);
  const activeToolId = pathname.startsWith('/tool/') ? pathname.split('/tool/')[1] : null;

  return (
    <aside className="border-b border-surface-2 bg-surface-0/95 px-4 py-3 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] md:w-[260px] md:shrink-0 md:border-b-0 md:border-r md:px-4 md:py-5">
      <div className="mb-3 hidden px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim md:block">
        {t('common.tools')}
      </div>
      <nav
        aria-label={t('common.tools')}
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-col md:gap-1.5 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {tools.map((tool) => {
          const active = tool.id === activeToolId;

          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => navigate({ to: '/tool/$toolId', params: { toolId: tool.id } })}
              aria-current={active ? 'page' : undefined}
              className={[
                'group flex min-w-[190px] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors md:min-w-0',
                active
                  ? 'border-accent/40 bg-accent-muted text-text-primary'
                  : 'border-transparent text-text-muted hover:border-surface-3 hover:bg-surface-1 hover:text-text-primary',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-xs',
                  active
                    ? 'border-accent/30 bg-accent text-white'
                    : 'border-surface-3 bg-surface-1 text-text-secondary group-hover:border-surface-4',
                ].join(' ')}
              >
                {tool.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{tool.name}</span>
                <span className="block truncate text-xs text-text-dim">{tool.description}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
