import { useMemo } from "react";
import { translations } from "../i18n";
import { useI18nStore } from "../i18n/store";

const defaultLanguage: keyof typeof translations = "en";

export function useTranslation() {
  const language = useI18nStore((state) => state.language);

  const t = useMemo(() => {
    const trans = translations[language] || translations[defaultLanguage];

    return (key: string, fallback?: string): string => {
      const keys = key.split(".");
      let value: any = trans;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      return typeof value === "string" ? value : (fallback || key);
    };
  }, [language]);

  return { t, language };
}