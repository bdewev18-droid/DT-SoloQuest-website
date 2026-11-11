"use client";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { ProtectedPage } from "../components/ProtectedPage";
import {
  ContentMap,
  HeroSettings,
  SiteFeatureSettings,
  applyContent,
  applyHeroSettings,
  defaultHeroSettings,
  defaultSiteFeatureSettings,
  editableTextNodes,
} from "../components/ContentManager";
import { TesterManager } from "../components/TesterManager";
import { supabase } from "../lib/supabase";
import { AdminBacklog } from "../components/AdminBacklog";
import { useLanguage } from "../components/LanguageProvider";

export default function Page() {
  const { t } = useLanguage();
  const ad = t.admin;
  const pages = ad.pages;

  const [tab, setTab] = useState<"content" | "testers" | "backlog">("content");
  const [page, setPage] = useState("/");
  const [values, setValues] = useState<ContentMap>({});
  const valuesRef = useRef<ContentMap>({});
  const [defaults, setDefaults] = useState<ContentMap>({});
  const [settings, setSettings] = useState<HeroSettings>(defaultHeroSettings);
  const settingsRef = useRef(settings);
  const [features, setFeatures] = useState<SiteFeatureSettings>(defaultSiteFeatureSettings);
  const [featureBusy, setFeatureBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    Promise.all([
      supabase.from("site_content").select("draft,published").eq("page_path", "/__home_image").maybeSingle(),
      supabase.from("site_content").select("draft,published").eq("page_path", "/__site_features").maybeSingle(),
    ]).then(([hero, siteFeatures]) => {
      setSettings({ ...defaultHeroSettings, ...(hero.data?.draft || hero.data?.published || {}) } as HeroSettings);
      setFeatures({
        ...defaultSiteFeatureSettings,
        ...(siteFeatures.data?.published || siteFeatures.data?.draft || {}),
      } as SiteFeatureSettings);
    });
  }, []);

  const loadContent = async (path: string) => {
    setLoading(true);
    setNotice("");
    setDefaults({});
    const { data } = await supabase.from("site_content").select("draft,published").eq("page_path", path).maybeSingle();
    const next = (data?.draft || data?.published || {}) as ContentMap;
    valuesRef.current = next;
    setValues(next);
    setLoading(false);
  };

  useEffect(() => {
    void loadContent(page);
  }, [page]);

  const inspectFrame = () => {
    let attempts = 0;
    const inspect = () => {
      const doc = frame.current?.contentDocument;
      const root = doc?.querySelector("main");
      const nodes = root ? editableTextNodes(root) : [];
      if (!root || root.classList.contains("privateGate") || nodes.length < 3) {
        if (attempts++ < 40) setTimeout(inspect, 250);
        return;
      }
      const base = Object.fromEntries(nodes.map((n, i) => [`t${i}`, n.nodeValue?.trim() || ""])) as ContentMap;
      setDefaults(base);
      applyContent(root, valuesRef.current);
      applyHeroSettings(doc!.documentElement, settingsRef.current);
    };
    inspect();
  };

  useEffect(() => {
    const doc = frame.current?.contentDocument;
    const root = doc?.querySelector("main");
    if (root && !root.classList.contains("privateGate")) applyContent(root, values);
  }, [values]);

  const change = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    const root = frame.current?.contentDocument?.querySelector("main");
    if (root) {
      const node = editableTextNodes(root)[Number(key.slice(1))];
      if (node) node.nodeValue = value;
    }
  };

  const changeSetting = (key: keyof HeroSettings, value: number) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    const doc = frame.current?.contentDocument;
    if (doc) applyHeroSettings(doc.documentElement, next);
  };

  const toggleRecruitment = async () => {
    const next = { recruitmentEnabled: !features.recruitmentEnabled };
    setFeatureBusy(true);
    const { error } = await supabase
      .from("site_content")
      .upsert(
        { page_path: "/__site_features", draft: next, published: next, updated_at: new Date().toISOString() },
        { onConflict: "page_path" }
      );
    if (!error) setFeatures(next);
    setNotice(
      error
        ? `${ad.unableToUpdateRecruitment} ${error.message}`
        : `${ad.recruitmentNowPrefix} ${next.recruitmentEnabled ? ad.active.toLowerCase() : ad.inactive.toLowerCase()}.`
    );
    setFeatureBusy(false);
  };

  const save = async (publish: boolean) => {
    setNotice(ad.savingNotice);
    const stamp = new Date().toISOString();
    const contentPayload = publish
      ? { page_path: page, draft: values, published: values, updated_at: stamp }
      : { page_path: page, draft: values, updated_at: stamp };
    const requests = [supabase.from("site_content").upsert(contentPayload, { onConflict: "page_path" })];
    if (page === "/") {
      const settingsPayload = publish
        ? { page_path: "/__home_image", draft: settings, published: settings, updated_at: stamp }
        : { page_path: "/__home_image", draft: settings, updated_at: stamp };
      requests.push(supabase.from("site_content").upsert(settingsPayload, { onConflict: "page_path" }));
    }
    const results = await Promise.all(requests);
    const error = results.find((r) => r.error)?.error;
    setNotice(error ? `${ad.unableToSave} ${error.message}` : publish ? ad.publishedNotice : ad.draftNotice);
  };

  const resetDraft = () => {
    setValues(defaults);
    if (page === "/") setSettings(defaultHeroSettings);
    setNotice(ad.restoredNotice);
  };

  const Range = ({
    label,
    name,
    min,
    max,
    suffix,
  }: {
    label: string;
    name: keyof HeroSettings;
    min: number;
    max: number;
    suffix: string;
  }) => (
    <label className="cmsRange">
      <span>{label}</span>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={settings[name]}
          onChange={(e) => changeSetting(name, Number(e.target.value))}
        />
        <output>
          {settings[name]}
          {suffix}
        </output>
      </div>
    </label>
  );

  return (
    <main className="subPage">
      <SiteHeader />
      <ProtectedPage admin>
        <section className="subHero shell cmsIgnore">
          <p className="eyebrow">
            <span />
            {ad.eyebrow}
          </p>
          <h1>{ad.title}</h1>
          <p className="lead">{ad.lead}</p>
        </section>
        <section className="shell adminSection cmsIgnore">
          <section className="panel recruitmentSettings">
            <div>
              <p className="eyebrow">
                <span />
                {ad.recruitmentEyebrow}
              </p>
              <h2>{ad.recruitmentTitle}</h2>
              <p>{ad.recruitmentCopy}</p>
            </div>
            <div className={`featureState ${features.recruitmentEnabled ? "enabled" : "disabled"}`}>
              <strong>{features.recruitmentEnabled ? ad.active : ad.inactive}</strong>
              <span>{features.recruitmentEnabled ? ad.zonesVisible : ad.zonesHidden}</span>
              <button
                className={features.recruitmentEnabled ? "danger" : "publish"}
                type="button"
                onClick={toggleRecruitment}
                disabled={featureBusy}
              >
                {featureBusy ? ad.updating : features.recruitmentEnabled ? ad.disableRecruitment : ad.enableRecruitment}
              </button>
            </div>
            {notice && <p className="formNotice">{notice}</p>}
          </section>

          <div className="adminTabs">
            <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>
              {ad.tabContent}
            </button>
            <button className={tab === "testers" ? "active" : ""} onClick={() => setTab("testers")}>
              {ad.tabTesters}
            </button>
            <button className={tab === "backlog" ? "active" : ""} onClick={() => setTab("backlog")}>
              {ad.tabBacklog}
            </button>
          </div>

          {tab === "content" ? (
            <div className="cmsWorkspace">
              <aside className="panel cmsEditor">
                <div className="cmsToolbar">
                  <label>
                    {ad.pageLabel}
                    <select value={page} onChange={(e) => setPage(e.target.value)}>
                      {pages.map((p) => (
                        <option value={p.path} key={p.path}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <button onClick={() => save(false)}>{ad.saveDraft}</button>
                    <button className="publish" onClick={() => save(true)}>
                      {ad.publishChanges}
                    </button>
                  </div>
                </div>
                <p className="cmsHint">{ad.cmsHint}</p>
                {notice && <p className="formNotice">{notice}</p>}
                {page === "/" && (
                  <section className="imageControls">
                    <h3>{ad.heroControlsTitle}</h3>
                    <p>{ad.heroControlsCopy}</p>
                    <Range label={ad.desktopPos} name="desktopPosition" min={0} max={100} suffix="%" />
                    <Range label={ad.desktopZoom} name="desktopZoom" min={100} max={150} suffix="%" />
                    <Range label={ad.desktopBtnHeight} name="desktopButtonBottom" min={16} max={320} suffix="px" />
                    <Range label={ad.mobilePos} name="mobilePosition" min={0} max={100} suffix="%" />
                    <Range label={ad.mobileZoom} name="mobileZoom" min={100} max={150} suffix="%" />
                    <Range label={ad.mobileBtnHeight} name="mobileButtonBottom" min={12} max={240} suffix="px" />
                  </section>
                )}
                <div className="cmsFields">
                  {loading || Object.keys(defaults).length === 0 ? (
                    <p>{ad.loadingText}</p>
                  ) : (
                    Object.keys(defaults).map((key, index) => (
                      <label key={key}>
                        <span>
                          {ad.textPrefix} {index + 1}
                        </span>
                        <textarea value={values[key] ?? defaults[key]} onChange={(e) => change(key, e.target.value)} />
                      </label>
                    ))
                  )}
                </div>
                <button className="resetContent" onClick={resetDraft}>
                  {ad.restoreOriginal}
                </button>
              </aside>
              <div className="cmsPreview">
                <div className="previewBar">
                  <span>{ad.livePreview}</span>
                  <a href={page} target="_blank" rel="noreferrer">
                    {t.common.openPage}
                  </a>
                </div>
                <iframe
                  ref={frame}
                  key={page}
                  src={`${page}?cmsPreview=1`}
                  title={ad.previewTitle}
                  onLoad={inspectFrame}
                />
              </div>
            </div>
          ) : tab === "testers" ? (
            <TesterManager />
          ) : (
            <AdminBacklog />
          )}
        </section>
      </ProtectedPage>
    </main>
  );
}
