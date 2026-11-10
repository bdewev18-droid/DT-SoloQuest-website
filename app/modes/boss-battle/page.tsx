import Image from "next/image";
import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { GameScreen } from "../../components/GameScreen";
import { withBase } from "../../components/base-path";

export default function BossBattlePage() {
  return (
    <main>
      <SiteHeader />

      {/* Hero Section */}
      <section className="modeHero naxHero">
        <Image
          src={withBase("/naxarus.webp")}
          alt="Boss Battle — Naxarus the Devourer"
          fill
          priority
          sizes="100vw"
        />
        <div className="naxOverlay" />
        <div className="shell">
          <p className="kicker">Apex Solo Challenge</p>
          <h1>Boss Battle</h1>
          <p>
            One titan. Unforgiving rules. Massive health pools. Face legendary adversaries where every roll matters and the boss never hesitates.
          </p>
          <div className="heroNumbers">
            <div>
              <b>65+</b>
              <small>Boss HP</small>
            </div>
            <div>
              <b>0</b>
              <small>Boss rerolls</small>
            </div>
            <div>
              <b>1</b>
              <small>New boss / month</small>
            </div>
          </div>
        </div>
      </section>

      {/* Board Notice */}
      <section className="boardNotice">
        <div className="shell">
          <strong>Your physical board remains the center of gravity</strong>
          <p>
            You play your cards and roll your dice on your real game board. The app acts as the boss&apos;s board, executing turns automatically and narrating the duel in real time.
          </p>
        </div>
      </section>

      {/* Unique Boss Battle Rules */}
      <section className="shell naxRulesSection">
        <div className="sectionTitle centered">
          <p className="kicker">Different Mechanics</p>
          <h2>The Boss Battle Protocol</h2>
          <p className="lead" style={{ maxWidth: 740, margin: "12px auto 0" }}>
            Boss Battle is not Minion Rush. Bosses operate on distinct combat rules that fundamentally shift how you approach your dice decisions, card conservation, and defense.
          </p>
        </div>

        <div className="bossRulesGrid">
          <article className="bossRuleCard">
            <span className="ruleNumber">01</span>
            <h3>No Dice Rerolls for the Boss</h3>
            <p>
              Unlike heroes who can reroll their dice up to 2 times (3 roll attempts total), <strong>the boss never rerolls</strong>. The automation casts all 5 boss dice in a single, unalterable roll. It instantly evaluates its roll objective and executes the highest matching attack. Fast, brutal, and completely honest.
            </p>
          </article>

          <article className="bossRuleCard">
            <span className="ruleNumber">02</span>
            <h3>Massive HP &amp; Infinite CP (∞)</h3>
            <p>
              While standard minions fall in 2 to 3 rounds, bosses are titans built for long wars of attrition. With <strong>60 to 70+ HP</strong> and <strong>Infinite Combat Points (∞)</strong>, you must pace your own resources carefully to outlast them.
            </p>
          </article>

          <article className="bossRuleCard">
            <span className="ruleNumber">03</span>
            <h3>The Boss Always Goes First</h3>
            <p>
              The moment you enter the arena, you are under siege. Bosses seize the initiative on turn one. You begin the battle on the back foot, needing to survive their opening onslaught before you can assemble your offense.
            </p>
          </article>

          <article className="bossRuleCard">
            <span className="ruleNumber">04</span>
            <h3>Specialized Defense Reactions</h3>
            <p>
              Each boss possesses a bespoke defense roll (rolling 3 to 4 defensive dice). They do not just mitigate incoming damage: their defensive rolls can counter-attack, reflect damage, or poison you on contact.
            </p>
          </article>
        </div>
      </section>

      {/* Boss Roster Showcase */}
      <section className="shell bossShowcaseSection">
        <div className="sectionTitle centered">
          <p className="kicker">Apex Adversaries</p>
          <h2>Legendary Bosses &amp; Unique Styles</h2>
          <p className="lead" style={{ maxWidth: 720, margin: "12px auto 0" }}>
            Every boss is crafted with its own personality, AI attack priority, and combat style. Here are the titans currently stalking the solo arena.
          </p>
        </div>

        {/* Boss 1: Naxarus the Devourer */}
        <div className="bossProfileCard">
          <div className="bossProfileVisual">
            <div className="bossImageFrame">
              <Image
                src={withBase("/naxarus.webp")}
                alt="Naxarus the Devourer"
                width={700}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="bossStatBadges">
              <span><b>65</b> HP</span>
              <span><b>∞</b> CP</span>
              <span><b>3</b> Defense Dice</span>
            </div>
          </div>

          <div className="bossProfileDetails">
            <span className="bossArchetype">Dragon of Cinders · Raw Power</span>
            <h3>Naxarus the Devourer</h3>
            <p className="bossLore">
              A gargantuan dragon of ash and flame. Naxarus delivers overwhelming brute force, sweeping physical attacks, and undefendable infernal torrents that bypass conventional armor.
            </p>

            <div className="bossCombatBreakdown">
              <div className="combatAspect">
                <h4>⚔️ Attack Arsenal</h4>
                <ul>
                  <li>
                    <strong>Dragon Claws:</strong> 3 White symbols · 6 raw damage.
                  </li>
                  <li>
                    <strong>Tail Sweep:</strong> Small Straight (4 dice) · 8 damage + inflicts Knockdown.
                  </li>
                  <li>
                    <strong>Infernal Breath:</strong> Large Straight (5 dice) · 12 undefendable fire damage + Burn.
                  </li>
                  <li>
                    <strong>Cataclysm:</strong> 5 Dragon symbols · 16 undefendable catastrophic strike.
                  </li>
                </ul>
              </div>

              <div className="combatAspect">
                <h4>🛡️ Defense &amp; Combat Style</h4>
                <p>
                  <strong>Hardened Scale Defense (3 dice):</strong> Cancels 1 damage per Shield symbol rolled. On double Skull symbols, Naxarus retaliates with 1 pure damage straight through your armor.
                </p>
                <p>
                  <strong>Style:</strong> High direct damage, frequent undefendable bursts, and immediate punishment if you leave yourself open.
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
                alt="Ourokhor the Ancient Serpent"
                width={700}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="bossStatBadges">
              <span><b>70</b> HP</span>
              <span><b>∞</b> CP</span>
              <span><b>4</b> Defense Dice</span>
            </div>
          </div>

          <div className="bossProfileDetails">
            <span className="bossArchetype">Primordial Serpent · Attrition &amp; Venom</span>
            <h3>Ourokhor the Serpent</h3>
            <p className="bossLore">
              An ancient serpentine horror that has slumbered in the deep marshes for centuries. Ourokhor relies on creeping corruption, constriction that suffocates your CP economy, and stacking venom charges.
            </p>

            <div className="bossCombatBreakdown">
              <div className="combatAspect">
                <h4>⚔️ Attack Arsenal</h4>
                <ul>
                  <li>
                    <strong>Venomous Strike:</strong> 3 Fang symbols · 6 damage + inflicts Poison.
                  </li>
                  <li>
                    <strong>Constricting Coil:</strong> Small Straight (4 dice) · 9 undefendable damage + steals 1 CP.
                  </li>
                  <li>
                    <strong>Toxic Deluge:</strong> Large Straight (5 dice) · 14 damage + inflicts 2 Poison tokens.
                  </li>
                </ul>
              </div>

              <div className="combatAspect">
                <h4>🛡️ Defense &amp; Passive Venom Surge</h4>
                <p>
                  <strong>Toxic Scale Defense (4 dice):</strong> Cancels 1 damage per Orange symbol. On double Red symbols, Ourokhor poisons attackers on contact.
                </p>
                <p>
                  <strong>Venom Surge Gauge:</strong> Every time poison damages the hero, Ourokhor gains venom tokens, progressively unlocking Riposte, Evasive, and additional strike power.
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
            <p className="kicker">Community Rotation</p>
            <h2>1 New Boss Added Every Month</h2>
            <p className="floorText">
              The Solo Quest boss catalog is an evolving community battleground. Each month, an original boss designed by a community player joins the official roster.
            </p>
            <p className="floorSubtext">
              Proposals are reviewed and playtested by our team to guarantee balanced math, exciting counter-play, and seamless integration with the automated dice engine. Boss submissions and balancing tools are built directly inside the Solo Quest app.
            </p>
            <div className="floorActions">
              <Link className="button fire recruitmentZone" href="/inscription">
                Become a Beta Tester →
              </Link>
              <Link className="button wire" href="/modes/minion-rush">
                Explore Minion Rush Mode
              </Link>
            </div>
          </div>

          <div className="floorCadenceCard">
            <div className="cadenceHeader">
              <span className="cadencePill">Floor Guidelines</span>
              <strong>Monthly Curation</strong>
            </div>
            <ul className="cadenceList">
              <li>
                <span className="checkIcon">✓</span>
                <div>
                  <b>60 to 75 HP baseline</b>
                  <small>Built for a tense 8–15 round duel.</small>
                </div>
              </li>
              <li>
                <span className="checkIcon">✓</span>
                <div>
                  <b>1 to 6 distinct attacks</b>
                  <small>Clearly defined dice combinations &amp; symbols.</small>
                </div>
              </li>
              <li>
                <span className="checkIcon">✓</span>
                <div>
                  <b>No rerolls on monster dice</b>
                  <small>Fast, transparent execution every round.</small>
                </div>
              </li>
              <li>
                <span className="checkIcon">✓</span>
                <div>
                  <b>Balanced by the admin team</b>
                  <small>Email follow-up with creator before launch.</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Automation vs AI System Section */}
      <section className="bossCombat cutTop">
        <div className="shell bossGrid">
          <GameScreen src="/screens/naxarus-01.jpg" alt="Main battle screen against Naxarus" />
          <div>
            <p className="kicker">The heart of battle</p>
            <h2>A boss that truly plays</h2>
            <p>
              The automation controls the boss&apos;s attacks and defenses. It rolls the dice without help from the AI and follows its strategy without cheating.
            </p>
            <div className="combatFacts">
              <article>
                <b>01</b>
                <h3>The automation acts</h3>
                <p>Single dice roll, boss attacks, defenses, and token triggers.</p>
              </article>
              <article>
                <b>02</b>
                <h3>The AI interprets</h3>
                <p>Calculates damage, poison, burn, and status interactions.</p>
              </article>
              <article>
                <b>03</b>
                <h3>The chat explains</h3>
                <p>Every action becomes a clear, readable battle chronicle.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Mode History / Chronicles */}
      <section className="modeHistory">
        <div className="shell historyGrid">
          <div>
            <p className="kicker">Your Boss Chronicles</p>
            <h2>Compare every champion</h2>
            <p>
              The history records and ranks your heroes by score while keeping track of total battles, remaining health, and play time visible for every run.
            </p>
            <div className="scoreRules">
              <h3>Boss Battle scoring</h3>
              <ul>
                <li>
                  <b>100 points</b>
                  <span>Victory</span>
                </li>
                <li>
                  <b>50 points</b>
                  <span>Draw</span>
                </li>
              </ul>
            </div>
          </div>
          <figure className="historyVisual">
            <Image
              src={withBase("/screens/histo-naxarus.jpg")}
              alt="Boss Battle history ranking heroes by score, battles, remaining health and play time"
              width={921}
              height={2048}
              sizes="(max-width: 900px) 90vw, 42vw"
            />
            <figcaption>
              Rank heroes by best score, then compare their battles, remaining health, and play time.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Conclusion */}
      <section className="naxConclusion">
        <div className="shell">
          <p className="kicker">Into the arena</p>
          <h2>Every choice leaves a mark.</h2>
          <p>
            At the end of the duel, a full battle summary logs your triumphs and missteps. Whether the boss falls or claims your soul, you know exactly what shaped the fight.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginTop: 24 }}>
            <Link className="button light" href="/jouer">
              Face the Bosses
            </Link>
            <Link className="button wire recruitmentZone" href="/inscription">
              Become a Beta Tester
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
