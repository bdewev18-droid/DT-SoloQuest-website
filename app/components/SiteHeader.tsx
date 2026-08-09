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
        <a className="testerLink" href="/inscription">Devenir testeur</a>
        <a className="loginLink" href="/connexion"><span aria-hidden="true">●</span> Login</a>
      </div>
    </nav>
  </header>
}
