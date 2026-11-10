import { HardLink as Link } from "../components/HardLink";
import { SiteHeader } from "../components/SiteHeader";

const WEB_GAME_URL = "https://bdewev18-droid.github.io/Dice-throne-Solo/";
const APK_DOWNLOAD_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest/download/app-release.apk";
const GITHUB_RELEASE_URL =
  "https://github.com/bdewev18-droid/Dice-throne-Solo/releases/latest";

export default function PlayPage() {
  return (
    <main className="subPage">
      <SiteHeader />

      <section className="subHero shell">
        <p className="eyebrow">
          <span />
          Companion App · Web &amp; Android
        </p>
        <h1>Play Solo Quest</h1>
        <p className="lead">
          Launch the mobile-friendly online edition in your browser (compatible with Apple iOS, Android, and desktop) or download the native Android APK release directly from GitHub.
        </p>
      </section>

      <section className="shell playSplitContainer">
        <div className="playSplitGrid">
          {/* Option 1: Play Online */}
          <article className="panel playOptionCard playOptionOnline">
            <div className="playCardHead">
              <span className="playCardBadge apple">Web &amp; Apple iOS Ready</span>
              <h2>1. Play Online</h2>
              <p className="playCardDesc">
                Run Solo Quest instantly inside your browser—no downloads needed. Designed with a mobile-first layout, it works smoothly on <strong>Apple iPhone &amp; iPad (Safari)</strong>, Android phones, and desktop screens.
              </p>
            </div>

            <div className="playCardActions">
              <a
                className="button fire"
                href={WEB_GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Launch Online Version ↗
              </a>
              <small className="playCardNote">
                Opens in a new tab ({WEB_GAME_URL.replace("https://", "")})
              </small>
            </div>

            <ul className="playFeatureList">
              <li>
                <strong>Apple / iOS Compatible:</strong> Recommended option for iPhone and iPad users.
              </li>
              <li>
                <strong>Zero Setup:</strong> Opens directly in a dedicated browser tab with your saved progress.
              </li>
              <li>
                <strong>iOS Home Screen Tip:</strong> In Safari, tap <em>Share → &ldquo;Add to Home Screen&rdquo;</em> to launch Solo Quest like a native full-screen app.
              </li>
            </ul>
          </article>

          {/* Option 2: Download Android APK */}
          <article className="panel playOptionCard playOptionAndroid">
            <div className="playCardHead">
              <span className="playCardBadge android">Android Native · Auto-Updating</span>
              <h2>2. Download Android APK</h2>
              <p className="playCardDesc">
                Install the standalone Android application directly from our official GitHub Release. Enjoy native performance and seamless full-screen play beside your physical board.
              </p>
            </div>

            <div className="playCardActions">
              <a
                className="button fire"
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Latest APK ↓
              </a>
              <a
                className="button wire"
                href={GITHUB_RELEASE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub Release ↗
              </a>
            </div>

            {/* Auto-update highlight */}
            <div className="autoUpdateBox">
              <strong className="autoUpdateTitle">🔄 Self-Updating on Startup</strong>
              <p>
                You only need to install the APK <strong>once</strong>. Whenever a new version is released, the app automatically checks and updates itself directly on startup—no need to repeat these steps again.
              </p>
            </div>

            {/* Collapsible Android Unknown Sources Guide */}
            <details className="apkGuideDetails">
              <summary className="apkGuideSummary">
                <span>How to enable APK installation (Unknown Sources) on Android</span>
                <span className="apkGuideChevron" aria-hidden="true">▾</span>
              </summary>
              <div className="apkGuideBody">
                <ol className="steps">
                  <li>
                    Tap <strong>Download Latest APK</strong> above to save <code>app-release.apk</code> from GitHub Releases.
                  </li>
                  <li>
                    Open the downloaded file from your notification bar or your device&apos;s <strong>Files / Downloads</strong> app.
                  </li>
                  <li>
                    If prompted for permission, tap <strong>Settings</strong> and toggle <strong>&ldquo;Allow from this source&rdquo;</strong> ON (or open <em>Settings → Apps → Special app access → Install unknown apps</em> and authorize your browser).
                  </li>
                  <li>
                    Confirm <strong>Install</strong> and launch <strong>Solo Quest</strong>!
                  </li>
                </ol>
              </div>
            </details>
          </article>
        </div>

        {/* Bottom Beta Tester Callout */}
        <section className="panel playTesterCallout recruitmentZone">
          <div>
            <p className="eyebrow">
              <span />
              Join the Community
            </p>
            <h3>Want to join the official beta tester group?</h3>
            <p>
              Unlock access to the Tester Space, submit balance feedback, vote on reported issues, and help shape upcoming Solo Quest bosses and heroes.
            </p>
          </div>
          <Link className="button light" href="/inscription">
            Become a Beta Tester →
          </Link>
        </section>
      </section>
    </main>
  );
}
