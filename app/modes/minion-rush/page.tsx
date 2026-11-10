import Image from "next/image";
import { HardLink as Link } from "../../components/HardLink";
import { SiteHeader } from "../../components/SiteHeader";
import { GameScreen } from "../../components/GameScreen";
import { withBase } from "../../components/base-path";

function Step({
  n,
  title,
  text: copy,
  screen
}: {
  n: string;
  title: string;
  text: string;
  screen: string;
}) {
  return (
    <article className="journeyStep">
      <div className="stepCopy">
        <span>{n}</span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <GameScreen src={screen} alt={title} />
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
          <p>Choose your path, defeat a randomly drawn army and survive the final battle.</p>
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
      <section className="overview shell">
        <GameScreen src="/screens/minion-04.jpg" alt="Full Minion Rush map" />
        <div>
          <p className="kicker">A branching campaign</p>
          <h2>Your road to the summit</h2>
          <p>Progress across a complete map, choose your battles and collect the points you need. Each run randomly selects opponents from a roster of 77 validated minions.</p>
          <Link className="button fire" href="/jouer">Start a game</Link>
        </div>
      </section>
      <section className="difficulty">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">Step 01</p>
            <h2>Choose the difficulty</h2>
          </div>
          <div className="screenDuo">
            <GameScreen src="/screens/minion-01.jpg" alt="Normal Minion Rush difficulty" />
            <GameScreen src="/screens/minion-02.jpg" alt="Hard Minion Rush difficulty" />
            <div className="duoCopy">
              <h3>Free, Normal, or Hard</h3>
              <p>Choose from 3 game modes: <strong>Normal</strong> (balanced 33-point goal), <strong>Hard</strong> (demanding 52-point goal featuring Viseer), or <strong>Free</strong> mode where you freely configure your enemy roster. Defeat 13 enemies across the map to complete Minion Rush.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="journey shell">
        <Step n="02" title="Prepare your hero" text="Choose any integrated character. Your physical board remains your command center." screen="/screens/perso-02.webp" />
        <Step n="03" title="Discover your target" text="Before each battle, review the monster profile, abilities and dangers ahead." screen="/screens/minion-05.jpg" />
        <Step n="04" title="Attack from your board" text="Roll your own dice and play your cards. The app opens the narration and keeps track of the battle." screen="/screens/minion-06.webp" />
        <Step n="05" title="Let the enemy defend" text="The automation rolls the enemy dice. The AI interprets the result, resolves tokens and explains everything in chat." screen="/screens/minion-07.jpg" />
        <Step n="06" title="Keep the final say" text="The automation statistically selects rerolls. You may still force a reroll or edit a die before the AI resolves the turn." screen="/screens/minion-08.jpg" />
      </section>
      <section className="lootSection">
        <div className="shell lootGrid">
          <div>
            <p className="kicker">After victory</p>
            <h2>Claim your loot</h2>
            <p>Every defeated monster leaves a reward. Your progress, points and resources shape the rest of your journey.</p>
          </div>
          <GameScreen src="/screens/minion-09.jpg" alt="Loot earned after battle" />
        </div>
      </section>
      <section className="pathSection shell">
        <div className="sectionTitle centered">
          <p className="kicker">Choose your path</p>
          <h2>The map is yours</h2>
          <p>Return to the map after battle. Different routes lead to different encounters and rewards.</p>
        </div>
        <div className="pathPair">
          <GameScreen src="/screens/minion-10.jpg" alt="First path choice" />
          <GameScreen src="/screens/minion-11.jpg" alt="Second path choice" />
        </div>
      </section>
      <section className="enemyGallery">
        <div className="shell">
          <div className="sectionTitle">
            <p className="kicker">An unpredictable army</p>
            <h2>Meet 77 validated minions</h2>
          </div>
          <div className="galleryRow">
            <GameScreen src="/screens/minion-12.jpg" alt="Minion Rush enemy example" />
            <GameScreen src="/screens/minion-13.jpg" alt="Another Minion Rush enemy" />
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
            <figcaption>Compare average score, battles, remaining health and play time for each hero.</figcaption>
          </figure>
        </div>
      </section>
      <section className="modeEnd">
        <div className="shell">
          <h2>Ready for your first run?</h2>
          <Link className="button light" href="/jouer">Play Minion Rush</Link>
        </div>
      </section>
    </main>
  );
}
