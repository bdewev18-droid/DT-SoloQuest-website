"use client";

import Image from "next/image";
import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { GameScreen } from "../../components/GameScreen";
import { withBase } from "../../components/base-path";
import { useLanguage } from "../../components/LanguageProvider";

export default function BossBattlePage() {
  const { t } = useLanguage();
  const bb = t.bossBattle;

  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="modeHero naxHero">
        <Image src={withBase("/naxarus.webp")} alt={bb.heroImgAlt} fill priority sizes="100vw" />
        <div className="naxOverlay" />
        <div className="shell">
          <p className="kicker">{bb.heroKicker}</p>
          <h1>{bb.heroTitle}</h1>
          <p>{bb.heroCopy}</p>
          <div className="heroNumbers">
            {bb.heroStats.map((stat) => (
              <div key={stat.label}>
                <b>{stat.value}</b>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Notice */}
      <section className="boardNotice">
        <div className="shell">
          <strong>{bb.boardNoticeTitle}</strong>
          <p>{bb.boardNoticeCopy}</p>
        </div>
      </section>

      {/* Unique Boss Battle Rules */}
      <section className="shell naxRulesSection">
        <div className="sectionTitle centered">
          <p className="kicker">{bb.rulesKicker}</p>
          <h2>{bb.rulesTitle}</h2>
          <p className="lead" style={{ maxWidth: 740, margin: "12px auto 0" }}>
            {bb.rulesLead}
          </p>
        </div>

        <div className="bossRulesGrid">
          {bb.rules.map((rule) => (
            <article className="bossRuleCard" key={rule.num}>
              <span className="ruleNumber">{rule.num}</span>
              <h3>{rule.title}</h3>
              <p>{rule.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Boss Roster Showcase */}
      <section className="shell bossShowcaseSection">
        <div className="sectionTitle centered">
          <p className="kicker">{bb.rosterKicker}</p>
          <h2>{bb.rosterTitle}</h2>
          <p className="lead" style={{ maxWidth: 720, margin: "12px auto 0" }}>
            {bb.rosterLead}
          </p>
        </div>

        {/* Boss 1: Naxarus the Devourer */}
        <div className="bossProfileCard">
          <div className="bossProfileVisual">
            <div className="bossImageFrame">
              <Image
                src={withBase("/naxarus-portrait.webp")}
                alt={bb.naxarus.alt}
                width={720}
                height={1453}
                style={{ objectFit: "cover", objectPosition: "center top", width: "100%", height: "100%" }}
              />
            </div>
            <div className="bossStatBadges">
              <span>
                <b>65</b> {bb.naxarus.hpLabel}
              </span>
              <span>
                <b>0</b> {bb.naxarus.cpLabel}
              </span>
              <span>
                <b>1</b> {bb.naxarus.defLabel}
              </span>
            </div>
          </div>

          <div className="bossProfileDetails">
            <span className="bossArchetype">{bb.naxarus.archetype}</span>
            <h3>{bb.naxarus.name}</h3>
            <p className="bossLore">{bb.naxarus.lore}</p>

            <div className="bossCombatBreakdown">
              <div className="combatAspect">
                <h4>{bb.naxarus.attacksTitle}</h4>
                <ul>
                  {bb.naxarus.attacks.map((atk) => (
                    <li key={atk.name}>
                      <strong>{atk.name}</strong> {atk.desc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="combatAspect">
                <h4>{bb.naxarus.defenseTitle}</h4>
                <p>
                  <strong>{bb.naxarus.defenseP1Title}</strong> {bb.naxarus.defenseP1Desc}
                </p>
                <p>
                  <strong>{bb.naxarus.defenseP2Title}</strong> {bb.naxarus.defenseP2Desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boss 2: Ourokhor the Ancient Serpent */}
        <div className="bossProfileCard reverse">
          <div className="bossProfileVisual">
            <div className="bossImageFrame">
              <Image
                src={withBase("/ourokhor.jpg")}
                alt={bb.ourokhor.alt}
                width={768}
                height={1376}
                style={{ objectFit: "cover", objectPosition: "50% 6%", width: "100%", height: "100%" }}
              />
            </div>
            <div className="bossStatBadges">
              <span>
                <b>50</b> {bb.ourokhor.hpLabel}
              </span>
              <span>
                <b>0</b> {bb.ourokhor.cpLabel}
              </span>
              <span>
                <b>1</b> {bb.ourokhor.defLabel}
              </span>
            </div>
          </div>

          <div className="bossProfileDetails">
            <span className="bossArchetype">{bb.ourokhor.archetype}</span>
            <h3>{bb.ourokhor.name}</h3>
            <p className="bossLore">{bb.ourokhor.lore}</p>

            <div className="bossCombatBreakdown">
              <div className="combatAspect">
                <h4>{bb.ourokhor.attacksTitle}</h4>
                <ul>
                  {bb.ourokhor.attacks.map((atk) => (
                    <li key={atk.name}>
                      <strong>{atk.name}</strong> {atk.desc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="combatAspect">
                <h4>{bb.ourokhor.defenseTitle}</h4>
                <p>
                  <strong>{bb.ourokhor.defenseP1Title}</strong> {bb.ourokhor.defenseP1Desc}
                </p>
                <p>
                  <strong>{bb.ourokhor.defenseP2Title}</strong> {bb.ourokhor.defenseP2Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Boss Floor & Submission Callout */}
      <section className="shell communityBossFloorSection">
        <div className="floorBanner">
          <div className="floorContent">
            <p className="kicker">{bb.communityKicker}</p>
            <h2>{bb.communityTitle}</h2>
            <p className="floorText">{bb.communityText}</p>
            <p className="floorSubtext">{bb.communitySubtext}</p>
            <div className="floorActions">
              <Link className="button fire recruitmentZone" href="/inscription">
                {bb.communityBetaCta}
              </Link>
              <Link className="button wire" href="/modes/minion-rush">
                {bb.communityRushCta}
              </Link>
            </div>
          </div>

          <div className="floorCadenceCard">
            <div className="cadenceHeader">
              <span className="cadencePill">{bb.cadencePill}</span>
              <strong>{bb.cadenceTitle}</strong>
            </div>
            <ul className="cadenceList">
              {bb.cadenceItems.map((item) => (
                <li key={item.title}>
                  <span className="checkIcon">✓</span>
                  <div>
                    <b>{item.title}</b>
                    <small>{item.desc}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Automation vs AI System Section */}
      <section className="bossCombat cutTop">
        <div className="shell bossGrid">
          <GameScreen src="/screens/naxarus-01.jpg" alt={bb.combatImgAlt} />
          <div>
            <p className="kicker">{bb.combatKicker}</p>
            <h2>{bb.combatTitle}</h2>
            <p>{bb.combatCopy}</p>
            <div className="combatFacts">
              {bb.combatFacts.map((fact) => (
                <article key={fact.num}>
                  <b>{fact.num}</b>
                  <h3>{fact.title}</h3>
                  <p>{fact.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mode History / Chronicles */}
      <section className="modeHistory">
        <div className="shell historyGrid">
          <div>
            <p className="kicker">{bb.historyKicker}</p>
            <h2>{bb.historyTitle}</h2>
            <p>{bb.historyCopy}</p>
            <div className="scoreRules">
              <h3>{bb.historyScoreTitle}</h3>
              <ul>
                {bb.historyScores.map((row) => (
                  <li key={row.label}>
                    <b>{row.pts}</b>
                    <span>{row.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bossHistoryPair">
            <figure className="historyVisualFramed">
              <GameScreen src="/screens/histo-boss-list.webp" alt={bb.historyListAlt} framed />
              <figcaption>{bb.historyListCaption}</figcaption>
            </figure>
            <figure className="historyVisualFramed">
              <GameScreen src="/screens/histo-boss-grid.webp" alt={bb.historyGridAlt} framed />
              <figcaption>{bb.historyGridCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="naxConclusion">
        <div className="shell">
          <p className="kicker">{bb.endKicker}</p>
          <h2>{bb.endTitle}</h2>
          <p>{bb.endCopy}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <Link className="button light" href="/jouer">
              {bb.endPlayCta}
            </Link>
            <Link className="button wire recruitmentZone" href="/inscription">
              {bb.endBetaCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
