import { en } from "./en";
import { fr } from "./fr";

export type Locale = "en" | "fr";

type DeepWiden<T> = T extends readonly (infer U)[]
  ? DeepWiden<U>[]
  : T extends object
    ? { [K in keyof T]: DeepWiden<T[K]> }
    : T extends string
      ? string
      : T;

/**
 * Schema derived from `en.ts`.
 * When adding new text to the site, add the key to `app/i18n/en.ts` and TypeScript
 * will require its French counterpart in `app/i18n/fr.ts`.
 */
export type Translations = DeepWiden<typeof en>;

export const LOCALES: { code: Locale; label: string; short: string; flag: string }[] = [
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
];

export const translations: Record<Locale, Translations> = {
  en,
  fr,
};

/**
 * Helper for ad-hoc bilingual values when not stored in `en.ts` / `fr.ts`.
 * Enforces both `en` and `fr` keys at compile time.
 */
export function pickLocale<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale];
}
