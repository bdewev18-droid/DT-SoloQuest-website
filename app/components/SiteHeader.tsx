"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

export function SiteHeader(){
  const {session,profile,isAdmin,loading}=useAuth(); const [open,setOpen]=useState(false);
  const approved=isAdmin||profile?.status==="approved";
  const signOut=async()=>{await supabase.auth.signOut();location.href="/"};
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  return <header className="siteHeader"><nav className="mainNav shell" aria-label="Main navigation">
    <div className="navSide navLeft"><a href="/modes/minion-rush">Minion Rush</a><a href="/modes/naxarus">Naxarus</a></div>
    <a className="centerLogo" href="/" aria-label="Solo Quest — home"><img src="/app_icon.png" alt="Solo Quest" width="106" height="106"/></a>
    <div className="navSide navRight">
      {!loading&&approved&&<><a href="/installer">Android</a><a href="/jouer">Play</a><a href="/espace-testeur">Tester Space</a></>}
      {!loading&&isAdmin&&<a href="/admin">Admin</a>}
      {!loading&&!session&&<><a className="testerLink" href="/inscription">Become a tester</a><a className="loginLink" href="/connexion"><span aria-hidden="true">●</span> Login</a></>}
      {!loading&&session&&<button className="logoutLink" onClick={signOut} type="button">Log out</button>}
    </div>
    <button className="burger" type="button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
    <div className={`mobileMenu ${open?"open":""}`} aria-hidden={!open}>
      <div className="mobileMenuInner"><a href="/modes/minion-rush">Minion Rush</a><a href="/modes/naxarus">Naxarus</a>
      {!loading&&approved&&<><a href="/installer">Android</a><a href="/jouer">Play</a><a href="/espace-testeur">Tester Space</a></>}
      {!loading&&isAdmin&&<a href="/admin">Administration</a>}
      {!loading&&!session&&<><a className="mobileTester" href="/inscription">Become a Beta Tester</a><a href="/connexion">Login</a></>}
      {!loading&&session&&<button onClick={signOut} type="button">Log out</button>}</div>
    </div>
  </nav></header>;
}
