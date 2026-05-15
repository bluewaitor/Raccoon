import zh from './zh.json';

export type Locale = 'zh' | 'en';
export type TranslationKey = keyof typeof zh;
export type Translations = Record<TranslationKey, string>;
