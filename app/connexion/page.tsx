"use client";
import { useState } from "react";
import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../components/AuthProvider";
import { withBase } from "../components/base-path";
import { supabase } from "../lib/supabase";

export default function Page() {
  const { session, profile, isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setBusy(true);
    setError("");
    const retour = new URLSearchParams(location.search).get("retour") || withBase("/espace-testeur");
    const redirectTo = `${location.origin}${withBase("/connexion")}?retour=${encodeURIComponent(retour)}`;
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  if (session) {
    const approved = isAdmin || profile?.status === "approved";
    return (
      <main className="subPage">
        <SiteHeader />
        <section className="subHero shell">
          <p className="kicker">Connected account</p>
          <h1>Welcome</h1>
          <p className="lead">
            {approved
              ? "Your tester access is active."
              : "Your Google account is connected. Your application still needs approval."}
          </p>
          <Link className="button fire" href={approved ? "/espace-testeur" : "/inscription"}>
            {approved ? "Open my space" : "Complete my application"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="subPage">
      <SiteHeader />
      <section className="subHero shell">
        <p className="kicker">Member access</p>
        <h1>Login</h1>
        <p className="lead">Sign in with Google to find your application, feedback and private access.</p>
      </section>
      <section className="contentGrid shell">
        <article className="panel">
          <span className="statusBadge">Secure login</span>
          <h2>Continue with Google</h2>
          <p>Your Google password is never shared with Solo Quest.</p>
          <button className="button fire" type="button" onClick={login} disabled={busy}>
            {busy ? "Redirecting…" : "Continue with Google"}
          </button>
          {error && <p className="formError">{error}</p>}
        </article>
        <aside className="panel">
          <h2>Not a tester yet?</h2>
          <p>Sign in with Google first, then complete your application.</p>
          <Link className="button light" href="/inscription">
            Become a tester
          </Link>
        </aside>
      </section>
    </main>
  );
}
