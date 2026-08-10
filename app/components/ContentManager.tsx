"use client";
import {useEffect} from "react";
import {supabase} from "../lib/supabase";

export type ContentMap=Record<string,string>;
export function editableTextNodes(root:ParentNode):Text[]{
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes:Text[]=[];let node:Node|null;
  while((node=walker.nextNode())){
    const text=node as Text;const parent=text.parentElement;
    if(!parent||!text.nodeValue?.trim())continue;
    if(parent.closest(".siteHeader,.cmsIgnore,script,style,noscript"))continue;
    nodes.push(text);
  }
  return nodes;
}
export function applyContent(root:ParentNode,map:ContentMap){editableTextNodes(root).forEach((node,index)=>{const next=map[`t${index}`];if(typeof next==="string")node.nodeValue=node.nodeValue!.replace(node.nodeValue!.trim(),next)})}

export function ContentManager(){
  useEffect(()=>{if(location.pathname==="/admin")return;let cancelled=false;
    const run=async()=>{const {data}=await supabase.from("site_content_live").select("published").eq("page_path",location.pathname).maybeSingle();if(cancelled||!data?.published)return;setTimeout(()=>{const root=document.querySelector("main");if(root)applyContent(root,data.published as ContentMap)},250)};
    void run();return()=>{cancelled=true};
  },[]);return null;
}
