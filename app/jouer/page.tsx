"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {SiteHeader} from "../components/SiteHeader";
import {ProtectedPage} from "../components/ProtectedPage";
import {useAuth} from "../components/AuthProvider";

const GAME_URL="https://bdewev18-droid.github.io/Dice-throne-Solo/";
const GAME_ORIGIN="https://bdewev18-droid.github.io";

export default function Page(){
  const [playing,setPlaying]=useState(false);
  const {session}=useAuth();
  const gameFrame=useRef<HTMLIFrameElement>(null);
  const syncSession=useCallback(()=>{
    if(!session||!gameFrame.current?.contentWindow)return;
    gameFrame.current.contentWindow.postMessage(JSON.stringify({type:"solo-quest-auth",access_token:session.access_token,refresh_token:session.refresh_token}),GAME_ORIGIN);
  },[session]);
  useEffect(()=>{
    const receive=(event:MessageEvent)=>{
      if(event.origin!==GAME_ORIGIN||event.source!==gameFrame.current?.contentWindow||typeof event.data!=="string")return;
      try{if(JSON.parse(event.data)?.type==="solo-quest-auth-ready")syncSession()}catch{}
    };
    window.addEventListener("message",receive);
    return()=>window.removeEventListener("message",receive);
  },[syncSession]);
  return <main className="subPage"><SiteHeader/><ProtectedPage>
    <section className="subHero shell"><p className="eyebrow"><span/>Tester access</p><h1>Play Solo Quest</h1><p className="lead">Install the Android beta or launch the browser version without leaving the Solo Quest tester website.</p></section>
    <section className="playHub shell">
      <article className="panel androidPanel"><div><span className="statusBadge">Android beta</span><h2>Install the APK</h2><p>The app is not yet available on the Play Store. Download the official APK, allow installation from this source temporarily, then open the file and sign in with your approved Google account.</p></div><ol className="steps"><li>Download the official APK.</li><li>Allow installation from this source in Android settings.</li><li>Open the downloaded file and confirm installation.</li><li>Launch Solo Quest and sign in with your tester account.</li></ol><div className="apkAction"><span className="statusBadge">APK link coming soon</span><small>Android may show a warning for apps installed outside the Play Store.</small></div></article>
      <article className="panel browserPlayIntro"><div><p className="eyebrow"><span/>Browser version</p><h2>Play directly online</h2><p>Launch the web version inside this protected page. The Solo Quest header remains available, and the game address stays behind the site interface.</p></div><button className="button fire" type="button" onClick={()=>setPlaying(true)}>Launch browser game</button></article>
      {playing&&<section className="browserGame" id="browser-game"><div className="browserGameBar"><strong>Solo Quest · Web game</strong><button type="button" onClick={()=>setPlaying(false)}>Close game</button></div><iframe ref={gameFrame} src={GAME_URL} title="Solo Quest browser game" allow="fullscreen; clipboard-read; clipboard-write" allowFullScreen onLoad={syncSession}/></section>}
    </section>
  </ProtectedPage></main>;
}
