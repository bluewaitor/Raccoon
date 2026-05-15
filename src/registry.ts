import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

export interface ToolRegistration {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
  component: LazyExoticComponent<ComponentType>;
}

export const tools: ToolRegistration[] = [
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Format, minify, and validate JSON data',
    keywords: ['json', 'format', 'minify', 'validate', 'pretty'],
    icon: '{ }',
    component: lazy(() => import('./tools/json/Tool')),
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix, ISO 8601, RFC 2822, and relative time',
    keywords: ['timestamp', 'time', 'date', 'epoch', 'unix', 'iso'],
    icon: 'TS',
    component: lazy(() => import('./tools/timestamp/Tool')),
  },
  {
    id: 'base64',
    name: 'Base64 Encoder',
    description: 'Encode or decode Base64 strings',
    keywords: ['base64', 'b64', 'encode', 'decode'],
    icon: 'B64',
    component: lazy(() => import('./tools/base64/Tool')),
  },
  {
    id: 'url',
    name: 'URL Encoder',
    description: 'Encode or decode URL components and query strings',
    keywords: ['url', 'uri', 'encode', 'decode', 'percent'],
    icon: 'URL',
    component: lazy(() => import('./tools/url/Tool')),
  },
];

export function findTool(id: string): ToolRegistration | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): ToolRegistration[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q)),
  );
}
