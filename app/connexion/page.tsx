"use client";
import { useState } from "react";
import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../components/AuthProvider";
import { withBase } from "../components/base-path";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../components/LanguageProvider";

export default function Page() {
  const { session, profile, isAdmin } = useAuth();
  const { t } = useLanguage();
  const lg = t.login;
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
          <p className="kicker">{lg.connectedKicker}</p>
          <h1>{lg.welcomeTitle}</h1>
          <p className="lead">{approved ? lg.activeAccess : lg.pendingAccess}</p>
          <Link className="button fire" href={approved ? "/espace-testeur" : "/inscription"}>
            {approved ? lg.openSpace : lg.completeApplication}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="subPage">
      <SiteHeader />
      <section className="subHero shell">
        <p className="kicker">{lg.memberKicker}</p>
        <h1>{lg.title}</h1>
        <p className="lead">{lg.lead}</p>
      </section>
      <section className="contentGrid shell">
        <article className="panel">
          <span className="statusBadge">{lg.secureBadge}</span>
          <h2>{lg.continueGoogle}</h2>
          <p>{lg.googlePrivacy}</p>
          <button className="button fire" type="button" onClick={login} disabled={busy}>
            {busy ? lg.redirecting : lg.continueGoogle}
          </button>
          {error && <p className="formError">{error}</p>}
        </article>
        <aside className="panel">
          <h2>{lg.notTesterTitle}</h2>
          <p>{lg.notTesterCopy}</p>
          <Link className="button light" href="/inscription">
            {lg.becomeTester}
          </Link>
        </aside>
      </section>
    </main>
  );
}
