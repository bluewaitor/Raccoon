export interface Base64Result {
  ok: true;
  output: string;
}

export interface Base64Error {
  ok: false;
  error: string;
}

export type Result = Base64Result | Base64Error;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFn = (key: any) => string;

export function encode(input: string, t: TFn = (k) => k): Result {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return { ok: true, output: encoded };
  } catch {
    return { ok: false, error: t('base64.error.encodeFailed') };
  }
}

export function decode(input: string, t: TFn = (k) => k): Result {
  if (!input.trim()) {
    return { ok: true, output: '' };
  }
  try {
    const decoded = decodeURIComponent(escape(atob(input.trim())));
    return { ok: true, output: decoded };
  } catch {
    const match = input.match(/[^A-Za-z0-9+/=]/);
    const pos = match?.index;
    const posMsg = pos !== undefined ? t('base64.error.atPosition') + pos : '';
    return { ok: false, error: t('base64.error.invalid') + posMsg + t('base64.error.period') };
  }
}
