import { createRootRoute, createRoute, createRouter, createHashHistory, RouterProvider, Outlet } from '@tanstack/react-router';
import { I18nProvider } from './i18n/context';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ToolPage } from './components/ToolPage';

const hashHistory = createHashHistory();

const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <div className="min-h-screen bg-surface-0">
        <Header />
        <Outlet />
      </div>
    );
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tool/$toolId',
  component: ToolPage,
});

const routeTree = rootRoute.addChildren([homeRoute, toolRoute]);

const router = createRouter({
  routeTree,
  history: hashHistory,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
