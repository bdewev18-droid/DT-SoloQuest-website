"use client";
import { useEffect } from "react";
import { SiteHeader } from "../../components/SiteHeader";
import { HardLink as Link } from "../../components/HardLink";
import { basePath } from "../../components/base-path";

export default function NaxarusRedirectPage() {
  useEffect(() => {
    // Redirection automatique vers Boss Battle
    window.location.replace(`${basePath}/modes/boss-battle`);
  }, []);

  return (
    <main>
      <SiteHeader />
      <section className="modeHero" style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div className="shell">
          <p className="kicker">Mode Boss Battle</p>
          <h1>Redirection en cours…</h1>
          <p style={{ margin: "20px 0" }}>Naxarus a rejoint le nouveau mode <b>Boss Battle</b> multi-boss !</p>
          <Link className="button fire" href="/modes/boss-battle">
            Accéder à Boss Battle →
          </Link>
        </div>
      </section>
    </main>
  );
}
