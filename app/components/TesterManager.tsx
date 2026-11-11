"use client";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "./LanguageProvider";

type Tester = {
  id: string;
  email: string;
  display_name: string | null;
  user_id: string | null;
  status: "active" | "disabled";
  added_at: string;
  last_login_at: string | null;
};

export function TesterManager() {
  const { t, locale } = useLanguage();
  const tm = t.testerManager;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  const [testers, setTesters] = useState<Tester[]>([]);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("site_testers")
      .select("id,email,display_name,user_id,status,added_at,last_login_at")
      .order("added_at", { ascending: false });
    if (error) setNotice(error.message);
    else setTesters((data || []) as Tester[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const addTester = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(normalized)) {
      setNotice(tm.invalidGmail);
      return;
    }
    setBusy(true);
    setNotice("");
    const { error } = await supabase
      .from("site_testers")
      .upsert({ email: normalized, status: "active", added_by: "bdewev18@gmail.com" }, { onConflict: "email" });
    setBusy(false);
    if (error) setNotice(error.message);
    else {
      setEmail("");
      setNotice(tm.addedNotice);
      await load();
    }
  };

  const removeTester = async (id: string) => {
    setBusy(true);
    const { error } = await supabase.from("site_testers").delete().eq("id", id);
    setBusy(false);
    if (error) setNotice(error.message);
    else {
      setNotice(tm.removedNotice);
      await load();
    }
  };

  return (
    <div className="panel testerManager">
      <div className="testerManagerHead">
        <div>
          <span className="statusBadge">{tm.badge}</span>
          <h2>{tm.title}</h2>
          <p>{tm.copy}</p>
        </div>
        <form onSubmit={addTester}>
          <label>
            {tm.emailLabel}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tester@gmail.com"
              required
            />
          </label>
          <button className="button fire" disabled={busy}>
            {busy ? t.common.saving : tm.addTester}
          </button>
        </form>
      </div>
      {notice && <p className="formNotice">{notice}</p>}
      <div className="testerList">
        {testers.length === 0 ? (
          <p>{tm.emptyList}</p>
        ) : (
          testers.map((tester) => (
            <article key={tester.id}>
              <div>
                <strong>{tester.display_name || tester.email}</strong>
                {tester.display_name && <small>{tester.email}</small>}
                <span className={`testerConnection ${tester.user_id ? "linked" : "waiting"}`}>
                  {tester.user_id ? tm.linked : tm.waiting}
                </span>
              </div>
              <div>
                <small>
                  {tester.last_login_at
                    ? `${tm.lastLogin} ${new Date(tester.last_login_at).toLocaleDateString(dateLocale)}`
                    : tm.neverLoggedIn}
                </small>
                <button type="button" onClick={() => removeTester(tester.id)} disabled={busy}>
                  {tm.remove}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
