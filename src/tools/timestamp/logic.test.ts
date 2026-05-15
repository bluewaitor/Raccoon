import { describe, it, expect } from 'vitest';
import { parseTimestamp, nowTimestamp } from './logic';

const mockT = (key: string) => `[${key}]`;

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
      expect(result.relative).toMatch(/timestamp\.ago|timestamp\.fromNow/);
    }
  });

  it('handles future timestamps', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    const result = parseTimestamp(String(future));
    if (!('error' in result)) {
      expect(result.relative).toContain('timestamp.fromNow');
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

describe('parseTimestamp with t function', () => {
  it('uses t for empty error', () => {
    const result = parseTimestamp('', mockT);
    expect(result).toEqual({ error: '[timestamp.error.empty]' });
  });

  it('uses t for unrecognized input', () => {
    const result = parseTimestamp('not a date', mockT);
    expect(result).toEqual({ error: '[timestamp.error.unrecognized]' });
  });

  it('uses t for relative time with past timestamp', () => {
    const result = parseTimestamp('1700000000', mockT);
    if (!('error' in result)) {
      expect(result.relative).toContain('[timestamp.ago]');
    }
  });

  it('uses t for seconds unit in relative time', () => {
    const secondsAgo = Math.floor(Date.now() / 1000) - 30;
    const result = parseTimestamp(String(secondsAgo), mockT);
    if (!('error' in result)) {
      expect(result.relative).toContain('[timestamp.secondsShort]');
    }
  });

  it('uses t for minutes unit in relative time', () => {
    const minutesAgo = Math.floor(Date.now() / 1000) - 120;
    const result = parseTimestamp(String(minutesAgo), mockT);
    if (!('error' in result)) {
      expect(result.relative).toContain('[timestamp.minutesShort]');
    }
  });

  it('uses t for hours unit in relative time', () => {
    const hoursAgo = Math.floor(Date.now() / 1000) - 7200;
    const result = parseTimestamp(String(hoursAgo), mockT);
    if (!('error' in result)) {
      expect(result.relative).toContain('[timestamp.hoursShort]');
    }
  });

  it('uses t for months unit in relative time', () => {
    // ~400 days ago to get into months range
    const monthsAgo = Math.floor(Date.now() / 1000) - 400 * 86400;
    const result = parseTimestamp(String(monthsAgo), mockT);
    if (!('error' in result)) {
      expect(result.relative).toContain('[timestamp.monthsShort]');
    }
  });

  it('returns error for extremely large epoch', () => {
    const result = parseTimestamp('999999999999999999999999999', mockT);
    expect(result).toHaveProperty('error');
  });
});

describe('nowTimestamp with t function', () => {
  it('uses t for justNow', () => {
    const result = nowTimestamp(mockT);
    expect(result.relative).toBe('[timestamp.justNow]');
  });
});
