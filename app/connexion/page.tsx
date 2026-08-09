"use client";
import { useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../lib/supabase";

export default function Page(){
  const {session,profile,isAdmin}=useAuth(); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  const login=async()=>{setBusy(true);setError("");const retour=new URLSearchParams(location.search).get("retour")||"/espace-testeur";const {error:e}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${location.origin}/connexion?retour=${encodeURIComponent(retour)}`}});if(e){setError(e.message);setBusy(false)}};
  if(session){const approved=isAdmin||profile?.status==="approved";return <main className="subPage"><SiteHeader/><section className="subHero shell"><p className="kicker">Compte connecté</p><h1>Bienvenue</h1><p className="lead">{approved?"Votre accès testeur est actif.":"Votre compte Google est relié. Votre candidature doit encore être validée."}</p><a className="button fire" href={approved?"/espace-testeur":"/inscription"}>{approved?"Ouvrir mon espace":"Compléter ma candidature"}</a></section></main>}
  return <main className="subPage"><SiteHeader/><section className="subHero shell"><p className="kicker">Accès membre</p><h1>Connexion</h1><p className="lead">Connectez-vous avec votre compte Google pour retrouver votre candidature, vos retours et vos accès privés.</p></section><section className="contentGrid shell"><article className="panel"><span className="statusBadge">Connexion sécurisée</span><h2>Continuer avec Google</h2><p>Votre mot de passe Google n’est jamais transmis à Solo Quest.</p><button className="button fire" type="button" onClick={login} disabled={busy}>{busy?"Redirection…":"Continuer avec Google"}</button>{error&&<p className="formError">{error}</p>}</article><aside className="panel"><h2>Pas encore testeur ?</h2><p>Connectez-vous d’abord avec Google, puis complétez votre candidature.</p><a className="button light" href="/inscription">Devenir testeur</a></aside></section></main>;
}
