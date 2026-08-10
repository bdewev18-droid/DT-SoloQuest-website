"use client";
import {useEffect,useRef,useState} from "react";
import {SiteHeader} from "../components/SiteHeader";
import {ProtectedPage} from "../components/ProtectedPage";
import {ContentMap,applyContent,editableTextNodes} from "../components/ContentManager";
import {supabase} from "../lib/supabase";

type Candidate={id:string;email:string;display_name:string|null;status:string};
const pages=[{path:"/",label:"Homepage"},{path:"/modes/minion-rush",label:"Minion Rush"},{path:"/modes/naxarus",label:"Naxarus"},{path:"/connexion",label:"Login"},{path:"/inscription",label:"Become a tester"},{path:"/installer",label:"Android installation"},{path:"/jouer",label:"Play"},{path:"/espace-testeur",label:"Tester Space"}];

export default function Page(){
  const [tab,setTab]=useState<"content"|"testers">("content");const [candidates,setCandidates]=useState<Candidate[]>([]);
  const [page,setPage]=useState("/");const [values,setValues]=useState<ContentMap>({});const [defaults,setDefaults]=useState<ContentMap>({});const [notice,setNotice]=useState("");const [loading,setLoading]=useState(true);const frame=useRef<HTMLIFrameElement>(null);
  const loadCandidates=async()=>{const {data}=await supabase.from("tester_profiles").select("id,email,display_name,status").order("created_at",{ascending:false});setCandidates((data||[]) as Candidate[])};
  useEffect(()=>{void loadCandidates()},[]);
  const setStatus=async(id:string,status:string)=>{await supabase.from("tester_profiles").update({status}).eq("id",id);await loadCandidates()};
  const loadContent=async(path:string)=>{setLoading(true);setNotice("");const {data}=await supabase.from("site_content").select("draft,published").eq("page_path",path).maybeSingle();setValues((data?.draft||data?.published||{}) as ContentMap);setLoading(false)};
  useEffect(()=>{void loadContent(page)},[page]);
  const inspectFrame=()=>{const doc=frame.current?.contentDocument;if(!doc)return;const root=doc.querySelector("main");if(!root)return;setTimeout(()=>{const nodes=editableTextNodes(root);const base:Object=Object.fromEntries(nodes.map((n,i)=>[`t${i}`,n.nodeValue?.trim()||""]));setDefaults(base as ContentMap);applyContent(root,values)},450)};
  useEffect(()=>{const doc=frame.current?.contentDocument;const root=doc?.querySelector("main");if(root)applyContent(root,values)},[values]);
  const change=(key:string,value:string)=>{setValues(current=>({...current,[key]:value}));const doc=frame.current?.contentDocument;const root=doc?.querySelector("main");if(root){const index=Number(key.slice(1));const node=editableTextNodes(root)[index];if(node)node.nodeValue=value}};
  const save=async(publish:boolean)=>{setNotice("Saving…");const payload=publish?{page_path:page,draft:values,published:values,updated_at:new Date().toISOString()}:{page_path:page,draft:values,updated_at:new Date().toISOString()};const {error}=await supabase.from("site_content").upsert(payload,{onConflict:"page_path"});setNotice(error?`Unable to save: ${error.message}`:publish?"Changes published successfully.":"Draft saved. The public page has not changed.")};
  const resetDraft=()=>{setValues(defaults);setNotice("Original text restored in the preview. Publish to apply it.")};
  return <main className="subPage"><SiteHeader/><ProtectedPage admin><section className="subHero shell cmsIgnore"><p className="eyebrow"><span/>Administration</p><h1>Control room</h1><p className="lead">Edit website content and manage beta tester access.</p></section><section className="shell adminSection cmsIgnore">
    <div className="adminTabs"><button className={tab==="content"?"active":""} onClick={()=>setTab("content")}>Website content</button><button className={tab==="testers"?"active":""} onClick={()=>setTab("testers")}>Beta testers</button></div>
    {tab==="content"?<div className="cmsWorkspace"><aside className="panel cmsEditor"><div className="cmsToolbar"><label>Page<select value={page} onChange={e=>setPage(e.target.value)}>{pages.map(p=><option value={p.path} key={p.path}>{p.label}</option>)}</select></label><div><button onClick={()=>save(false)}>Save draft</button><button className="publish" onClick={()=>save(true)}>Publish changes</button></div></div><p className="cmsHint">Edit the fields below. The preview updates instantly. Save a draft to continue later, or publish when everything is ready.</p>{notice&&<p className="formNotice">{notice}</p>}<div className="cmsFields">{loading?<p>Loading content…</p>:Object.keys(defaults).map((key,index)=><label key={key}><span>Text {index+1}</span><textarea value={values[key]??defaults[key]} onChange={e=>change(key,e.target.value)}/></label>)}</div><button className="resetContent" onClick={resetDraft}>Restore original text</button></aside><div className="cmsPreview"><div className="previewBar"><span>Live preview</span><a href={page} target="_blank" rel="noreferrer">Open page ↗</a></div><iframe ref={frame} key={page} src={`${page}?cmsPreview=1`} title="Live page preview" onLoad={inspectFrame}/></div></div>:
    <div className="panel"><h2>Tester applications</h2>{candidates.length===0?<p>No applications.</p>:<div className="candidateList">{candidates.map(c=><article key={c.id}><div><strong>{c.display_name||"No nickname"}</strong><small>{c.email}</small><span className="statusBadge">{c.status}</span></div><div className="adminActions"><button onClick={()=>setStatus(c.id,"approved")}>Approve</button><button onClick={()=>setStatus(c.id,"rejected")}>Reject</button><button onClick={()=>setStatus(c.id,"pending")}>Pending</button></div></article>)}</div>}</div>}
  </section></ProtectedPage></main>}
