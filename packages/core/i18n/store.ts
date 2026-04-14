import { create } from "zustand";

export type Language = "en" | "zh";

export interface I18nState {
  language: Language;
  setLanguage: (language: Language) => void;
  initializeFromCookie: () => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  language: "en",
  setLanguage: (language) => set({ language }),
  initializeFromCookie: () => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)harness-locale=(\w+)/);
      const locale = match?.[1];
      if (locale === "zh") {
        set({ language: "zh" });
        document.documentElement.lang = "zh";
      } else {
        set({ language: "en" });
        document.documentElement.lang = "en";
      }
    }
  },
}));