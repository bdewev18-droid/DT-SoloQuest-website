"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";
import { avatarUrl } from "./AvatarPicker";
import { HardLink as Link } from "./HardLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type HeaderProfile = { display_name: string; avatar_key: string };

export function SiteHeader() {
  const { session, isTester, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [headerProfile, setHeaderProfile] = useState<HeaderProfile | null>(null);
  const approved = isAdmin || isTester;

  const signOut = async () => {
    await supabase.auth.signOut();
    location.href = `${basePath}/`;
  };

  useEffect(() => {
    let active = true;
    if (session && !isAdmin) {
      supabase
        .from("tester_public_profiles")
        .select("display_name,avatar_key")
        .eq("user_id", session.user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (active) {
            setHeaderProfile(data as HeaderProfile | null);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [session, isAdmin]);

  const activeProfile = !session
    ? null
    : isAdmin
    ? { display_name: "Admin", avatar_key: "Barbarian.png" }
    : headerProfile;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="siteHeader">
      <nav className="mainNav shell" aria-label={t.header.navLabel}>
        <div className="navSide navLeft">
          <Link href="/modes/minion-rush">{t.header.minionRush}</Link>
          <Link href="/modes/boss-battle">{t.header.bossBattle}</Link>
        </div>
        <div className="langMobileHeader">
          <LanguageSwitcher compact />
        </div>
        <Link className="centerLogo" href="/" aria-label={t.header.homeAria}>
          <img src={`${basePath}/app_icon.png`} alt="Solo Quest" width="106" height="106" />
        </Link>
        <div className="navSide navRight">
          <Link href="/jouer">{t.header.play}</Link>
          {!loading && approved && <Link href="/espace-testeur">{t.header.testerSpace}</Link>}
          {!loading && isAdmin && <Link href="/admin">{t.header.admin}</Link>}
          <div className="navUserStack">
            <LanguageSwitcher compact />
            {!loading && !session && (
              <Link className="loginLink" href="/connexion">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t.header.login}
              </Link>
            )}
            {!loading && session && activeProfile && (
              <div className="profileMenu">
                <button
                  className="profileMenuTrigger profileMenuTriggerIntegrated"
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                >
                  <img src={avatarUrl(activeProfile.avatar_key)} alt="" />
                  <span>{activeProfile.display_name}</span>
                  <i aria-hidden="true">⌄</i>
                </button>
                {profileOpen && (
                  <div className="profileDropdown">
                    <div className="profileDropdownIdentity">
                      <img src={avatarUrl(activeProfile.avatar_key)} alt="" />
                      <span>
                        <small>{t.header.connectedAs}</small>
                        <b>{activeProfile.display_name}</b>
                      </span>
                    </div>
                    {!isAdmin && <Link href="/espace-testeur?editProfile=1">{t.header.editProfile}</Link>}
                    {isAdmin && <Link href="/admin">{t.header.administration}</Link>}
                    <button onClick={signOut} type="button">
                      {t.header.logOut}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          className="burger"
          type="button"
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`mobileMenu ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="mobileMenuInner">
            <Link href="/modes/minion-rush" onClick={() => setOpen(false)}>{t.header.minionRush}</Link>
            <Link href="/modes/boss-battle" onClick={() => setOpen(false)}>{t.header.bossBattle}</Link>
            <Link href="/jouer" onClick={() => setOpen(false)}>{t.header.play}</Link>
            {!loading && approved && <Link href="/espace-testeur" onClick={() => setOpen(false)}>{t.header.testerSpace}</Link>}
            {!loading && isAdmin && <Link href="/admin" onClick={() => setOpen(false)}>{t.header.administration}</Link>}
            {!loading && !session && <Link href="/connexion" onClick={() => setOpen(false)}>{t.header.login}</Link>}
            {!loading && session && activeProfile && (
              <div className="mobileProfile">
                <img src={avatarUrl(activeProfile.avatar_key)} alt="" />
                <b>{activeProfile.display_name}</b>
              </div>
            )}
            {!loading && session && !isAdmin && (
              <Link href="/espace-testeur?editProfile=1" onClick={() => setOpen(false)}>{t.header.editProfile}</Link>
            )}
            {!loading && session && (
              <button onClick={signOut} type="button">
                {t.header.logOut}
              </button>
            )}
            <div className="mobileLangRow">
              <span>{t.header.languageLabel}</span>
              <LanguageSwitcher onSelect={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
