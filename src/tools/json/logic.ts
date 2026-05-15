export interface FormatResult {
  ok: true;
  formatted: string;
}

export interface FormatError {
  ok: false;
  error: string;
}

export type Result = FormatResult | FormatError;

export function formatJSON(input: string): Result {
  if (!input.trim()) {
    return { ok: true, formatted: '' };
  }
  try {
    const parsed = JSON.parse(input);
    return { ok: true, formatted: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    const posMatch = msg.match(/position (\d+)/i);
    const pos = posMatch ? ` at position ${posMatch[1]}` : '';
    return { ok: false, error: `Invalid JSON: unexpected token${pos}` };
  }
}

export function minifyJSON(input: string): Result {
  if (!input.trim()) {
    return { ok: true, formatted: '' };
  }
  try {
    const parsed = JSON.parse(input);
    return { ok: true, formatted: JSON.stringify(parsed) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    const posMatch = msg.match(/position (\d+)/i);
    const pos = posMatch ? ` at position ${posMatch[1]}` : '';
    return { ok: false, error: `Invalid JSON: unexpected token${pos}` };
  }
}
