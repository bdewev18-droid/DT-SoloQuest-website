"use client";

import { useLanguage } from "./LanguageProvider";

export const SITE_VERSION = "1.6.0";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="siteFooter">
      <span>{t.footer.hubTitle}</span>
      <span>
        {t.footer.versionPrefix}
        {SITE_VERSION}
      </span>
    </footer>
  );
}
