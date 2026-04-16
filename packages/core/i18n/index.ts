import { en } from "./en";
import { zh } from "./zh";

export const translations = {
  en,
  zh,
} as const;

export type TranslationKey = keyof typeof en;
export type Translation = typeof en;