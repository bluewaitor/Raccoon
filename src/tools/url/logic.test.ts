import { describe, it, expect } from 'vitest';
import { encode, decode } from './logic';

describe('encode', () => {
  it('encodes special characters', () => {
    const result = encode('hello world');
    expect(result).toEqual({ ok: true, output: 'hello%20world' });
  });

  it('encodes Unicode', () => {
    const result = encode('开发者');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain('%');
    }
  });

  it('does not encode unreserved characters', () => {
    const result = encode('abcABC123-_.~');
    expect(result).toEqual({ ok: true, output: 'abcABC123-_.~' });
  });

  it('encodes query string characters', () => {
    const result = encode('a=1&b=2');
    expect(result).toEqual({ ok: true, output: 'a%3D1%26b%3D2' });
  });

  it('encodes empty string', () => {
    expect(encode('')).toEqual({ ok: true, output: '' });
  });

  it('is reversible — encode then decode returns original', () => {
    const original = 'hello world & <special>';
    const encoded = encode(original);
    if (encoded.ok) {
      const decoded = decode(encoded.output);
      expect(decoded).toEqual({ ok: true, output: original });
    }
  });
});

describe('decode', () => {
  it('decodes percent-encoded string', () => {
    expect(decode('hello%20world')).toEqual({ ok: true, output: 'hello world' });
  });

  it('returns empty for empty input', () => {
    expect(decode('')).toEqual({ ok: true, output: '' });
  });

  it('returns error for invalid percent encoding', () => {
    const result = decode('%ZZ');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('Invalid URL encoding');
    }
  });

  it('handles double-encoded strings (single decode only)', () => {
    const result = decode('%2520');
    expect(result).toEqual({ ok: true, output: '%20' });
  });

  it('decodes Unicode round-trip', () => {
    const encoded = encode('日本語テスト');
    if (encoded.ok) {
      const result = decode(encoded.output);
      expect(result).toEqual({ ok: true, output: '日本語テスト' });
    }
  });

  it('decodes full URL', () => {
    const result = decode('https%3A%2F%2Fexample.com%2Fpath%3Fq%3Dhello');
    expect(result).toEqual({ ok: true, output: 'https://example.com/path?q=hello' });
  });
});
