import Image from "next/image";
import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { GameScreen } from "../../components/GameScreen";
import { withBase } from "../../components/base-path";

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
  return (
    <main>
      <SiteHeader />
      <section className="modeHero rushHero">
        <div className="shell">
          <p className="kicker">Campaign mode</p>
          <h1>
            Minion<br />
            <span>Rush</span>
          </h1>
          <p>Choose your path, defeat 13 enemies drawn from validated monsters, and survive the twin summit bosses.</p>
          <div className="heroNumbers">
            <div><b>77</b><small>validated enemies</small></div>
            <div><b>13</b><small>enemies per run</small></div>
            <div><b>3</b><small>game modes (Free · Normal · Hard)</small></div>
          </div>
        </div>
      </section>

      <section className="boardNotice">
        <div className="shell">
          <strong>Physical board required</strong>
          <p>Keep your board, cards and dice in front of you. The app controls the enemies; it does not replace your Dice Throne game.</p>
        </div>
      </section>

      {/* Section 2: MAP Overview */}
      <section className="overview shell">
        <GameScreen src="/screens/minion-04.webp" alt="Full Minion Rush map" framed />
        <div>
          <p className="kicker">A branching campaign</p>
          <h2>Your road to the summit</h2>
          <p>
            Progress across a complete branching map, choose your battles, and collect the points you need. Each 13-enemy run draws opponents from a roster of 77 validated minions across 4 difficulty tiers.
          </p>
          <Link className="button fire" href="/jouer">Start a game</Link>
        </div>
      </section>

      {/* Step 01: 4 Difficulty & Expansions Cards */}
      <section className="difficulty">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">Step 01</p>
            <h2>3 Modes &amp; Custom Expansions</h2>
            <p style={{ maxWidth: 740, marginTop: 14 }}>
              Tailor your Minion Rush gauntlet before you draw your first foe. Choose from three distinct game modes and toggle optional minion card packs.
            </p>
          </div>

          <div className="difficultyFourGrid">
            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-1.webp" alt="Normal Minion Rush mode setup" framed />
              <div className="diffModeCopy">
                <span className="diffTag normal">01 · Normal Mode</span>
                <h3>Medium · 33 Points</h3>
                <p>
                  The standard balanced campaign targeting <strong>33 points</strong> across 13 encounters (Levels 1 to 4), playable on either a fixed route or randomized paths.
                </p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-2.webp" alt="Minion Rush card expansions selector" framed />
              <div className="diffModeCopy">
                <span className="diffTag packs">02 · Card Expansions</span>
                <h3>Additional Packs &amp; Community</h3>
                <p>
                  Mix and match your roster with <strong>DTA Minions</strong>, <strong>DTA Legacy Deck</strong>, <strong>Promo Pack DTA</strong>, <strong>Santa&apos;s Workshop Promo Pack</strong>, and the <strong>Community Minions</strong> pack—where players can propose new minions directly from the Bestiary.
                </p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-3.webp" alt="Free Minion Rush mode customization" framed />
              <div className="diffModeCopy">
                <span className="diffTag free">03 · Free Mode</span>
                <h3>Build Your Own Path</h3>
                <p>
                  Take total control: configure your target score, choose exactly how many Level 1–4 enemies fill your 13-battle route, and toggle Expert mode rules.
                </p>
              </div>
            </article>

            <article className="diffModeCard">
              <GameScreen src="/screens/minion-diff-4.webp" alt="Hard Minion Rush 52 points with Viseer" framed />
              <div className="diffModeCopy">
                <span className="diffTag hard">04 · Hard Mode</span>
                <h3>Difficult · 52 Points + Viseer</h3>
                <p>
                  Built for veterans aiming for <strong>52 points</strong>: <strong>Viseer</strong> joins every Level 4 end-of-route boss encounter as a lethal companion alongside stricter Hand of the King odds.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Journey Steps 02 -> 07 */}
      <section className="journey shell">
        <Step
          n="02"
          title="Prepare your hero"
          text="Choose any integrated character. Your physical board remains your command center."
          screen="/screens/perso-02.webp"
        />
        <Step
          n="03"
          title="Discover your target"
          text="Before each battle, inspect the enemy preview—HP pool, special abilities, and roll target."
          screen="/screens/minion-05.webp"
        />
        <Step
          n="04"
          title="Attack from your board"
          text="Roll your dice and play your cards on your physical board. The app tracks HP, CP, tokens, and live combat narration."
          screen="/screens/minion-06.webp"
        />
        <Step
          n="05"
          title="Resolve attack & defense"
          text="When combat dice hit the table, the defender executes their defensive roll, resolves mitigation, and triggers defensive effects."
          screen="/screens/minion-07.webp"
        />
        <Step
          n="06"
          title="Four structured combat phases"
          text="Every round follows a clear 4-phase flow built seamlessly into the battle bar at the top of the screen:"
          screen="/screens/minion-08.webp"
          extra={
            <ol className="phaseBreakdownList">
              <li>
                <b>Phase 1 — First Player Upkeep:</b> Merges Upkeep, Income/Draw, and Main Phase into a single streamlined step. The app handles token triggers automatically.
              </li>
              <li>
                <b>Phase 2 — First Player Roll Phase:</b> The active player executes their attack while the opponent resolves defense.
              </li>
              <li>
                <b>Phase 3 — Second Player Upkeep:</b> Transitions cleanly to the second player&apos;s Upkeep, Draw, and Main actions.
              </li>
              <li>
                <b>Phase 4 — Second Player Roll Phase:</b> Executed by either the Hero or the Enemy Automation depending on initiative.
              </li>
            </ol>
          }
        />
        <Step
          n="07"
          title="Smart AI dice & full player override"
          text="The automation chooses dice to reserve and reroll automatically based on each enemy's strategy. However, you always keep control: if the AI ever selects the wrong die to keep, tap Deselect to override the selection and keep the duel 100% fair."
          screen="/screens/minion-08.webp"
          screenTwo="/screens/erreur.webp"
          screenTwoAlt="Deselect AI Die manual override modal"
        />
      </section>

      {/* Step 08: Victory & Loot */}
      <section className="lootSection">
        <div className="shell lootGrid">
          <div>
            <p className="kicker">Step 08 · After victory</p>
            <h2>Claim your loot</h2>
            <p>Every defeated monster triggers a D20 reward roll—restoring HP, boosting resources, and shaping the rest of your 13-battle climb.</p>
          </div>
          <GameScreen src="/screens/minion-09.webp" alt="Victory screen and D20 reward loot" framed />
        </div>
      </section>

      {/* Step 09: Two Paths */}
      <section className="pathSection shell">
        <div className="sectionTitle centered">
          <p className="kicker">Step 09 · Choose your path</p>
          <h2>The map is yours</h2>
          <p>Return to the map after victory. Compare both branching lanes and decide which monster tier to face next.</p>
        </div>
        <div className="pathPair">
          <GameScreen src="/screens/minion-10.webp" alt="Left branch path choice" framed />
          <GameScreen src="/screens/minion-11.webp" alt="Right branch path choice" framed />
        </div>
      </section>

      {/* Step 10: Bestiary */}
      <section className="enemyGallery">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">Step 10 · Collection &amp; Lore</p>
            <h2>Bestiary: A Wide Array of Minions Across 4 Tiers</h2>
            <p style={{ maxWidth: 720, marginTop: 14 }}>
              Browse all validated enemies across Levels 1 to 4, track which foes you have already defeated in your personal collection, and propose new community minions.
            </p>
          </div>
          <div className="galleryRow">
            <GameScreen src="/screens/minion-12.jpg" alt="Minion Rush enemy card profile" />
            <GameScreen src="/screens/minion-bestiary.webp" alt="Bestiary showing defeated enemy collection" framed />
            <div className="tokenCard">
              <GameScreen src="/screens/minion-14.jpg" alt="Battle token management" />
              <h3>Tokens under control</h3>
              <p>Quick access, manual or automatic management, and an explanation for every effect.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="modeHistory">
        <div className="shell historyGrid">
          <div>
            <p className="kicker">Your Minion Rush chronicles</p>
            <h2>Every run earns its rank</h2>
            <p>The history ranks heroes using the score from defeated enemies, while showing battles played, remaining health and play time.</p>
            <div className="scoreRules minionScoreRules">
              <h3>Minion Rush scoring</h3>
              <ul>
                <li className="levelOne"><b>1 point</b><span>Green enemy · Level 1</span></li>
                <li className="levelTwo"><b>2 points</b><span>Blue enemy · Level 2</span></li>
                <li className="levelThree"><b>3 points</b><span>Purple enemy · Level 3</span></li>
                <li className="viseer"><b>4 points</b><span>Viseer · Hard-mode boss companion</span></li>
                <li className="levelFour"><b>6 points</b><span>Orange route boss · Level 4</span></li>
              </ul>
              <p>Defeat the two route bosses to complete the mode. In hard mode, Viseer joins a boss fight and adds 4 points when defeated.</p>
            </div>
          </div>
          <figure className="historyVisual">
            <Image
              src={withBase("/screens/histo-minion.jpg")}
              alt="Minion Rush history ranking heroes by score, battles, remaining health and play time"
              width={921}
              height={2048}
              sizes="(max-width: 900px) 90vw, 42vw"
            />
            <figcaption>Rank heroes by best score, then compare their battles, remaining health and play time.</figcaption>
          </figure>
        </div>
      </section>

      <section className="modeEnd">
        <div className="shell">
          <h2>Ready to forge your path?</h2>
          <Link className="button light" href="/jouer">Start Minion Rush</Link>
        </div>
      </section>
    </main>
  );
}
