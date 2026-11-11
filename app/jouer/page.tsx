"use client";

import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";
import { useLanguage } from "../components/LanguageProvider";

const WEB_GAME_URL = "https://bdewev18-droid.github.io/Dice-throne-Solo/";
const APK_DOWNLOAD_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest/download/app-release.apk";
const GITHUB_RELEASE_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest";

export default function PlayPage() {
  const { t } = useLanguage();
  const pl = t.play;

  return (
    <main className="subPage">
      <SiteHeader />

      <section className="subHero shell">
        <p className="eyebrow">
          <span />
          {pl.eyebrow}
        </p>
        <h1>{pl.title}</h1>
        <p className="lead">{pl.lead}</p>
      </section>

      <section className="shell playSplitContainer">
        <div className="playSplitGrid">
          {/* Option 1: Play Online */}
          <article className="panel playOptionCard playOptionOnline">
            <div className="playCardHead">
              <span className="playCardBadge apple">{pl.onlineBadge}</span>
              <h2>{pl.onlineTitle}</h2>
              <p className="playCardDesc">{pl.onlineDesc}</p>
            </div>

            <div className="playCardActions">
              <a
                className="button fire"
                href={WEB_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pl.onlineCta}
              </a>
              <small className="playCardNote">
                {pl.onlineNotePrefix} ({WEB_GAME_URL.replace("https://", "")})
              </small>
            </div>

            <ul className="playFeatureList">
              {pl.onlineFeatures.map((feat) => (
                <li key={feat.title}>
                  <strong>{feat.title}</strong> {feat.desc}
                </li>
              ))}
            </ul>
          </article>

          {/* Option 2: Download Android APK */}
          <article className="panel playOptionCard playOptionAndroid">
            <div className="playCardHead">
              <span className="playCardBadge android">{pl.androidBadge}</span>
              <h2>{pl.androidTitle}</h2>
              <p className="playCardDesc">{pl.androidDesc}</p>
            </div>

            <div className="playCardActions">
              <a
                className="button fire"
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pl.androidDownloadCta}
              </a>
              <a
                className="button wire"
                href={GITHUB_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pl.androidReleaseCta}
              </a>
            </div>

            <div className="autoUpdateBox">
              <strong className="autoUpdateTitle">{pl.autoUpdateTitle}</strong>
              <p>{pl.autoUpdateCopy}</p>
            </div>

            <details className="apkGuideDetails">
              <summary className="apkGuideSummary">
                <span>{pl.apkGuideSummary}</span>
                <span className="apkGuideChevron" aria-hidden="true">▾</span>
              </summary>
              <div className="apkGuideBody">
                <ol className="steps">
                  {pl.apkGuideSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </details>
          </article>
        </div>

        <section className="panel playTesterCallout recruitmentZone">
          <div>
            <p className="eyebrow">
              <span />
              {pl.communityEyebrow}
            </p>
            <h3>{pl.communityTitle}</h3>
            <p>{pl.communityCopy}</p>
          </div>
          <Link className="button light" href="/inscription">
            {pl.communityCta}
          </Link>
        </section>
      </section>
    </main>
  );
}
