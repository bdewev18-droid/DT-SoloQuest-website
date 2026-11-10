"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";
import { avatarUrl } from "./AvatarPicker";
import { HardLink as Link } from "./HardLink";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type HeaderProfile = { display_name: string; avatar_key: string };

export function SiteHeader() {
  const { session, isTester, isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [headerProfile, setHeaderProfile] = useState<HeaderProfile | null>(null);
  const approved = isAdmin || isTester;

  const signOut = async () => {
    await supabase.auth.signOut();
    location.href = `${basePath}/`;
  };

  useEffect(() => {
    if (!session) {
      setHeaderProfile(null);
      return;
    }
    if (isAdmin) {
      setHeaderProfile({ display_name: "Admin", avatar_key: "Barbarian.png" });
      return;
    }
    supabase
      .from("tester_public_profiles")
      .select("display_name,avatar_key")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setHeaderProfile(data as HeaderProfile | null));
  }, [session, isAdmin]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="siteHeader">
      <nav className="mainNav shell" aria-label="Main navigation">
        <div className="navSide navLeft">
          <Link href="/modes/minion-rush">Minion Rush</Link>
          <Link href="/modes/boss-battle">Boss Battle</Link>
        </div>
        <Link className="centerLogo" href="/" aria-label="Solo Quest — home">
          <img src={`${basePath}/app_icon.png`} alt="Solo Quest" width="106" height="106" />
        </Link>
        <div className="navSide navRight">
          {!loading && approved && <Link href="/espace-testeur">Tester Space</Link>}
          {!loading && isAdmin && <Link href="/admin">Admin</Link>}
          {!loading && !session && (
            <Link className="loginLink" href="/connexion">
              <span aria-hidden="true">●</span> Login
            </Link>
          )}
          {!loading && session && headerProfile && (
            <div className="profileMenu">
              <button
                className="profileMenuTrigger profileMenuTriggerIntegrated"
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
              >
                <img src={avatarUrl(headerProfile.avatar_key)} alt="" />
                <span>{headerProfile.display_name}</span>
                <i aria-hidden="true">⌄</i>
              </button>
              {profileOpen && (
                <div className="profileDropdown">
                  <div className="profileDropdownIdentity">
                    <img src={avatarUrl(headerProfile.avatar_key)} alt="" />
                    <span>
                      <small>Connected as</small>
                      <b>{headerProfile.display_name}</b>
                    </span>
                  </div>
                  {!isAdmin && <Link href="/espace-testeur?editProfile=1">Edit my profile</Link>}
                  {isAdmin && <Link href="/admin">Administration</Link>}
                  <button onClick={signOut} type="button">
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className="burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`mobileMenu ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="mobileMenuInner">
            <Link href="/modes/minion-rush">Minion Rush</Link>
            <Link href="/modes/boss-battle">Boss Battle</Link>
            {!loading && approved && <Link href="/espace-testeur">Tester Space</Link>}
            {!loading && isAdmin && <Link href="/admin">Administration</Link>}
            {!loading && !session && <Link href="/connexion">Login</Link>}
            {!loading && session && headerProfile && (
              <div className="mobileProfile">
                <img src={avatarUrl(headerProfile.avatar_key)} alt="" />
                <b>{headerProfile.display_name}</b>
              </div>
            )}
            {!loading && session && !isAdmin && (
              <Link href="/espace-testeur?editProfile=1">Edit my profile</Link>
            )}
            {!loading && session && (
              <button onClick={signOut} type="button">
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
