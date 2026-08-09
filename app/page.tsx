import Link from "next/link";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Navigation principale">
        <Link className="brand" href="/"><span className="brandMark">D20</span><span>SOLO<br/>QUEST</span></Link>
        <div className="navLinks">
          <Link href="/modes/minion-rush">Minion Rush</Link>
          <Link href="/modes/naxarus">Naxarus</Link>
          <Link href="/historique">Historique</Link>
          <Link href="/jouer">Jouer</Link>
        </div>
        <Link className="button small" href="/espace-testeur">Espace testeur</Link>
      </nav>

      <section className="hero cinematic shell">
        <div className="heroCopy">
          <p className="eyebrow"><span /> L’aventure commence en solo</p>
          <h1>Votre héros.<br/><em>Leur tour de jouer.</em></h1>
          <p className="lead">Une application compagnon qui donne vie aux ennemis de Dice Throne. Lancez vos dés, affrontez l’automate et laissez l’IA raconter votre combat.</p>
          <div className="actions">
            <Link className="button primary" href="/jouer">Jouer maintenant <Arrow /></Link>
            <Link className="textLink" href="#modes">Découvrir les modes <span>↓</span></Link>
          </div>
          <div className="heroStats">
            <div><strong>Tous</strong><span>les héros intégrés</span></div>
            <div><strong>2</strong><span>modes solo</span></div>
            <div><strong>Web + Android</strong><span>jouez où vous voulez</span></div>
          </div>
        </div>
        <div className="heroArtCredit">Illustration officielle de l’application</div>
      </section>

      <section className="modes shell" id="modes">
        <div className="sectionHead"><p className="eyebrow"><span /> Deux façons de survivre</p><h2>Choisissez votre épreuve</h2></div>
        <div className="modeGrid">
          <article className="modeCard minion">
            <div className="modeNumber">01</div><div className="modeArt"><span>⚔</span></div>
            <div className="modeCopy"><p className="tag">Survie · Vagues successives</p><h3>Minion Rush</h3><p>Affrontez une horde d’ennemis de plus en plus redoutables. Gérez vos ressources, adaptez votre stratégie et voyez jusqu’où votre héros peut tenir.</p><Link href="/modes/minion-rush">Explorer le mode <Arrow /></Link></div>
          </article>
          <article className="modeCard naxarus">
            <div className="modeNumber">02</div><div className="modeArt"><span>◆</span></div>
            <div className="modeCopy"><p className="tag">Boss · Combat narratif</p><h3>Naxarus</h3><p>Défiez un adversaire unique piloté par un automate tactique. Chaque échange est raconté, chaque résultat façonne votre duel.</p><Link href="/modes/naxarus">Affronter Naxarus <Arrow /></Link></div>
          </article>
        </div>
      </section>

      <section className="features shell">
        <div><span className="featureIcon">◉</span><h3>L’ennemi joue vraiment</h3><p>L’automate lance les dés, choisit ses actions et résout ses effets sans ralentir votre partie.</p></div>
        <div><span className="featureIcon">✦</span><h3>Des combats racontés</h3><p>L’IA transforme les résultats en dialogues et en récits pour donner du relief à chaque affrontement.</p></div>
        <div><span className="featureIcon">⌁</span><h3>Votre aventure, conservée</h3><p>Retrouvez bientôt vos parties, vos héros et les moments forts de votre parcours.</p></div>
      </section>

      <section className="beta">
        <div className="shell betaInner">
          <div><p className="eyebrow light"><span /> Rejoindre l’avant-garde</p><h2>Aidez-nous à forger<br/>la meilleure quête solo.</h2></div>
          <div><p>La bêta privée est ouverte. Testez les deux modes, partagez vos impressions et signalez les bugs depuis votre espace dédié.</p><Link className="button pale" href="/inscription">Devenir bêta-testeur <Arrow /></Link><small>Accès sur validation · Connexion Google prévue</small></div>
        </div>
      </section>

      <footer className="footer shell"><Link className="brand" href="/"><span className="brandMark">D20</span><span>SOLO<br/>QUEST</span></Link><p>Application compagnon non officielle pour Dice Throne.</p><div><Link href="/installer">Installer sur Android</Link><Link href="/jouer">Version web</Link><Link href="/admin">Administration</Link></div></footer>
    </main>
  );
}
