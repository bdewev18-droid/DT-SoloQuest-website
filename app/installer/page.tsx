import { SiteHeader } from "../components/SiteHeader";

const APK_DOWNLOAD_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest/download/app-release.apk";

export default function Page() {
  return (
    <main className="subPage">
      <SiteHeader />
      <section className="subHero shell">
        <p className="eyebrow">
          <span />
          Android app
        </p>
        <h1>Install Solo Quest</h1>
        <p className="lead">
          The app is distributed directly via our official GitHub Release outside the Play Store. Follow these steps once—updates happen automatically inside the app.
        </p>
      </section>
      <section className="contentGrid shell">
        <article className="panel">
          <h2>Install the APK</h2>
          <ol className="steps">
            <li>Download the latest APK using the button below.</li>
            <li>When prompted, allow installation from this source in Android settings.</li>
            <li>Open the downloaded file and confirm installation.</li>
            <li>Launch Solo Quest and log in with your account.</li>
          </ol>
          <div style={{ marginTop: 22 }}>
            <a
              className="button fire"
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Latest APK ↓
            </a>
          </div>
        </article>
        <article className="panel">
          <h2>Security &amp; Auto-Updates</h2>
          <p>
            Android displays a standard warning for apps installed outside the Play Store. This is expected for an APK release.
          </p>
          <div className="autoUpdateBox" style={{ marginTop: 18 }}>
            <strong>🔄 Automatic Updates on Startup</strong>
            <p>
              You only need to install the APK once. The app checks for updates automatically every time it launches—no need to repeat this process for future updates.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
