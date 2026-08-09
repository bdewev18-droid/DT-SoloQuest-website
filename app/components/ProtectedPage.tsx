"use client";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectedPage({children,admin=false}:{children:React.ReactNode;admin?:boolean}){
  const {session,profile,loading,isAdmin}=useAuth();
  const allowed=admin ? isAdmin : isAdmin || profile?.status==="approved";
  useEffect(()=>{if(!loading&&!session)location.replace(`/connexion?retour=${encodeURIComponent(location.pathname)}`)},[loading,session]);
  if(loading||!session)return <section className="accessState"><p>Checking your access…</p></section>;
  if(!allowed)return <section className="accessState"><span className="statusBadge">Approval pending</span><h1>Your application is being reviewed</h1><p>You will gain access as soon as your account is approved.</p><a className="button light" href="/">Back to home</a></section>;
  return <>{children}</>;
}
