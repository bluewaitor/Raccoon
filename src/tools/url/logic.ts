export interface UrlResult {
  ok: true;
  output: string;
}

export interface UrlError {
  ok: false;
  error: string;
}

export type Result = UrlResult | UrlError;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = (key: any) => string;

export function encode(input: string, t: TFn = (k) => k): Result {
  try {
    const encoded = encodeURIComponent(input);
    return { ok: true, output: encoded };
  } catch {
    return { ok: false, error: t('url.error.encodeFailed') };
  }
}

export function decode(input: string, t: TFn = (k) => k): Result {
  if (!input.trim()) {
    return { ok: true, output: '' };
  }
  try {
    const decoded = decodeURIComponent(input.trim());
    return { ok: true, output: decoded };
  } catch {
    const match = input.match(/%[0-9A-Fa-f]?[^0-9A-Fa-f]/);
    if (match) {
      return {
        ok: false,
        error: t('url.error.invalidWithChar').replace('{char}', match[0]),
      };
    }
    return { ok: false, error: t('url.error.invalidGeneric') };
  }
}
