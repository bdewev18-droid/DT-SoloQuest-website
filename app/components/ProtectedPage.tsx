"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectedPage({children,admin=false}:{children:React.ReactNode;admin?:boolean}){
  const {session,isTester,loading,isAdmin}=useAuth();
  const allowed=admin ? isAdmin : isAdmin || isTester;
  useEffect(()=>{if(!loading&&!session)location.replace(`/connexion?retour=${encodeURIComponent(location.pathname)}`)},[loading,session]);
  if(loading||!session)return <section className="accessState"><p>Checking your access…</p></section>;
  if(!allowed)return <section className="accessState"><span className="statusBadge">Access restricted</span><h1>Tester access required</h1><p>This Google account is not on the approved tester list.</p><a className="button light" href="/">Back to pre-home</a></section>;
  return <>{children}</>;
}
