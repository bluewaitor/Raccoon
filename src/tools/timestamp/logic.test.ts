import { describe, it, expect } from 'vitest';
import { parseTimestamp, nowTimestamp } from './logic';

describe('parseTimestamp', () => {
  it('parses Unix epoch in seconds', () => {
    const result = parseTimestamp('1700000000');
    expect(result).not.toHaveProperty('error');
    if (!('error' in result)) {
      expect(result.unix).toBe(1700000000);
      expect(result.iso).toBe('2023-11-14T22:13:20.000Z');
    }
  });

  it('parses Unix epoch in milliseconds', () => {
    const result = parseTimestamp('1700000000000');
    expect(result).not.toHaveProperty('error');
    if (!('error' in result)) {
      expect(result.unix).toBe(1700000000);
    }
  });

  it('parses negative epoch (pre-1970)', () => {
    const result = parseTimestamp('-1000000000');
    expect(result).not.toHaveProperty('error');
    if (!('error' in result)) {
      expect(result.unix).toBe(-1000000000);
      expect(result.iso).toContain('1938');
    }
  });

  it('parses ISO 8601 string', () => {
    const result = parseTimestamp('2024-01-01T00:00:00Z');
    expect(result).not.toHaveProperty('error');
    if (!('error' in result)) {
      expect(result.iso).toBe('2024-01-01T00:00:00.000Z');
    }
  });

  it('parses human-readable date string', () => {
    const result = parseTimestamp('January 1, 2024');
    expect(result).not.toHaveProperty('error');
  });

  it('returns error for unrecognizable input', () => {
    const result = parseTimestamp('not a date');
    expect(result).toHaveProperty('error');
  });

  it('returns error for empty input', () => {
    const result = parseTimestamp('');
    expect(result).toHaveProperty('error');
  });

  it('returns error for empty whitespace', () => {
    const result = parseTimestamp('   ');
    expect(result).toHaveProperty('error');
  });

  it('includes relative time', () => {
    const result = parseTimestamp('1700000000');
    if (!('error' in result)) {
      expect(result.relative).toMatch(/ago|from now/);
    }
  });

  it('handles future timestamps', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const result = parseTimestamp(String(future));
    if (!('error' in result)) {
      expect(result.relative).toContain('from now');
    }
  });
});

describe('nowTimestamp', () => {
  it('returns current timestamp', () => {
    const before = Math.floor(Date.now() / 1000);
    const result = nowTimestamp();
    const after = Math.floor(Date.now() / 1000);
    expect(result.unix).toBeGreaterThanOrEqual(before);
    expect(result.unix).toBeLessThanOrEqual(after);
    expect(result.iso).toBeTruthy();
    expect(result.rfc).toBeTruthy();
  });
});
