export interface Base64Result {
  ok: true;
  output: string;
}

export interface Base64Error {
  ok: false;
  error: string;
}

export type Result = Base64Result | Base64Error;

export function encode(input: string): Result {
  try {
    const encoded = btoa(unescape(encodeURIComponent(input)));
    return { ok: true, output: encoded };
  } catch {
    return { ok: false, error: 'Failed to encode input.' };
  }
}

export function decode(input: string): Result {
  if (!input.trim()) {
    return { ok: true, output: '' };
  }
  try {
    const decoded = decodeURIComponent(escape(atob(input.trim())));
    return { ok: true, output: decoded };
  } catch {
    const match = input.match(/[^A-Za-z0-9+/=]/);
    const pos = match?.index;
    const posMsg = pos !== undefined ? ` at position ${pos}` : '';
    return { ok: false, error: `Invalid Base64: characters outside the Base64 alphabet found${posMsg}.` };
  }
}
