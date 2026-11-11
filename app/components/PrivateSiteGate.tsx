"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";
import { useLanguage } from "./LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function PrivateSiteGate({ children }: { children: React.ReactNode }) {
  const { session, loading, isAdmin, isTester } = useAuth();
  const { t } = useLanguage();
  const pg = t.privateGate;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const connexionPath = `${basePath}/connexion`;
    if (!loading && (isAdmin || isTester) && (location.pathname === "/connexion" || location.pathname === connexionPath)) {
      const target = new URLSearchParams(location.search).get("retour") || `${basePath}/`;
      location.replace(target);
    }
  }, [loading, isAdmin, isTester]);

  const login = async () => {
    setBusy(true);
    setError("");
    const redirectUrl = `${location.origin}${basePath}/connexion?retour=${encodeURIComponent(`${basePath}/`)}`;
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.replace(`${basePath}/`);
  };

  const connexionPath = `${basePath}/connexion`;
  if (loading || ((isAdmin || isTester) && (location.pathname === "/connexion" || location.pathname === connexionPath))) {
    return (
      <main className="privateGate">
        <div className="privateGateLoader" aria-label={pg.loadingAria} />
      </main>
    );
  }

  if (isAdmin || isTester) return <>{children}</>;

  return (
    <main className="privateGate">
      <div className="privateGateGlow" />
      <section className="privateGateCard">
        <img src={`${basePath}/app_icon.png`} width="210" height="210" alt={t.common.brand} />
        {session ? (
          <>
            <p className="privateGateEyebrow">{pg.privateAccess}</p>
            <h1>{pg.restrictedTitle}</h1>
            <p>{pg.restrictedCopy}</p>
            <button className="button light" onClick={signOut}>
              {pg.useAnotherAccount}
            </button>
          </>
        ) : (
          <>
            <p className="privateGateEyebrow">{t.common.brand}</p>
            <h1>{pg.privateBetaTitle}</h1>
            <p>{pg.privateBetaCopy}</p>
            <button className="button fire googleLogin" onClick={login} disabled={busy}>
              <span aria-hidden="true">G</span>
              {busy ? pg.redirecting : pg.testerLoginGoogle}
            </button>
            {error && <p className="formError">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
}
