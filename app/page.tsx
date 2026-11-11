"use client";

import Image from "next/image";
import { HardLink as Link } from "./components/HardLink";
import { SiteHeader } from "./components/SiteHeader";
import { GameScreen } from "./components/GameScreen";
import { withBase } from "./components/base-path";
import { useLanguage } from "./components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main>
      <SiteHeader />
      <section className="artHero" aria-label={t.home.heroAria}>
        <Image
          src={withBase("/home_background_v4.png")}
          alt={t.home.heroImgAlt}
          fill
          priority
          sizes="100vw"
        />
        <div className="heroFade" />
      </section>
      <section className="introBand cutBottom">
        <div className="shell introGrid">
          <div>
            <p className="kicker">{t.home.introKicker}</p>
            <h1>
              {t.home.introTitleLine1}
              <br />
              <span>{t.home.introTitleLine2}</span>
            </h1>
          </div>
          <div className="introCopy">
            <div className="introBoardVisual">
              <Image
                src={withBase("/physical_board.webp")}
                alt={t.home.boardImgAlt}
                width={1000}
                height={729}
                sizes="(max-width: 900px) 92vw, 520px"
                priority
              />
            </div>
            <p>{t.home.introCopy}</p>
            <div className="actionRow">
              <Link className="button fire" href="/jouer">
                {t.home.playNow}
              </Link>
              <Link className="ghostLink" href="#modes">
                {t.home.discoverModes}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="showcase shell">
        <div className="showcaseCopy">
          <p className="kicker">{t.home.showcaseKicker}</p>
          <h2>
            {t.home.showcaseTitleLine1}
            <br />
            {t.home.showcaseTitleLine2}
          </h2>
          <p>{t.home.showcaseCopy}</p>
          <ul className="checkList">
            {t.home.showcaseList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="phoneStage">
          <GameScreen src="/screens/hp-02.webp" alt={t.home.homeScreenAlt} framed />
          <div className="stageLabel">
            <b>{t.home.stageBadgeNum}</b>
            <span>
              {t.home.stageBadgeLine1}
              <br />
              {t.home.stageBadgeLine2}
            </span>
          </div>
        </div>
      </section>
      <section className="modeSelect" id="modes">
        <div className="shell sectionTitle">
          <p className="kicker">{t.home.modesKicker}</p>
          <h2>
            {t.home.modesTitleLine1}
            <br />
            {t.home.modesTitleLine2}
          </h2>
        </div>
        <div className="modeTiles shell">
          <Link className="modeTile rushTile" href="/modes/minion-rush">
            <div className="tileShade" />
            <div className="tileContent">
              <span className="tileNo">{t.home.rushTileNo}</span>
              <p>{t.home.rushTileTag}</p>
              <h3>{t.home.rushTileTitle}</h3>
              <small>{t.home.rushTileDesc}</small>
              <b>{t.home.rushTileCta}</b>
            </div>
          </Link>
          <Link className="modeTile naxTile" href="/modes/boss-battle">
            <Image src={withBase("/naxarus.webp")} alt={t.home.bossTileAlt} fill sizes="50vw" />
            <div className="tileShade" />
            <div className="tileContent">
              <span className="tileNo">{t.home.bossTileNo}</span>
              <p>{t.home.bossTileTag}</p>
              <h3>{t.home.bossTileTitle}</h3>
              <small>{t.home.bossTileDesc}</small>
              <b>{t.home.bossTileCta}</b>
            </div>
          </Link>
        </div>
      </section>
      <section className="systemSection cutTop">
        <div className="shell">
          <div className="sectionTitle centered">
            <p className="kicker">{t.home.systemKicker}</p>
            <h2>
              {t.home.systemTitleLine1}
              <br />
              <span>{t.home.systemTitleLine2}</span>
            </h2>
          </div>
          <div className="systemStory">
            <GameScreen src="/screens/minion-06.webp" alt={t.home.systemScreenAlt} framed />
            <div className="systemStoryCopy">
              <h3>{t.home.systemStoryTitle}</h3>
              <p>{t.home.systemStoryCopy}</p>
            </div>
          </div>
          <div className="systemGrid">
            {t.home.systemPillars.map((pillar) => (
              <article key={pillar.num}>
                <i>{pillar.num}</i>
                <h3>{pillar.title}</h3>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="heroChoice shell">
        <GameScreen src="/screens/perso-02.webp" alt={t.home.heroChoiceAlt} framed />
        <div>
          <p className="kicker">{t.home.heroChoiceKicker}</p>
          <h2>
            {t.home.heroChoiceTitleLine1}
            <br />
            {t.home.heroChoiceTitleLine2}
          </h2>
          <p>{t.home.heroChoiceCopy}</p>
          <Link className="button fire" href="/modes/minion-rush">
            {t.home.heroChoiceCta}
          </Link>
        </div>
      </section>
      <section className="betaCta recruitmentZone">
        <div className="shell">
          <p className="kicker">{t.home.betaKicker}</p>
          <h2>
            {t.home.betaTitleLine1}
            <br />
            {t.home.betaTitleLine2}
          </h2>
          <p>{t.home.betaCopy}</p>
          <Link className="button light" href="/inscription">
            {t.home.betaCta}
          </Link>
        </div>
      </section>
      <footer className="darkFooter">
        <div className="shell">
          <Image src={withBase("/app_icon.png")} alt={t.common.brand} width={72} height={72} />
          <p>
            {t.footer.unofficial}
            <br />
            {t.footer.boardRequired}
          </p>
          <div>
            <Link href="/installer">{t.footer.android}</Link>
            <Link href="/jouer">{t.footer.webVersion}</Link>
            <Link href="/admin">{t.footer.administration}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
