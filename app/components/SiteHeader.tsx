export function SiteHeader(){
  return <header className="siteHeader">
    <nav className="mainNav shell" aria-label="Navigation principale">
      <div className="navSide navLeft">
        <a href="/modes/minion-rush">Minion Rush</a>
        <a href="/modes/naxarus">Naxarus</a>
        <a href="/historique">Historique</a>
      </div>
      <a className="centerLogo" href="/" aria-label="Solo Quest — accueil">
        <img src="/app_icon.png" alt="Solo Quest" width="106" height="106" />
      </a>
      <div className="navSide navRight">
        <a href="/installer">Android</a>
        <a href="/jouer">Jouer</a>
        <a className="navCta" href="/espace-testeur">Espace testeur</a>
      </div>
    </nav>
  </header>
}
