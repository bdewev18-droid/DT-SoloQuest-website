"use client";
import { SiteHeader } from "../components/SiteHeader";
import { ProtectedPage } from "../components/ProtectedPage";
import { ReportWorkspace } from "../components/ReportWorkspace";
import { useLanguage } from "../components/LanguageProvider";

export default function Page() {
  const { t } = useLanguage();
  const ts = t.testerSpace;
  return (
    <main className="subPage testerHubPage">
      <SiteHeader />
      <ProtectedPage>
        <section className="subHero shell">
          <p className="eyebrow">
            <span />
            {ts.eyebrow}
          </p>
          <h1>{ts.title}</h1>
          <p className="lead">{ts.lead}</p>
        </section>
        <ReportWorkspace />
      </ProtectedPage>
    </main>
  );
}
