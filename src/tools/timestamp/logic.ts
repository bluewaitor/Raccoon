export interface TimestampResult {
  unix: number;
  iso: string;
  rfc: string;
  relative: string;
}

export interface TimestampError {
  error: string;
}

export type ParseResult = TimestampResult | TimestampError;

function toRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? 'ago' : 'from now';

  if (abs < 60_000) return `${Math.floor(abs / 1000)}s ${suffix}`;
  if (abs < 3_600_000) return `${Math.floor(abs / 60_000)}m ${suffix}`;
  if (abs < 86_400_000) return `${Math.floor(abs / 3_600_000)}h ${suffix}`;
  if (abs < 2_629_746_000) return `${Math.floor(abs / 86_400_000)}d ${suffix}`;
  return `${Math.floor(abs / 2_629_746_000)}mo ${suffix}`;
}

export function parseTimestamp(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { error: 'Empty input' };

  // Try as Unix epoch (seconds or milliseconds)
  const num = Number(trimmed);
  if (!isNaN(num) && isFinite(num)) {
    const ms = Math.abs(num) > 9999999999 ? num : num * 1000;
    try {
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        return { error: 'Date is outside the representable range (year 100–9999).' };
      }
      return {
        unix: Math.floor(ms / 1000),
        iso: date.toISOString(),
        rfc: date.toUTCString(),
        relative: toRelative(date),
      };
    } catch {
      return { error: 'Date is outside the representable range.' };
    }
  }

  // Try as date string
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    return {
      unix: Math.floor(date.getTime() / 1000),
      iso: date.toISOString(),
      rfc: date.toUTCString(),
      relative: toRelative(date),
    };
  }

  return {
    error: "Couldn't parse this as a timestamp. Try Unix epoch (e.g., 1700000000), ISO 8601, or a date string.",
  };
}

export function nowTimestamp(): TimestampResult {
  const date = new Date();
  return {
    unix: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    rfc: date.toUTCString(),
    relative: 'just now',
  };
}
