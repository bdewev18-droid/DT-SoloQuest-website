"use client";
import {useEffect} from "react";

export function ScrollReveal(){
  useEffect(()=>{
    const items=[...document.querySelectorAll<HTMLElement>("main > section:not(.artHero):not(.modeHero), .panel, .journeyStep, .systemGrid article")];
    items.forEach((item,index)=>{item.classList.add("revealReady");item.style.setProperty("--reveal-delay",`${Math.min(index%3,2)*80}ms`)});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -40px"});
    items.forEach(item=>observer.observe(item));
    const hero=document.querySelector<HTMLElement>(".artHero");
    let ticking=false;
    const parallax=()=>{if(!hero||ticking)return;ticking=true;requestAnimationFrame(()=>{const ratio=Math.min(window.scrollY/Math.max(hero.offsetHeight,1),1);hero.style.setProperty("--hero-shift",`${ratio*-105}px`);ticking=false})};
    window.addEventListener("scroll",parallax,{passive:true});parallax();
    return()=>{observer.disconnect();window.removeEventListener("scroll",parallax)};
  },[]);
  return null;
}
