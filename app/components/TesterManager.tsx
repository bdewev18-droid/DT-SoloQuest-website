"use client";
import {FormEvent,useEffect,useState} from "react";
import {supabase} from "../lib/supabase";

type Tester={id:string;email:string;display_name:string|null;user_id:string|null;status:"active"|"disabled";added_at:string;last_login_at:string|null};

export function TesterManager(){
  const [testers,setTesters]=useState<Tester[]>([]);
  const [email,setEmail]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const load=async()=>{const {data,error}=await supabase.from("site_testers").select("id,email,display_name,user_id,status,added_at,last_login_at").order("added_at",{ascending:false});if(error)setNotice(error.message);else setTesters((data||[]) as Tester[])};
  useEffect(()=>{void load()},[]);
  const addTester=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const normalized=email.trim().toLowerCase();if(!/^[^\s@]+@gmail\.com$/.test(normalized)){setNotice("Enter a valid Gmail address.");return}setBusy(true);setNotice("");const {error}=await supabase.from("site_testers").upsert({email:normalized,status:"active",added_by:"bdewev18@gmail.com"},{onConflict:"email"});setBusy(false);if(error)setNotice(error.message);else{setEmail("");setNotice("Tester added to the approved list.");await load()}};
  const removeTester=async(id:string)=>{setBusy(true);const {error}=await supabase.from("site_testers").delete().eq("id",id);setBusy(false);if(error)setNotice(error.message);else{setNotice("Tester removed from the approved list.");await load()}};
  return <div className="panel testerManager"><div className="testerManagerHead"><div><span className="statusBadge">Access allowlist</span><h2>Approved beta testers</h2><p>Only Google accounts listed here can pass the pre-home and access the tester website.</p></div><form onSubmit={addTester}><label>Tester Gmail address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tester@gmail.com" required/></label><button className="button fire" disabled={busy}>{busy?"Saving…":"Add tester"}</button></form></div>{notice&&<p className="formNotice">{notice}</p>}<div className="testerList">{testers.length===0?<p>No approved testers yet.</p>:testers.map(t=><article key={t.id}><div><strong>{t.display_name||t.email}</strong>{t.display_name&&<small>{t.email}</small>}<span className={`testerConnection ${t.user_id?"linked":"waiting"}`}>{t.user_id?"Google account linked":"Awaiting first login"}</span></div><div><small>{t.last_login_at?`Last login ${new Date(t.last_login_at).toLocaleDateString("en-GB")}`:"Never logged in"}</small><button type="button" onClick={()=>removeTester(t.id)} disabled={busy}>Remove</button></div></article>)}</div></div>;
}
