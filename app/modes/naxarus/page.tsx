"use client";
import { useEffect } from "react";
import { SiteHeader } from "../../components/SiteHeader";
import { HardLink as Link } from "../../components/HardLink";
import { basePath } from "../../components/base-path";
import { useLanguage } from "../../components/LanguageProvider";

export default function NaxarusRedirectPage() {
  const { t } = useLanguage();
  const nr = t.naxarusRedirect;

  useEffect(() => {
    window.location.replace(`${basePath}/modes/boss-battle`);
  }, []);

  return (
    <main>
      <SiteHeader />
      <section className="modeHero" style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div className="shell">
          <p className="kicker">{nr.kicker}</p>
          <h1>{nr.title}</h1>
          <p style={{ margin: "20px 0" }}>
            {nr.copyPrefix}
            <b>{nr.copyStrong}</b>
            {nr.copySuffix}
          </p>
          <Link className="button fire" href="/modes/boss-battle">
            {nr.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
