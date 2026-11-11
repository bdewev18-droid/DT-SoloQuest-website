"use client";

import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { GameScreen } from "../../components/GameScreen";
import { useLanguage } from "../../components/LanguageProvider";

function Step({
  n,
  title,
  text: copy,
  screen,
  extra,
  screenTwo,
  screenTwoAlt,
}: {
  n: string;
  title: string;
  text: string;
  screen: string;
  extra?: React.ReactNode;
  screenTwo?: string;
  screenTwoAlt?: string;
}) {
  return (
    <article className="journeyStep">
      <div className="stepCopy">
        <span>{n}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
        {extra}
      </div>
      {screenTwo ? (
        <div className="dualScreenStage">
          <GameScreen src={screen} alt={title} />
          <GameScreen src={screenTwo} alt={screenTwoAlt || title} />
        </div>
      ) : (
        <GameScreen src={screen} alt={title} />
      )}
    </article>
  );
}

export default function Page() {
  const { t } = useLanguage();
  const mr = t.minionRush;
  const [c0, c1, c2, c3] = mr.diffCards;

  return (
    <main>
      <SiteHeader />
      <section className="modeHero rushHero">
        <div className="shell">
          <p className="kicker">{mr.heroKicker}</p>
          <h1>
            {mr.heroTitleLine1}
            <br />
            <span>{mr.heroTitleLine2}</span>
          </h1>
          <p>{mr.heroCopy}</p>
          <div className="heroNumbers">
            {mr.heroStats.map((stat) => (
              <div key={stat.label}>
                <b>{stat.value}</b>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="boardNotice">
        <div className="shell">
          <strong>{mr.boardNoticeTitle}</strong>
          <p>{mr.boardNoticeCopy}</p>
        </div>
      </section>

      {/* Section 2: MAP Overview */}
      <section className="overview shell">
        <GameScreen src="/screens/minion-04.webp" alt={mr.overviewImgAlt} framed />
        <div>
          <p className="kicker">{mr.overviewKicker}</p>
          <h2>{mr.overviewTitle}</h2>
          <p>{mr.overviewCopy}</p>
          <Link className="button fire" href="/jouer">
            {mr.overviewCta}
          </Link>
        </div>
      </section>

      {/* Step 01: 4 Difficulty & Expansions Cards */}
      <section className="difficulty">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">{mr.step1Kicker}</p>
            <h2>{mr.step1Title}</h2>
            <p style={{ maxWidth: 740, marginTop: 14 }}>{mr.step1Copy}</p>
          </div>

          <div className="difficultyFourGrid">
            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-1.webp" alt={c0.alt} framed />
              <div className="diffModeCopy">
                <span className="diffTag normal">{c0.tag}</span>
                <h3>{c0.title}</h3>
                <p>
                  {c0.prefix}
                  <strong>{c0.strong}</strong>
                  {c0.suffix}
                </p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-2.webp" alt={c1.alt} framed />
              <div className="diffModeCopy">
                <span className="diffTag packs">{c1.tag}</span>
                <h3>{c1.title}</h3>
                <p>
                  {c1.parts?.[0]}
                  <strong>{c1.parts?.[1]}</strong>
                  {c1.parts?.[2]}
                  <strong>{c1.parts?.[3]}</strong>
                  {c1.parts?.[4]}
                  <strong>{c1.parts?.[5]}</strong>
                  {c1.parts?.[6]}
                  <strong>{c1.parts?.[7]}</strong>
                  {c1.parts?.[8]}
                  <strong>{c1.parts?.[9]}</strong>
                  {c1.parts?.[10]}
                </p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-3.webp" alt={c2.alt} framed />
              <div className="diffModeCopy">
                <span className="diffTag free">{c2.tag}</span>
                <h3>{c2.title}</h3>
                <p>{c2.copy}</p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-4.webp" alt={c3.alt} framed />
              <div className="diffModeCopy">
                <span className="diffTag hard">{c3.tag}</span>
                <h3>{c3.title}</h3>
                <p>
                  {c3.parts?.[0]}
                  <strong>{c3.parts?.[1]}</strong>
                  {c3.parts?.[2]}
                  <strong>{c3.parts?.[3]}</strong>
                  {c3.parts?.[4]}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Journey Steps 02 -> 07 */}
      <section className="journey shell">
        <Step
          n={mr.steps.s02.n}
          title={mr.steps.s02.title}
          text={mr.steps.s02.text}
          screen="/screens/perso-02.webp"
        />
        <Step
          n={mr.steps.s03.n}
          title={mr.steps.s03.title}
          text={mr.steps.s03.text}
          screen="/screens/minion-05.webp"
        />
        <Step
          n={mr.steps.s04.n}
          title={mr.steps.s04.title}
          text={mr.steps.s04.text}
          screen="/screens/minion-attack-board.webp"
        />
        <Step
          n={mr.steps.s05.n}
          title={mr.steps.s05.title}
          text={mr.steps.s05.text}
          screen="/screens/minion-07.webp"
        />
        <Step
          n={mr.steps.s06.n}
          title={mr.steps.s06.title}
          text={mr.steps.s06.text}
          screen="/screens/minion-08.webp"
          extra={
            <ol className="phaseBreakdownList">
              {mr.steps.s06.phases.map((phase) => (
                <li key={phase.title}>
                  <b>{phase.title}</b> {phase.text}
                </li>
              ))}
            </ol>
          }
        />
        <Step
          n={mr.steps.s07.n}
          title={mr.steps.s07.title}
          text={mr.steps.s07.text}
          screen="/screens/minion-08.webp"
          screenTwo="/screens/erreur.webp"
          screenTwoAlt={mr.steps.s07.alt2}
        />
      </section>

      {/* Step 08: Victory & Loot */}
      <section className="lootSection">
        <div className="shell lootGrid">
          <div>
            <p className="kicker">{mr.step8Kicker}</p>
            <h2>{mr.step8Title}</h2>
            <p>{mr.step8Copy}</p>
          </div>
          <GameScreen src="/screens/minion-09.webp" alt={mr.step8Alt} framed />
        </div>
      </section>

      {/* Step 09: Two Paths */}
      <section className="pathSection shell">
        <div className="sectionTitle centered">
          <p className="kicker">{mr.step9Kicker}</p>
          <h2>{mr.step9Title}</h2>
          <p>{mr.step9Copy}</p>
        </div>
        <div className="pathPair">
          <GameScreen src="/screens/minion-10.webp" alt={mr.step9AltLeft} framed />
          <GameScreen src="/screens/minion-11.webp" alt={mr.step9AltRight} framed />
        </div>
      </section>

      {/* Step 10: Bestiary */}
      <section className="enemyGallery">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">{mr.step10Kicker}</p>
            <h2>{mr.step10Title}</h2>
            <p style={{ maxWidth: 720, marginTop: 14 }}>{mr.step10Copy}</p>
          </div>
          <div className="galleryRow">
            <GameScreen src="/screens/minion-enemy-card.webp" alt={mr.step10Alt1} framed />
            <GameScreen src="/screens/minion-bestiary.webp" alt={mr.step10Alt2} framed />
            <GameScreen src="/screens/minion-bestiary-detail.webp" alt={mr.step10Alt3} framed />
          </div>
        </div>
      </section>

      {/* Step 11: Status Tokens */}
      <section className="tokenSection">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">{mr.step11Kicker}</p>
            <h2>{mr.step11Title}</h2>
            <p style={{ maxWidth: 760, marginTop: 14 }}>{mr.step11Copy}</p>
          </div>

          <div className="tokenOverviewGrid">
            <article className="tokenInfoBox">
              <span className="tokenInfoTag">{mr.step11Boxes.duelTag}</span>
              <h3>{mr.step11Boxes.duelTitle}</h3>
              <p>{mr.step11Boxes.duelCopy}</p>
            </article>

            <article className="tokenInfoBox">
              <span className="tokenInfoTag">{mr.step11Boxes.glossaryTag}</span>
              <h3>{mr.step11Boxes.glossaryTitle}</h3>
              <p>{mr.step11Boxes.glossaryCopy}</p>
            </article>

            <article className="tokenInfoBox">
              <span className="tokenInfoTag">{mr.step11Boxes.autoTag}</span>
              <h3>{mr.step11Boxes.autoTitle}</h3>
              <p>{mr.step11Boxes.autoCopy}</p>
              <div className="tokenDotLegend">
                <span className="tokenDotBadge auto">
                  <i />
                  {mr.step11Boxes.legendGreen}
                </span>
                <span className="tokenDotBadge manual">
                  <i />
                  {mr.step11Boxes.legendOrange}
                </span>
              </div>
            </article>
          </div>

          <div className="galleryRow">
            {[
              "/screens/minion-tokens-duel.webp",
              "/screens/minion-tokens-positive.webp",
              "/screens/minion-tokens-negative.webp",
            ].map((src, idx) => (
              <div className="tokenScreenCard" key={src}>
                <GameScreen src={src} alt={mr.step11Screens[idx].alt} framed />
                <h3>{mr.step11Screens[idx].title}</h3>
                <p>{mr.step11Screens[idx].copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="modeHistory">
        <div className="shell">
          <div className="historyGrid">
            <div>
              <p className="kicker">{mr.historyKicker}</p>
              <h2>{mr.historyTitle}</h2>
              <p>{mr.historyCopy}</p>
              <div className="scoreRules minionScoreRules">
                <h3>{mr.historyScoreTitle}</h3>
                <ul>
                  {mr.historyScores.map((row) => (
                    <li className={row.cls} key={row.label}>
                      <b>{row.pts}</b>
                      <span>{row.label}</span>
                    </li>
                  ))}
                </ul>
                <p>{mr.historyScoreFootnote}</p>
              </div>
            </div>
            <figure className="historyVisualFramed">
              <GameScreen src="/screens/histo-minion-grouped.webp" alt={mr.historyMainAlt} framed />
              <figcaption>{mr.historyMainCaption}</figcaption>
            </figure>
          </div>

          <div className="historyDisplaysBlock">
            <div className="historyDisplaysHead">
              <p className="kicker">{mr.historyDisplayKicker}</p>
              <h3>{mr.historyDisplayTitle}</h3>
              <p>{mr.historyDisplayCopy}</p>
            </div>
            <div className="historyDisplaysPair">
              <figure className="historyVisualFramed">
                <GameScreen src="/screens/histo-boss-list.webp" alt={mr.historyListAlt} framed />
                <figcaption>{mr.historyListCaption}</figcaption>
              </figure>
              <figure className="historyVisualFramed">
                <GameScreen src="/screens/histo-boss-grid.webp" alt={mr.historyGridAlt} framed />
                <figcaption>{mr.historyGridCaption}</figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="modeEnd">
        <div className="shell">
          <h2>{mr.endTitle}</h2>
          <Link className="button light" href="/jouer">
            {mr.endCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
