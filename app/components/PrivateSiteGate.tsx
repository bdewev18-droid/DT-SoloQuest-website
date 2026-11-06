"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function PrivateSiteGate({ children }: { children: React.ReactNode }) {
  const { session, loading, isAdmin, isTester } = useAuth();
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
      options: { redirectTo: redirectUrl }
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
        <div className="privateGateLoader" aria-label="Loading" />
      </main>
    );
  }

  if (isAdmin || isTester) return <>{children}</>;

  return (
    <main className="privateGate">
      <div className="privateGateGlow" />
      <section className="privateGateCard">
        <img src={`${basePath}/app_icon.png`} width="210" height="210" alt="Solo Quest" />
        {session ? (
          <>
            <p className="privateGateEyebrow">Private access</p>
            <h1>Access restricted</h1>
            <p>This Google account is not on the approved tester list. Contact the administrator if you should have access.</p>
            <button className="button light" onClick={signOut}>Use another account</button>
          </>
        ) : (
          <>
            <p className="privateGateEyebrow">Solo Quest</p>
            <h1>Private beta</h1>
            <p>Only approved testers can enter the adventure.</p>
            <button className="button fire googleLogin" onClick={login} disabled={busy}>
              <span aria-hidden="true">G</span>
              {busy ? "Redirecting…" : "Tester login with Google"}
            </button>
            {error && <p className="formError">{error}</p>}
          </>
        )}
      </section>
    </main>
  );
}
