"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectedPage({children,admin=false}:{children:React.ReactNode;admin?:boolean}){
  const {session,profile,loading,isAdmin}=useAuth();
  const allowed=admin ? isAdmin : isAdmin || profile?.status==="approved";
  useEffect(()=>{if(!loading&&!session)location.replace(`/connexion?retour=${encodeURIComponent(location.pathname)}`)},[loading,session]);
  if(loading||!session)return <section className="accessState"><p>Vérification de votre accès…</p></section>;
  if(!allowed)return <section className="accessState"><span className="statusBadge">Validation en attente</span><h1>Votre candidature est en cours d’examen</h1><p>Vous pourrez accéder à cet espace dès que votre compte aura été validé.</p><a className="button light" href="/">Retour à l’accueil</a></section>;
  return <>{children}</>;
}
