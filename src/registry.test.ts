import { describe, it, expect } from 'vitest';
import { getTools, findTool } from './registry';

const mockT = (key: string) => `[${key}]`;

describe('getTools', () => {
  it('returns all 4 tools', () => {
    const tools = getTools(mockT);
    expect(tools).toHaveLength(4);
  });

  it('translates tool names via t function', () => {
    const tools = getTools(mockT);
    expect(tools[0]!.name).toBe('[json.name]');
    expect(tools[0]!.description).toBe('[json.description]');
  });

  it('preserves keywords and icon', () => {
    const tools = getTools(mockT);
    expect(tools[0]!.keywords).toContain('json');
    expect(tools[0]!.icon).toBe('{ }');
  });

  it('includes all expected tool ids', () => {
    const tools = getTools(mockT);
    const ids = tools.map((t) => t.id);
    expect(ids).toEqual(['json', 'timestamp', 'base64', 'url']);
  });
});

describe('findTool', () => {
  it('finds existing tool by id', () => {
    const tool = findTool('json', mockT);
    expect(tool).toBeDefined();
    expect(tool!.id).toBe('json');
    expect(tool!.name).toBe('[json.name]');
  });

  it('returns undefined for unknown id', () => {
    const tool = findTool('nonexistent', mockT);
    expect(tool).toBeUndefined();
  });
});
