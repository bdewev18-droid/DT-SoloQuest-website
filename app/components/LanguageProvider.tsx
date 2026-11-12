"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { Locale, Translations, translations } from "../i18n";

const STORAGE_KEY = "soloquest_locale";
const LOCALE_EVENT = "soloquest-locale-change";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "fr";
}

function getClientLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
    if (typeof navigator !== "undefined") {
      const candidates =
        navigator.languages && navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language];
      for (const raw of candidates) {
        if (!raw) continue;
        const clean = raw.toLowerCase();
        if (clean.startsWith("fr")) return "fr";
        if (clean.startsWith("en")) return "en";
      }
    }
  } catch {
    // Ignore storage access errors in restricted browsers.
  }
  return "en";
}

function getServerLocale(): Locale {
  return "en";
}

function subscribeLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_EVENT, onStoreChange);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getClientLocale, getServerLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors.
    }
    window.dispatchEvent(new Event(LOCALE_EVENT));
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
