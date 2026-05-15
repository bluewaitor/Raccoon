export interface FormatResult {
  ok: true;
  formatted: string;
}

export interface FormatError {
  ok: false;
  error: string;
}

export type Result = FormatResult | FormatError;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = (key: any) => string;

export function formatJSON(input: string, t: TFn = (k) => k): Result {
  if (!input.trim()) {
    return { ok: true, formatted: '' };
  }
  try {
    const parsed = JSON.parse(input);
    return { ok: true, formatted: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    const posMatch = msg.match(/position (\d+)/i);
    const pos = posMatch ? t('json.error.atPosition') + posMatch[1] : '';
    return { ok: false, error: t('json.error.invalid') + pos };
  }
}

export function minifyJSON(input: string, t: TFn = (k) => k): Result {
  if (!input.trim()) {
    return { ok: true, formatted: '' };
  }
  try {
    const parsed = JSON.parse(input);
    return { ok: true, formatted: JSON.stringify(parsed) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    const posMatch = msg.match(/position (\d+)/i);
    const pos = posMatch ? t('json.error.atPosition') + posMatch[1] : '';
    return { ok: false, error: t('json.error.invalid') + pos };
  }
}
