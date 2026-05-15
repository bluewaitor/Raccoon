import { describe, it, expect } from 'vitest';
import { encode, decode } from './logic';

describe('encode', () => {
  it('encodes ASCII text', () => {
    expect(encode('hello')).toEqual({ ok: true, output: 'aGVsbG8=' });
  });

  it('encodes empty string', () => {
    expect(encode('')).toEqual({ ok: true, output: '' });
  });

  it('encodes Unicode text (Chinese)', () => {
    const result = encode('开发者工具');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const decoded = decode(result.output);
      expect(decoded).toEqual({ ok: true, output: '开发者工具' });
    }
  });

  it('encodes emoji', () => {
    const result = encode('🦝');
    expect(result.ok).toBe(true);
    if (result.ok) {
      const decoded = decode(result.output);
      expect(decoded).toEqual({ ok: true, output: '🦝' });
    }
  });

  it('is reversible — encode then decode returns original', () => {
    const original = 'Hello, World! 123';
    const encoded = encode(original);
    if (encoded.ok) {
      const decoded = decode(encoded.output);
      expect(decoded).toEqual({ ok: true, output: original });
    }
  });

  it('encodes special characters', () => {
    const result = encode('<>&"\'');
    expect(result.ok).toBe(true);
  });
});

describe('decode', () => {
  it('decodes valid Base64', () => {
    expect(decode('aGVsbG8=')).toEqual({ ok: true, output: 'hello' });
  });

  it('returns empty for empty input', () => {
    expect(decode('')).toEqual({ ok: true, output: '' });
  });

  it('returns error for invalid Base64', () => {
    const result = decode('!!!invalid!!!');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('base64.error.invalid');
    }
  });

  it('includes position in error for invalid characters', () => {
    const result = decode('abc!!!def');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('base64.error.atPosition');
    }
  });

  it('handles Base64 without padding', () => {
    const result = decode('aGVsbG8');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toBe('hello');
    }
  });

  it('decodes Unicode round-trip', () => {
    const encoded = encode('日本語テスト');
    if (encoded.ok) {
      const result = decode(encoded.output);
      expect(result).toEqual({ ok: true, output: '日本語テスト' });
    }
  });
});
