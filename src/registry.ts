import { lazy, type LazyExoticComponent, type ComponentType } from 'react';
import type { TranslationKey } from './i18n/types';

export interface ToolRegistration {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
  component: LazyExoticComponent<ComponentType>;
}

const toolDefs: {
  id: string;
  nameKey: TranslationKey;
  descKey: TranslationKey;
  keywords: string[];
  icon: string;
  component: LazyExoticComponent<ComponentType>;
}[] = [
  {
    id: 'json',
    nameKey: 'json.name',
    descKey: 'json.description',
    keywords: ['json', 'format', 'minify', 'validate', 'pretty'],
    icon: '{ }',
    component: lazy(() => import('./tools/json/Tool')),
  },
  {
    id: 'timestamp',
    nameKey: 'timestamp.name',
    descKey: 'timestamp.description',
    keywords: ['timestamp', 'time', 'date', 'epoch', 'unix', 'iso'],
    icon: 'TS',
    component: lazy(() => import('./tools/timestamp/Tool')),
  },
  {
    id: 'base64',
    nameKey: 'base64.name',
    descKey: 'base64.description',
    keywords: ['base64', 'b64', 'encode', 'decode'],
    icon: 'B64',
    component: lazy(() => import('./tools/base64/Tool')),
  },
  {
    id: 'url',
    nameKey: 'url.name',
    descKey: 'url.description',
    keywords: ['url', 'uri', 'encode', 'decode', 'percent'],
    icon: 'URL',
    component: lazy(() => import('./tools/url/Tool')),
  },
];

export function getTools(t: (key: TranslationKey) => string): ToolRegistration[] {
  return toolDefs.map((d) => ({
    id: d.id,
    name: t(d.nameKey),
    description: t(d.descKey),
    keywords: d.keywords,
    icon: d.icon,
    component: d.component,
  }));
}

export function findTool(id: string, t: (key: TranslationKey) => string): ToolRegistration | undefined {
  return getTools(t).find((tool) => tool.id === id);
}
