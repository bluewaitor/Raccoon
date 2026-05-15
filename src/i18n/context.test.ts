import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { I18nProvider, useT } from './context';

describe('getInitialLocale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns Chinese strings by default when nothing stored', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.locale).toBe('zh');
    expect(result.current.t('common.copy')).toBe('复制');
  });

  it('restores English from localStorage', () => {
    localStorage.setItem('raccoon-locale', 'en');
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.locale).toBe('en');
    expect(result.current.t('common.copy')).toBe('Copy');
  });

  it('restores Chinese from localStorage', () => {
    localStorage.setItem('raccoon-locale', 'zh');
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.locale).toBe('zh');
  });

  it('falls back to zh for invalid stored value', () => {
    localStorage.setItem('raccoon-locale', 'fr');
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.locale).toBe('zh');
  });
});

describe('setLocale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('switches from zh to en', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(result.current.locale).toBe('en');
    expect(result.current.t('common.copy')).toBe('Copy');
  });

  it('roundtrips zh -> en -> zh', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(result.current.locale).toBe('en');
    act(() => { result.current.setLocale('zh'); });
    expect(result.current.locale).toBe('zh');
    expect(result.current.t('common.copy')).toBe('复制');
  });

  it('persists locale to localStorage', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(localStorage.getItem('raccoon-locale')).toBe('en');
  });

  it('sets document lang to en when switching to English', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(document.documentElement.lang).toBe('en');
  });

  it('sets document lang to zh-CN when switching to Chinese', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    act(() => { result.current.setLocale('zh'); });
    expect(document.documentElement.lang).toBe('zh-CN');
  });

  it('survives localStorage.setItem throwing', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(() => act(() => { result.current.setLocale('en'); })).not.toThrow();
    expect(result.current.locale).toBe('en');
    spy.mockRestore();
  });

  it('survives localStorage.getItem throwing (getInitialLocale)', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    expect(result.current.locale).toBe('zh');
    spy.mockRestore();
  });
});

describe('t function', () => {
  beforeEach(() => {
    localStorage.clear();
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

  it('does not replace when var placeholder missing from template', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    // 'common.copy' has no {var} placeholder
    const val = result.current.t('common.copy' as any, { nonexistent: 'X' });
    expect(val).toBe('复制');
  });

  it('replaces multiple variables', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    // Use a key with {char} and verify it works with multiple vars passed
    const val = result.current.t('url.error.invalidWithChar', { char: 'A', extra: 'B' });
    expect(val).toContain('A');
  });
});

describe('useT guard', () => {
  it('throws when used outside I18nProvider', () => {
    // Suppress console.error from React
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useT())).toThrow('useT must be used within I18nProvider');
    spy.mockRestore();
  });
});

describe('document title sync', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets document title to Chinese by default', () => {
    renderHook(() => useT(), { wrapper: I18nProvider });
    expect(document.title).toBe('Raccoon — 开发者工具箱');
  });

  it('updates document title when switching to English', () => {
    const { result } = renderHook(() => useT(), { wrapper: I18nProvider });
    act(() => { result.current.setLocale('en'); });
    expect(document.title).toBe('Raccoon — Developer Toolbox');
  });
});
