"use client";
import {useEffect,useState} from "react";
import {useAuth} from "./AuthProvider";
import {supabase} from "../lib/supabase";

export function PrivateSiteGate({children}:{children:React.ReactNode}){
  const {session,loading,isAdmin}=useAuth();const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  useEffect(()=>{if(!loading&&isAdmin&&location.pathname==="/connexion"){const target=new URLSearchParams(location.search).get("retour")||"/";location.replace(target)}},[loading,isAdmin]);
  const login=async()=>{setBusy(true);setError("");const {error:e}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${location.origin}/connexion?retour=%2F`}});if(e){setError(e.message);setBusy(false)}};
  const signOut=async()=>{await supabase.auth.signOut();location.replace("/")};
  if(loading||(isAdmin&&location.pathname==="/connexion"))return <main className="privateGate"><div className="privateGateLoader" aria-label="Loading"/></main>;
  if(isAdmin)return <>{children}</>;
  return <main className="privateGate"><div className="privateGateGlow"/><section className="privateGateCard"><img src="/app_icon.png" width="210" height="210" alt="Solo Quest"/>{session?<><p className="privateGateEyebrow">Private access</p><h1>Access restricted</h1><p>This Google account is not currently authorized to access the website.</p><button className="button light" onClick={signOut}>Use another account</button></>:<><p className="privateGateEyebrow">Solo Quest</p><h1>Private website</h1><p>The app is currently under development.</p><button className="button fire googleLogin" onClick={login} disabled={busy}><span aria-hidden="true">G</span>{busy?"Redirecting…":"Sign in with Google"}</button>{error&&<p className="formError">{error}</p>}</>}</section></main>;
}
