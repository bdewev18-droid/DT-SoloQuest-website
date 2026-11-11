"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { HardLink as Link } from "./HardLink";
import { useLanguage } from "./LanguageProvider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ProtectedPage({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { session, isTester, loading, isAdmin } = useAuth();
  const { t } = useLanguage();
  const pp = t.protectedPage;
  const allowed = admin ? isAdmin : isAdmin || isTester;

  useEffect(() => {
    if (!loading && !session) {
      location.replace(`${basePath}/connexion?retour=${encodeURIComponent(location.pathname)}`);
    }
  }, [loading, session]);

  if (loading || !session)
    return (
      <section className="accessState">
        <p>{pp.checkingAccess}</p>
      </section>
    );
  if (!allowed) {
    return (
      <section className="accessState">
        <span className="statusBadge">{pp.restrictedBadge}</span>
        <h1>{pp.testerRequiredTitle}</h1>
        <p>{pp.testerRequiredCopy}</p>
        <Link className="button light" href="/">
          {pp.backHome}
        </Link>
      </section>
    );
  }
  return <>{children}</>;
}
