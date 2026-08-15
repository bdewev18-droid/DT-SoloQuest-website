"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";
import { avatarUrl } from "./AvatarPicker";

type HeaderProfile={display_name:string;avatar_key:string};

export function SiteHeader(){
  const {session,isTester,isAdmin,loading}=useAuth(); const [open,setOpen]=useState(false);const [profileOpen,setProfileOpen]=useState(false);const [headerProfile,setHeaderProfile]=useState<HeaderProfile|null>(null);
  const approved=isAdmin||isTester;
  const signOut=async()=>{await supabase.auth.signOut();location.href="/"};
  useEffect(()=>{if(!session){setHeaderProfile(null);return}if(isAdmin){setHeaderProfile({display_name:"Admin",avatar_key:"Barbarian.png"});return}supabase.from("tester_public_profiles").select("display_name,avatar_key").eq("user_id",session.user.id).maybeSingle().then(({data})=>setHeaderProfile(data as HeaderProfile|null))},[session,isAdmin]);
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  return <header className="siteHeader"><nav className="mainNav shell" aria-label="Main navigation">
    <div className="navSide navLeft"><a href="/modes/minion-rush">Minion Rush</a><a href="/modes/naxarus">Naxarus</a></div>
    <a className="centerLogo" href="/" aria-label="Solo Quest — home"><img src="/app_icon.png" alt="Solo Quest" width="106" height="106"/></a>
    <div className="navSide navRight">
      {!loading&&approved&&<a href="/espace-testeur">Tester Space</a>}
      {!loading&&isAdmin&&<a href="/admin">Admin</a>}
      {!loading&&!session&&<a className="loginLink" href="/connexion"><span aria-hidden="true">●</span> Login</a>}
      {!loading&&session&&headerProfile&&<div className="profileMenu"><button className="profileMenuTrigger" type="button" onClick={()=>setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><img src={avatarUrl(headerProfile.avatar_key)} alt=""/><span>{headerProfile.display_name}</span><i aria-hidden="true">⌄</i></button>{profileOpen&&<div className="profileDropdown"><div className="profileDropdownIdentity"><img src={avatarUrl(headerProfile.avatar_key)} alt=""/><span><small>Connected as</small><b>{headerProfile.display_name}</b></span></div>{!isAdmin&&<a href="/espace-testeur?editProfile=1">Edit my profile</a>}{isAdmin&&<a href="/admin">Administration</a>}<button onClick={signOut} type="button">Log out</button></div>}</div>}
    </div>
    <button className="burger" type="button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)}><span/><span/><span/></button>
    <div className={`mobileMenu ${open?"open":""}`} aria-hidden={!open}>
      <div className="mobileMenuInner"><a href="/modes/minion-rush">Minion Rush</a><a href="/modes/naxarus">Naxarus</a>
      {!loading&&approved&&<a href="/espace-testeur">Tester Space</a>}
      {!loading&&isAdmin&&<a href="/admin">Administration</a>}
      {!loading&&!session&&<a href="/connexion">Login</a>}
      {!loading&&session&&headerProfile&&<div className="mobileProfile"><img src={avatarUrl(headerProfile.avatar_key)} alt=""/><b>{headerProfile.display_name}</b></div>}
      {!loading&&session&&!isAdmin&&<a href="/espace-testeur?editProfile=1">Edit my profile</a>}
      {!loading&&session&&<button onClick={signOut} type="button">Log out</button>}</div>
    </div>
  </nav></header>;
}
