"use client";
import {FormEvent,useEffect,useMemo,useState} from "react";
import {supabase} from "../lib/supabase";
import {avatarUrl} from "./AvatarPicker";

const statuses={en_attente:"Pending",consulte:"Reviewed",valide:"Validated",rejete:"Rejected",en_cours_dev:"In development",a_tester:"Ready to test",cloture:"Closed"} as const;
type Status=keyof typeof statuses;
type Report={id:string;user_id:string;kind:string;mode:string;subject:string;details:string;status:Status;admin_comment:string|null;screenshot_url:string|null;admin_screenshot_urls:string[];created_at:string};
type Profile={user_id:string;display_name:string;avatar_key:string};
type Like={feedback_id:string};

export function AdminBacklog(){
  const [reports,setReports]=useState<Report[]>([]);
  const [profiles,setProfiles]=useState<Profile[]>([]);
  const [likes,setLikes]=useState<Like[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [filter,setFilter]=useState("all");
  const [notice,setNotice]=useState("");
  const [proofFiles,setProofFiles]=useState<File[]>([]);
  const [saving,setSaving]=useState(false);
  const load=async()=>{const [r,p,l]=await Promise.all([supabase.from("tester_feedback").select("id,user_id,kind,mode,subject,details,status,admin_comment,screenshot_url,admin_screenshot_urls,created_at").order("created_at",{ascending:false}),supabase.from("tester_public_profiles").select("user_id,display_name,avatar_key"),supabase.from("tester_feedback_votes").select("feedback_id")]);setReports((r.data||[]) as Report[]);setProfiles((p.data||[]) as Profile[]);setLikes((l.data||[]) as Like[])};
  useEffect(()=>{void load()},[]);
  useEffect(()=>{setProofFiles([]);setNotice("")},[selected]);
  const profileMap=useMemo(()=>Object.fromEntries(profiles.map(p=>[p.user_id,p])),[profiles]);
  const active=reports.find(r=>r.id===selected)||null;
  const filtered=reports.filter(r=>filter==="all"||r.status===filter);
  const counts=useMemo(()=>Object.fromEntries(Object.keys(statuses).map(status=>[status,reports.filter(r=>r.status===status).length])) as Record<string,number>,[reports]);
  const likeCount=(id:string)=>likes.filter(l=>l.feedback_id===id).length;
  const save=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();if(!active)return;setSaving(true);setNotice("Saving update…");try{const f=new FormData(e.currentTarget);const {data:{user}}=await supabase.auth.getUser();if(!user)throw new Error("Admin session unavailable.");const uploaded=await Promise.all(proofFiles.slice(0,4).map(async file=>{const ext=file.name.split(".").pop()?.toLowerCase()||"png";const path=`${user.id}/admin-corrections/${active.id}/${crypto.randomUUID()}.${ext}`;const {error}=await supabase.storage.from("report-screenshots").upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return supabase.storage.from("report-screenshots").getPublicUrl(path).data.publicUrl}));const {error}=await supabase.from("tester_feedback").update({status:f.get("status"),admin_comment:f.get("admin_comment"),admin_screenshot_urls:[...(active.admin_screenshot_urls||[]),...uploaded],updated_at:new Date().toISOString()}).eq("id",active.id);if(error)throw error;setProofFiles([]);setNotice("Backlog and correction images updated.");await load()}catch(error){setNotice(error instanceof Error?error.message:"Unable to save the update.")}finally{setSaving(false)}};
  return <section className="adminBacklog">
    <div className="backlogToolbar"><div><p className="eyebrow"><span/>Product feedback</p><h2>Tester backlog</h2><p className="backlogIntro">Prioritize reports, make progress visible and keep testers informed.</p></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses · {reports.length}</option>{Object.entries(statuses).map(([k,v])=><option value={k} key={k}>{v} · {counts[k]||0}</option>)}</select></div>
    <div className="statusOverview">{Object.entries(statuses).map(([key,label])=><button key={key} className={`${filter===key?"active":""} ${key}`} onClick={()=>setFilter(filter===key?"all":key)}><span className={`statusDot ${key}`}/><b>{counts[key]||0}</b><small>{label}</small></button>)}</div>
    <div className="adminBacklogGrid"><div className="backlogList"><div className="backlogListHeader"><span>Report</span><span>Status / likes</span></div>{filtered.map(r=>{const p=profileMap[r.user_id];return <button className={selected===r.id?"selected":""} onClick={()=>setSelected(r.id)} key={r.id}><img src={avatarUrl(p?.avatar_key||"Barbarian.png")} alt=""/><span><small>{r.kind} · {r.mode}</small><strong>{r.subject}</strong><em>{p?.display_name||"Tester"} · {new Date(r.created_at).toLocaleDateString("en-GB")}</em></span><span className="backlogMeta"><i className={`reportStatus ${r.status}`}>{statuses[r.status]}</i><em>♥ {likeCount(r.id)}</em></span></button>})}{filtered.length===0&&<p className="emptyBacklogList">No reports with this status.</p>}</div>
    {active?<form className="panel backlogDetail" onSubmit={save}>
      <div className="backlogDetailHead"><img src={avatarUrl(profileMap[active.user_id]?.avatar_key||"Barbarian.png")} alt=""/><div><p className="eyebrow"><span/>{active.kind} · {active.mode}</p><h3>{active.subject}</h3><small>{profileMap[active.user_id]?.display_name||"Tester"} · ♥ {likeCount(active.id)} likes</small></div><span className={`currentStatus ${active.status}`}>Current status<strong>{statuses[active.status]}</strong></span></div>
      <div className="backlogReportBody"><h4>Tester report</h4><p>{active.details}</p>{active.screenshot_url&&<div className="evidenceGallery single"><a href={active.screenshot_url} target="_blank" rel="noreferrer"><img src={active.screenshot_url} alt="Tester report attachment"/><span>Open tester image</span></a></div>}</div>
      <fieldset className="statusEditor"><legend>Update status</legend><div>{Object.entries(statuses).map(([key,label])=><label className={key} key={key}><input type="radio" name="status" value={key} defaultChecked={key===active.status} key={`${active.id}-${key}`}/><span><i className={`statusDot ${key}`}/>{label}</span></label>)}</div></fieldset>
      <label className="adminCommentField"><span>Admin response to testers</span><small>This comment is displayed prominently in the tester report.</small><textarea name="admin_comment" defaultValue={active.admin_comment||""} key={`${active.id}-comment`} placeholder="Decision, progress and next step…"/></label>
      <section className="adminProofField"><div><span>Correction images</span><small>Add up to 4 screenshots showing what was fixed. Testers will see them with your response.</small></div>{active.admin_screenshot_urls?.length>0&&<div className="evidenceGallery">{active.admin_screenshot_urls.map((url,index)=><a href={url} target="_blank" rel="noreferrer" key={url}><img src={url} alt={`Correction proof ${index+1}`}/><span>Proof {index+1}</span></a>)}</div>}<label className="proofUpload">Add correction images<input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={e=>setProofFiles(Array.from(e.target.files||[]).slice(0,4))}/></label>{proofFiles.length>0&&<div className="pendingProofs">{proofFiles.map(file=><span key={`${file.name}-${file.size}`}>{file.name}</span>)}</div>}</section>
      <div className="backlogSaveBar"><span>Changes update the public tester backlog.</span><button className="button fire" disabled={saving}>{saving?"Saving…":"Save treatment"}</button></div>{notice&&<p className="formNotice">{notice}</p>}
    </form>:<div className="panel backlogEmpty"><span className="statusBadge">Backlog</span><h3>Select a report</h3><p>Review its details, change its status and send a clear response to testers.</p></div>}</div>
  </section>
}
