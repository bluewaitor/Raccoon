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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = (key: any) => string;

function toRelative(date: Date, t: TFn): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const suffix = diff > 0 ? t('timestamp.ago') : t('timestamp.fromNow');

  if (abs < 60_000) return `${Math.floor(abs / 1000)}${t('timestamp.secondsShort')} ${suffix}`;
  if (abs < 3_600_000) return `${Math.floor(abs / 60_000)}${t('timestamp.minutesShort')} ${suffix}`;
  if (abs < 86_400_000) return `${Math.floor(abs / 3_600_000)}${t('timestamp.hoursShort')} ${suffix}`;
  if (abs < 2_629_746_000) return `${Math.floor(abs / 86_400_000)}${t('timestamp.daysShort')} ${suffix}`;
  return `${Math.floor(abs / 2_629_746_000)}${t('timestamp.monthsShort')} ${suffix}`;
}

export function parseTimestamp(input: string, t: TFn = (k) => k): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { error: t('timestamp.error.empty') };

  const num = Number(trimmed);
  if (!isNaN(num) && isFinite(num)) {
    const ms = Math.abs(num) > 9999999999 ? num : num * 1000;
    try {
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        return { error: t('timestamp.error.outOfRange') };
      }
      return {
        unix: Math.floor(ms / 1000),
        iso: date.toISOString(),
        rfc: date.toUTCString(),
        relative: toRelative(date, t),
      };
    } catch {
      return { error: t('timestamp.error.outOfRangeShort') };
    }
  }

  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    return {
      unix: Math.floor(date.getTime() / 1000),
      iso: date.toISOString(),
      rfc: date.toUTCString(),
      relative: toRelative(date, t),
    };
  }

  return {
    error: t('timestamp.error.unrecognized'),
  };
}

export function nowTimestamp(t: TFn = (k) => k): TimestampResult {
  const date = new Date();
  return {
    unix: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    rfc: date.toUTCString(),
    relative: t('timestamp.justNow'),
  };
}
