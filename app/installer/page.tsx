"use client";

import { SiteHeader } from "../components/SiteHeader";
import { useLanguage } from "../components/LanguageProvider";

const APK_DOWNLOAD_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest/download/app-release.apk";

export default function Page() {
  const { t } = useLanguage();
  const ins = t.install;

  return (
    <main className="subPage">
      <SiteHeader />
      <section className="subHero shell">
        <p className="eyebrow">
          <span />
          {ins.eyebrow}
        </p>
        <h1>{ins.title}</h1>
        <p className="lead">{ins.lead}</p>
      </section>
      <section className="contentGrid shell">
        <article className="panel">
          <h2>{ins.panel1Title}</h2>
          <ol className="steps">
            {ins.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div style={{ marginTop: 22 }}>
            <a
              className="button fire"
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ins.downloadCta}
            </a>
          </div>
        </article>
        <article className="panel">
          <h2>{ins.panel2Title}</h2>
          <p>{ins.panel2Copy}</p>
          <div className="autoUpdateBox" style={{ marginTop: 18 }}>
            <strong className="autoUpdateTitle">{ins.autoUpdateTitle}</strong>
            <p>{ins.autoUpdateCopy}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
