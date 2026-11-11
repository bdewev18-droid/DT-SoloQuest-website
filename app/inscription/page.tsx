"use client";
import { FormEvent, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../components/AuthProvider";
import { withBase } from "../components/base-path";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../components/LanguageProvider";

export default function Page() {
  const { session, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const rg = t.register;
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}${withBase("/inscription")}` },
    });
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget);
    const display_name = String(f.get("display_name") || "");
    const { error: p } = await supabase
      .from("tester_profiles")
      .upsert({ id: session.user.id, email: session.user.email, display_name, status: "pending" });
    const { error: a } = await supabase
      .from("tester_applications")
      .upsert(
        { user_id: session.user.id, experience: f.get("experience"), motivation: f.get("motivation") },
        { onConflict: "user_id" }
      );
    if (p || a) {
      setMessage(rg.dbNotInitialized);
    } else {
      await refreshProfile();
      setMessage(rg.applicationSaved);
    }
    setBusy(false);
  };

  return (
    <main className="subPage">
      <SiteHeader />
      <section className="subHero shell">
        <p className="eyebrow">
          <span />
          {rg.eyebrow}
        </p>
        <h1>{rg.title}</h1>
        <p className="lead">{rg.lead}</p>
      </section>
      <section className="contentGrid shell">
        {!session ? (
          <article className="panel">
            <h2>{rg.firstStepTitle}</h2>
            <p>{rg.firstStepCopy}</p>
            <button className="button fire" onClick={login}>
              {rg.continueGoogle}
            </button>
          </article>
        ) : (
          <form className="panel form" onSubmit={submit}>
            <span className="statusBadge">
              {profile?.status === "approved" ? rg.approvedBadge : rg.applicationBadge}
            </span>
            <label>
              {rg.nicknameLabel}
              <input
                name="display_name"
                required
                defaultValue={profile?.display_name || session.user.user_metadata?.full_name || ""}
              />
            </label>
            <label>
              {rg.emailLabel}
              <input value={session.user.email || ""} readOnly />
            </label>
            <label>
              {rg.experienceLabel}
              <select name="experience" required defaultValue="">
                <option value="" disabled>
                  {rg.experiencePlaceholder}
                </option>
                {rg.experienceOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </label>
            <label>
              {rg.motivationLabel}
              <textarea name="motivation" required placeholder={rg.motivationPlaceholder} />
            </label>
            <button className="button fire" disabled={busy}>
              {busy ? rg.savingButton : rg.saveButton}
            </button>
            {message && <p className="formNotice">{message}</p>}
          </form>
        )}
        <aside className="panel">
          <h2>{rg.nextTitle}</h2>
          <p>{rg.nextCopy}</p>
        </aside>
      </section>
    </main>
  );
}
