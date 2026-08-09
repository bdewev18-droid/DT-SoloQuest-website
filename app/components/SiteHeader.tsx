"use client";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

export function SiteHeader(){
  const {session,profile,isAdmin,loading}=useAuth();
  const approved=isAdmin||profile?.status==="approved";
  const signOut=async()=>{await supabase.auth.signOut();location.href="/"};
  return <header className="siteHeader"><nav className="mainNav shell" aria-label="Navigation principale">
    <div className="navSide navLeft"><a href="/modes/minion-rush">Minion Rush</a><a href="/modes/naxarus">Naxarus</a><a href="/historique">Historique</a></div>
    <a className="centerLogo" href="/" aria-label="Solo Quest — accueil"><img src="/app_icon.png" alt="Solo Quest" width="106" height="106"/></a>
    <div className="navSide navRight">
      {!loading&&approved&&<><a href="/installer">Android</a><a href="/jouer">Jouer</a><a href="/espace-testeur">Espace testeur</a></>}
      {!loading&&isAdmin&&<a href="/admin">Admin</a>}
      {!loading&&!session&&<><a className="testerLink" href="/inscription">Devenir testeur</a><a className="loginLink" href="/connexion"><span aria-hidden="true">●</span> Login</a></>}
      {!loading&&session&&<button className="logoutLink" onClick={signOut} type="button">Déconnexion</button>}
    </div>
  </nav></header>;
}
