export interface UrlResult {
  ok: true;
  output: string;
}

export interface UrlError {
  ok: false;
  error: string;
}

export type Result = UrlResult | UrlError;

export function encode(input: string): Result {
  try {
    const encoded = encodeURIComponent(input);
    return { ok: true, output: encoded };
  } catch {
    return { ok: false, error: 'Failed to URL-encode input.' };
  }
}

export function decode(input: string): Result {
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
        error: `Invalid URL encoding: '${match[0]}' is not a valid percent-encoded sequence.`,
      };
    }
    return { ok: false, error: 'Invalid URL encoding: malformed percent-encoded sequence.' };
  }
}
