"use client";
import {useEffect} from "react";

export function ScrollReveal(){
  useEffect(()=>{
    const items=[...document.querySelectorAll<HTMLElement>("main > section:not(.artHero):not(.modeHero), .panel, .journeyStep, .systemGrid article")];
    items.forEach((item,index)=>{item.classList.add("revealReady");item.style.setProperty("--reveal-delay",`${Math.min(index%3,2)*80}ms`)});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -40px"});
    items.forEach(item=>observer.observe(item));
    return()=>observer.disconnect();
  },[]);
  return null;
}
