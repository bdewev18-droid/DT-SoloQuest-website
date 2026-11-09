import Image from "next/image";
import { HardLink as Link } from "./components/HardLink";
import { SiteHeader } from "./components/SiteHeader";
import { GameScreen } from "./components/GameScreen";
import { withBase } from "./components/base-path";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="artHero" aria-label="Solo Quest, a Dice Throne solo adventure">
        <Image
          src={withBase("/home_background_v4.png")}
          alt="Dice Throne Solo Quest heroes facing the four realms"
          fill
          priority
          sizes="100vw"
        />
        <div className="heroFade" />
        <Link className="heroBetaButton button fire recruitmentZone" href="/inscription">
          Become a Beta Tester
        </Link>
      </section>
      <section className="introBand cutBottom">
        <div className="shell introGrid">
          <div>
            <p className="kicker">Companion app · Web & Android</p>
            <h1>
              Your board.<br />
              <span>Our enemy.</span>
            </h1>
          </div>
          <div className="introCopy">
            <p>
              Solo Quest adds a real opponent to your physical Dice Throne games. You keep your board, cards and dice. The app only plays for your enemies.
            </p>
            <div className="actionRow">
              <Link className="button fire" href="/jouer">
                Play now
              </Link>
              <Link className="ghostLink" href="#modes">
                Discover the modes ↓
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="showcase shell">
        <div className="showcaseCopy">
          <p className="kicker">One quest, two paths</p>
          <h2>
            The physical game<br />
            stays at the heart.
          </h2>
          <p>
            Solo Quest does not replace Dice Throne: it gives it a solo campaign. Choose from every integrated hero, set up your board and let the automation take control of the opposing side.
          </p>
          <ul className="checkList">
            <li>Every Dice Throne hero included</li>
            <li>Dice automation separated from the AI</li>
            <li>Narration and resolution in chat</li>
          </ul>
        </div>
        <div className="phoneStage">
          <GameScreen src="/screens/hp-02.jpg" alt="App home screen with Minion Rush and Naxarus" />
          <div className="stageLabel">
            <b>2</b>
            <span>solo modes<br />in one app</span>
          </div>
        </div>
      </section>
      <section className="modeSelect" id="modes">
        <div className="shell sectionTitle">
          <p className="kicker">Choose your trial</p>
          <h2>Two modes.<br />Two ways to survive.</h2>
        </div>
        <div className="modeTiles shell">
          <Link className="modeTile rushTile" href="/modes/minion-rush">
            <div className="tileShade" />
            <div className="tileContent">
              <span className="tileNo">01</span>
              <p>Campaign · Progression</p>
              <h3>Minion Rush</h3>
              <small>82 enemies. A path to forge. Up to 15 battles.</small>
              <b>Explore the mode →</b>
            </div>
          </Link>
          <Link className="modeTile naxTile" href="/modes/boss-battle">
            <Image src={withBase("/naxarus.webp")} alt="Boss Battle — Naxarus & Ourokhor" fill sizes="50vw" />
            <div className="tileShade" />
            <div className="tileContent">
              <span className="tileNo">02</span>
              <p>Boss Battle · 1 new boss every month</p>
              <h3>Boss Battle</h3>
              <small>Naxarus (65 HP), Ourokhor the Serpent & community boss entries every month.</small>
              <b>Face the bosses →</b>
            </div>
          </Link>
        </div>
      </section>
      <section className="systemSection cutTop">
        <div className="shell">
          <div className="sectionTitle centered">
            <p className="kicker">A deliberate separation</p>
            <h2>
              The automation plays.<br />
              <span>The AI tells the story.</span>
            </h2>
          </div>
          <div className="systemStory">
            <GameScreen src="/screens/minion-06.jpg" alt="Minion Rush battle with live narration" />
            <div className="systemStoryCopy">
              <h3>The battle comes alive</h3>
              <p>
                Your hero attacks from the physical board while the app keeps track of the duel in chat. The automation remains responsible for enemy dice; the AI only turns the results into clear actions and narration.
              </p>
            </div>
          </div>
          <div className="systemGrid">
            <article>
              <i>01</i>
              <h3>Impartial automation</h3>
              <p>It rolls the dice, calculates rerolls and executes the rules. It cannot talk or cheat.</p>
            </article>
            <article>
              <i>02</i>
              <h3>AI interpretation</h3>
              <p>It reads the automation results, manages effects and turns each round into a battle story.</p>
            </article>
            <article>
              <i>03</i>
              <h3>You decide</h3>
              <p>You trigger every enemy phase and may force a reroll or edit a die before resolution.</p>
            </article>
          </div>
        </div>
      </section>
      <section className="heroChoice shell">
        <GameScreen src="/screens/perso-02.jpg" alt="Choose from every Dice Throne hero" />
        <div>
          <p className="kicker">Your hero awaits</p>
          <h2>Every character.<br />Every season.</h2>
          <p>
            Filter by season, complexity or favorites. Then return to your real game board: your cards, dice and decisions stay in your hands.
          </p>
          <Link className="button fire" href="/modes/minion-rush">
            See the full journey
          </Link>
        </div>
      </section>
      <section className="betaCta recruitmentZone">
        <div className="shell">
          <p className="kicker">Private beta</p>
          <h2>Help us<br />tame the quest.</h2>
          <p>Test battles, report bugs and suggest future improvements from your dedicated space.</p>
          <Link className="button light" href="/inscription">
            Become a Beta Tester
          </Link>
        </div>
      </section>
      <footer className="darkFooter">
        <div className="shell">
          <Image src={withBase("/app_icon.png")} alt="Solo Quest" width={72} height={72} />
          <p>
            Unofficial companion app for Dice Throne.<br />
            The physical Dice Throne game is required.
          </p>
          <div>
            <Link href="/installer">Android</Link>
            <Link href="/jouer">Web version</Link>
            <Link href="/admin">Administration</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
