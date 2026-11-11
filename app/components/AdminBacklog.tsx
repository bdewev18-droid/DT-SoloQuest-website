"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { avatarUrl } from "./AvatarPicker";
import { useLanguage } from "./LanguageProvider";

type Status = "en_attente" | "consulte" | "valide" | "rejete" | "en_cours_dev" | "a_tester" | "cloture";
type Report = {
  id: string;
  user_id: string;
  kind: string;
  mode: string;
  subject: string;
  details: string;
  status: Status;
  admin_comment: string | null;
  screenshot_url: string | null;
  admin_screenshot_urls: string[];
  created_at: string;
};
type Profile = { user_id: string; display_name: string; avatar_key: string };
type Like = { feedback_id: string };

export function AdminBacklog() {
  const { t, locale } = useLanguage();
  const ab = t.adminBacklog;
  const statuses = t.testerSpace.statuses;
  const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";

  const [reports, setReports] = useState<Report[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [r, p, l] = await Promise.all([
      supabase
        .from("tester_feedback")
        .select("id,user_id,kind,mode,subject,details,status,admin_comment,screenshot_url,admin_screenshot_urls,created_at")
        .order("created_at", { ascending: false }),
      supabase.from("tester_public_profiles").select("user_id,display_name,avatar_key"),
      supabase.from("tester_feedback_votes").select("feedback_id"),
    ]);
    setReports((r.data || []) as Report[]);
    setProfiles((p.data || []) as Profile[]);
    setLikes((l.data || []) as Like[]);
  };

  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    setProofFiles([]);
    setNotice("");
  }, [selected]);

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.user_id, p])), [profiles]);
  const active = reports.find((r) => r.id === selected) || null;
  const filtered = reports.filter((r) => filter === "all" || r.status === filter);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(statuses).map((status) => [status, reports.filter((r) => r.status === status).length])
      ) as Record<string, number>,
    [reports, statuses]
  );
  const likeCount = (id: string) => likes.filter((l) => l.feedback_id === id).length;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!active) return;
    setSaving(true);
    setNotice(ab.savingUpdate);
    try {
      const f = new FormData(e.currentTarget);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(ab.sessionUnavailable);
      const uploaded = await Promise.all(
        proofFiles.slice(0, 4).map(async (file) => {
          const ext = file.name.split(".").pop()?.toLowerCase() || "png";
          const path = `${user.id}/admin-corrections/${active.id}/${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage
            .from("report-screenshots")
            .upload(path, file, { contentType: file.type, upsert: false });
          if (error) throw error;
          return supabase.storage.from("report-screenshots").getPublicUrl(path).data.publicUrl;
        })
      );
      const { error } = await supabase
        .from("tester_feedback")
        .update({
          status: f.get("status"),
          admin_comment: f.get("admin_comment"),
          admin_screenshot_urls: [...(active.admin_screenshot_urls || []), ...uploaded],
          updated_at: new Date().toISOString(),
        })
        .eq("id", active.id);
      if (error) throw error;
      setProofFiles([]);
      setNotice(ab.updatedSuccess);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : ab.unableToSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="adminBacklog">
      <div className="backlogToolbar">
        <div>
          <p className="eyebrow">
            <span />
            {ab.eyebrow}
          </p>
          <h2>{ab.title}</h2>
          <p className="backlogIntro">{ab.intro}</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">
            {ab.allStatuses} · {reports.length}
          </option>
          {Object.entries(statuses).map(([k, v]) => (
            <option value={k} key={k}>
              {v} · {counts[k] || 0}
            </option>
          ))}
        </select>
      </div>
      <div className="statusOverview">
        {Object.entries(statuses).map(([key, label]) => (
          <button
            key={key}
            className={`${filter === key ? "active" : ""} ${key}`}
            onClick={() => setFilter(filter === key ? "all" : key)}
          >
            <span className={`statusDot ${key}`} />
            <b>{counts[key] || 0}</b>
            <small>{label}</small>
          </button>
        ))}
      </div>
      <div className="adminBacklogGrid">
        <div className="backlogList">
          <div className="backlogListHeader">
            <span>{ab.colReport}</span>
            <span>{ab.colStatusLikes}</span>
          </div>
          {filtered.map((r) => {
            const p = profileMap[r.user_id];
            return (
              <button
                className={selected === r.id ? "selected" : ""}
                onClick={() => setSelected(r.id)}
                key={r.id}
              >
                <img src={avatarUrl(p?.avatar_key || "Barbarian.png")} alt="" />
                <span>
                  <small>
                    {r.kind} · {r.mode}
                  </small>
                  <strong>{r.subject}</strong>
                  <em>
                    {p?.display_name || t.testerSpace.colTester} ·{" "}
                    {new Date(r.created_at).toLocaleDateString(dateLocale)}
                  </em>
                </span>
                <span className="backlogMeta">
                  <i className={`reportStatus ${r.status}`}>{statuses[r.status]}</i>
                  <em>♥ {likeCount(r.id)}</em>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && <p className="emptyBacklogList">{ab.emptyReports}</p>}
        </div>
        {active ? (
          <form className="panel backlogDetail" onSubmit={save}>
            <div className="backlogDetailHead">
              <img src={avatarUrl(profileMap[active.user_id]?.avatar_key || "Barbarian.png")} alt="" />
              <div>
                <p className="eyebrow">
                  <span />
                  {active.kind} · {active.mode}
                </p>
                <h3>{active.subject}</h3>
                <small>
                  {profileMap[active.user_id]?.display_name || t.testerSpace.colTester} · ♥{" "}
                  {likeCount(active.id)} {ab.likesWord}
                </small>
              </div>
              <span className={`currentStatus ${active.status}`}>
                {ab.currentStatus}
                <strong>{statuses[active.status]}</strong>
              </span>
            </div>
            <div className="backlogReportBody">
              <h4>{ab.testerReport}</h4>
              <p>{active.details}</p>
              {active.screenshot_url && (
                <div className="evidenceGallery single">
                  <a href={active.screenshot_url} target="_blank" rel="noreferrer">
                    <img src={active.screenshot_url} alt={ab.testerAttachmentAlt} />
                    <span>{ab.openTesterImage}</span>
                  </a>
                </div>
              )}
            </div>
            <fieldset className="statusEditor">
              <legend>{ab.updateStatus}</legend>
              <div>
                {Object.entries(statuses).map(([key, label]) => (
                  <label className={key} key={key}>
                    <input
                      type="radio"
                      name="status"
                      value={key}
                      defaultChecked={key === active.status}
                      key={`${active.id}-${key}`}
                    />
                    <span>
                      <i className={`statusDot ${key}`} />
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="adminCommentField">
              <span>{ab.adminResponseLabel}</span>
              <small>{ab.adminResponseHint}</small>
              <textarea
                name="admin_comment"
                defaultValue={active.admin_comment || ""}
                key={`${active.id}-comment`}
                placeholder={ab.adminResponsePlaceholder}
              />
            </label>
            <section className="adminProofField">
              <div>
                <span>{ab.correctionImagesLabel}</span>
                <small>{ab.correctionImagesHint}</small>
              </div>
              {active.admin_screenshot_urls?.length > 0 && (
                <div className="evidenceGallery">
                  {active.admin_screenshot_urls.map((url, index) => (
                    <a href={url} target="_blank" rel="noreferrer" key={url}>
                      <img src={url} alt={`${ab.proofPrefix} ${index + 1}`} />
                      <span>
                        {ab.proofPrefix} {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              <label className="proofUpload">
                {ab.addCorrectionImages}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={(e) => setProofFiles(Array.from(e.target.files || []).slice(0, 4))}
                />
              </label>
              {proofFiles.length > 0 && (
                <div className="pendingProofs">
                  {proofFiles.map((file) => (
                    <span key={`${file.name}-${file.size}`}>{file.name}</span>
                  ))}
                </div>
              )}
            </section>
            <div className="backlogSaveBar">
              <span>{ab.saveNote}</span>
              <button className="button fire" disabled={saving}>
                {saving ? t.common.saving : ab.saveTreatment}
              </button>
            </div>
            {notice && <p className="formNotice">{notice}</p>}
          </form>
        ) : (
          <div className="panel backlogEmpty">
            <span className="statusBadge">{ab.emptySelectBadge}</span>
            <h3>{ab.emptySelectTitle}</h3>
            <p>{ab.emptySelectCopy}</p>
          </div>
        )}
      </div>
    </section>
  );
}
