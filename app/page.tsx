import Image from "next/image";
import {HardLink as Link} from "./components/HardLink";
import {SiteHeader} from "./components/SiteHeader";
import {GameScreen} from "./components/GameScreen";

export default function Home(){return <main>
  <SiteHeader/>
  <section className="artHero" aria-label="Solo Quest, une aventure Dice Throne en solo">
    <Image src="/home_background_v4.png" alt="Dice Throne Solo Quest — les héros face aux quatre royaumes" fill priority sizes="100vw" />
    <div className="heroFade"/>
  </section>

  <section className="introBand cutBottom">
    <div className="shell introGrid">
      <div><p className="kicker">Application compagnon · Web & Android</p><h1>Votre plateau.<br/><span>Notre ennemi.</span></h1></div>
      <div className="introCopy"><p>Solo Quest ajoute un véritable adversaire à vos parties physiques de Dice Throne. Vous gardez votre plateau, vos cartes et vos dés. L’application joue seulement pour les ennemis.</p><div className="actionRow"><Link className="button fire" href="/jouer">Jouer maintenant</Link><Link className="ghostLink" href="#modes">Découvrir les modes ↓</Link></div></div>
    </div>
  </section>

  <section className="showcase shell">
    <div className="showcaseCopy"><p className="kicker">Une quête, deux chemins</p><h2>Le jeu physique<br/>reste au centre.</h2><p>Solo Quest ne remplace pas Dice Throne : il lui donne une campagne solo. Choisissez votre héros parmi tous les personnages intégrés, installez son plateau devant vous et laissez l’automate prendre le contrôle du camp adverse.</p><ul className="checkList"><li>Tous les héros du jeu intégrés</li><li>Automate de dés séparé de l’IA</li><li>Narration et résolution dans le chat</li></ul></div>
    <div className="phoneStage"><GameScreen src="/screens/hp-02.jpg" alt="Accueil de l’application avec Minion Rush et Naxarus"/><div className="stageLabel"><b>2</b><span>modes solo<br/>dans une app</span></div></div>
  </section>

  <section className="modeSelect" id="modes">
    <div className="shell sectionTitle"><p className="kicker">Choisissez votre épreuve</p><h2>Deux modes.<br/>Deux façons de survivre.</h2></div>
    <div className="modeTiles shell">
      <Link className="modeTile rushTile" href="/modes/minion-rush"><div className="tileShade"/><div className="tileContent"><span className="tileNo">01</span><p>Campagne · Progression</p><h3>Minion Rush</h3><small>82 ennemis. Une route à tracer. Jusqu’à 15 combats.</small><b>Explorer le mode →</b></div></Link>
      <Link className="modeTile naxTile" href="/modes/naxarus"><Image src="/naxarus_head.png" alt="Naxarus, le grand dragon" fill sizes="50vw"/><div className="tileShade"/><div className="tileContent"><span className="tileNo">02</span><p>Boss · Duel narratif</p><h3>Naxarus</h3><small>65 points de vie. Le dragon commence.</small><b>Défier le dragon →</b></div></Link>
    </div>
  </section>

  <section className="systemSection cutTop"><div className="shell"><div className="sectionTitle centered"><p className="kicker">Une séparation volontaire</p><h2>L’automate joue.<br/><span>L’IA raconte.</span></h2></div><div className="systemStory"><GameScreen src="/screens/minion-06.jpg" alt="Combat Minion Rush avec narration en cours"/><div className="systemStoryCopy"><h3>Le combat prend vie</h3><p>Sur cet écran, le héros attaque depuis son propre plateau tandis que l’application conserve le fil du duel dans la zone de dialogue. L’automate reste responsable des dés ennemis ; l’IA transforme seulement les résultats en actions compréhensibles et en narration.</p></div></div><div className="systemGrid"><article><i>01</i><h3>Automate impartial</h3><p>Il lance les dés, calcule les relances et exécute les règles. Il ne dialogue pas et ne peut pas tricher.</p></article><article><i>02</i><h3>IA interprète</h3><p>Elle lit le résultat produit par l’automate, gère les effets et transforme le tour en récit de combat.</p></article><article><i>03</i><h3>Vous décidez</h3><p>Vous déclenchez chaque phase ennemie et pouvez forcer une relance ou éditer un dé avant la résolution.</p></article></div></div></section>

  <section className="heroChoice shell"><GameScreen src="/screens/perso-02.jpg" alt="Sélection parmi tous les héros Dice Throne"/><div><p className="kicker">Votre héros vous attend</p><h2>Tous les personnages.<br/>Toutes les saisons.</h2><p>Filtrez par saison, complexité ou favoris. Puis revenez à votre vrai plateau de jeu : vos cartes, vos dés et vos décisions restent entre vos mains.</p><Link className="button fire" href="/modes/minion-rush">Voir le parcours complet</Link></div></section>

  <section className="betaCta"><div className="shell"><p className="kicker">Bêta privée</p><h2>Aidez-nous à<br/>dompter la quête.</h2><p>Testez les combats, signalez les bugs et proposez les prochaines évolutions depuis votre espace dédié.</p><Link className="button light" href="/inscription">Devenir bêta-testeur</Link></div></section>
  <footer className="darkFooter"><div className="shell"><Image src="/app_icon.png" alt="Solo Quest" width={72} height={72}/><p>Application compagnon non officielle pour Dice Throne.<br/>Dice Throne reste nécessaire pour jouer.</p><div><Link href="/installer">Installer sur Android</Link><Link href="/jouer">Version web</Link><Link href="/admin">Administration</Link></div></div></footer>
</main>}
