import Image from "next/image";
import Link from "next/link";

export function SiteHeader(){
  return <header className="siteHeader">
    <nav className="mainNav shell" aria-label="Navigation principale">
      <div className="navSide navLeft">
        <Link href="/modes/minion-rush">Minion Rush</Link>
        <Link href="/modes/naxarus">Naxarus</Link>
        <Link href="/historique">Historique</Link>
      </div>
      <Link className="centerLogo" href="/" aria-label="Solo Quest — accueil">
        <Image src="/app_icon.png" alt="Solo Quest" width={106} height={106} priority />
      </Link>
      <div className="navSide navRight">
        <Link href="/installer">Android</Link>
        <Link href="/jouer">Jouer</Link>
        <Link className="navCta" href="/espace-testeur">Espace testeur</Link>
      </div>
    </nav>
  </header>
}
