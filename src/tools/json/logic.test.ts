import { describe, it, expect } from 'vitest';
import { formatJSON, minifyJSON } from './logic';

describe('formatJSON', () => {
  it('formats minified JSON', () => {
    const result = formatJSON('{"name":"raccoon","version":1}');
    expect(result).toEqual({
      ok: true,
      formatted: '{\n  "name": "raccoon",\n  "version": 1\n}',
    });
  });

  it('is idempotent — formatting already-formatted JSON produces same output', () => {
    const formatted = '{\n  "name": "raccoon"\n}';
    const result = formatJSON(formatted);
    expect(result).toEqual({ ok: true, formatted });
  });

  it('returns empty string for empty input', () => {
    expect(formatJSON('')).toEqual({ ok: true, formatted: '' });
    expect(formatJSON('   ')).toEqual({ ok: true, formatted: '' });
  });

  it('returns error for invalid JSON', () => {
    const result = formatJSON('{invalid}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('json.error.invalid');
    }
  });

  it('includes position in error for syntax errors', () => {
    const result = formatJSON('{"a": 1,}');
    expect(result.ok).toBe(false);
  });

  it('handles deeply nested JSON', () => {
    let obj: Record<string, unknown> = { value: 1 };
    for (let i = 0; i < 50; i++) {
      obj = { nested: obj };
    }
    const input = JSON.stringify(obj);
    const result = formatJSON(input);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.formatted).toContain('nested');
    }
  });

  it('handles Unicode in JSON values', () => {
    const result = formatJSON('{"emoji":"🦝","chinese":"开发者工具"}');
    expect(result).toEqual({
      ok: true,
      formatted: '{\n  "emoji": "🦝",\n  "chinese": "开发者工具"\n}',
    });
  });

  it('handles arrays', () => {
    const result = formatJSON('[1,2,3]');
    expect(result).toEqual({
      ok: true,
      formatted: '[\n  1,\n  2,\n  3\n]',
    });
  });

  it('handles null and boolean values', () => {
    const result = formatJSON('{"a":null,"b":true,"c":false}');
    expect(result.ok).toBe(true);
  });

  it('handles numbers', () => {
    const result = formatJSON('{"int":42,"float":3.14,"neg":-1,"exp":1e10}');
    expect(result.ok).toBe(true);
  });
});

describe('minifyJSON', () => {
  it('minifies formatted JSON', () => {
    const result = minifyJSON('{\n  "name": "raccoon"\n}');
    expect(result).toEqual({ ok: true, formatted: '{"name":"raccoon"}' });
  });

  it('is idempotent — minifying already-minified JSON produces same output', () => {
    const minified = '{"name":"raccoon"}';
    const result = minifyJSON(minified);
    expect(result).toEqual({ ok: true, formatted: minified });
  });

  it('returns empty string for empty input', () => {
    expect(minifyJSON('')).toEqual({ ok: true, formatted: '' });
  });

  it('returns error for invalid JSON', () => {
    const result = minifyJSON('{invalid}');
    expect(result.ok).toBe(false);
  });
});
