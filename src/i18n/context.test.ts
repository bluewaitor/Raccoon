import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useT } from './context';

describe('useT', () => {
  it('returns Chinese strings by default', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.t('common.copy')).toBe('复制');
  });

  it('switches to English', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(result.current.t('common.copy')).toBe('Copy');
  });

  it('returns key as fallback for missing translations', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.t('nonexistent.key' as any)).toBe('nonexistent.key');
  });

  it('supports interpolation with {var}', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    const val = result.current.t('url.error.invalidWithChar', { char: '%ZZ' });
    expect(val).toContain('%ZZ');
  });
});
