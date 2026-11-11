"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, Locale } from "../i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher({
  compact = false,
  onSelect,
}: {
  compact?: boolean;
  onSelect?: () => void;
}) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = LOCALES.find((item) => item.code === locale) || LOCALES[1];

  const handleChoose = (code: Locale) => {
    setLocale(code);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div className={`langMenu ${compact ? "compact" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="langTrigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.header.switchLanguageAria}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{compact ? active.short : active.label}</span>
        <i aria-hidden="true">⌄</i>
      </button>

      {open && (
        <div className="langDropdown" role="listbox" aria-label={t.header.languageLabel}>
          {LOCALES.map((item) => {
            const selected = item.code === locale;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={selected}
                className={selected ? "selected" : ""}
                onClick={() => handleChoose(item.code)}
              >
                <span className="langFlag" aria-hidden="true">{item.flag}</span>
                <span className="langName">{item.label}</span>
                <span className="langCode">{item.short}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
