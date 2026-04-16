import { useMemo } from "react";
import { translations } from "../i18n";
import { useI18nStore } from "../i18n/store";

const defaultLanguage: keyof typeof translations = "en";

export function useTranslation() {
  // Check if we're on the client side
  const isClient = typeof window !== "undefined";

  let language: keyof typeof translations = defaultLanguage;

  if (isClient) {
    // First try to get from cookie directly for immediate availability
    const match = document.cookie.match(/(?:^|;\s*)harness-locale=(\w+)/);
    const cookieLang = match?.[1];
    if (cookieLang === "zh" || cookieLang === "en") {
      language = cookieLang;
    } else {
      // Fallback to store
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        language = useI18nStore((state) => state.language);
      } catch {
        // If hook fails, use default language
        language = defaultLanguage;
      }
    }
  }

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