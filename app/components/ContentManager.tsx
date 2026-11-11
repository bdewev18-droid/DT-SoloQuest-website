"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "./LanguageProvider";

export type ContentMap = Record<string, string>;
export function editableTextNodes(root: ParentNode): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    const parent = text.parentElement;
    if (!parent || !text.nodeValue?.trim()) continue;
    if (parent.closest(".siteHeader,.cmsIgnore,script,style,noscript")) continue;
    nodes.push(text);
  }
  return nodes;
}
export function applyContent(root: ParentNode, map: ContentMap) {
  editableTextNodes(root).forEach((node, index) => {
    const next = map[`t${index}`];
    if (typeof next === "string") node.nodeValue = node.nodeValue!.replace(node.nodeValue!.trim(), next);
  });
}

export function ContentManager() {
  const { locale } = useLanguage();
  useEffect(() => {
    // Only apply English CMS overrides when English is active so French translations stay intact.
    if (location.pathname === "/admin" || locale !== "en") return;
    let cancelled = false;
    const run = async () => {
      const { data } = await supabase
        .from("site_content_live")
        .select("published")
        .eq("page_path", location.pathname)
        .maybeSingle();
      if (cancelled || !data?.published) return;
      setTimeout(() => {
        const root = document.querySelector("main");
        if (root) applyContent(root, data.published as ContentMap);
      }, 250);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [locale]);
  return null;
}

export type HeroSettings = {
  desktopPosition: number;
  desktopZoom: number;
  mobilePosition: number;
  mobileZoom: number;
  desktopButtonBottom: number;
  mobileButtonBottom: number;
};
export const defaultHeroSettings: HeroSettings = {
  desktopPosition: 4,
  desktopZoom: 105,
  mobilePosition: 24,
  mobileZoom: 105,
  desktopButtonBottom: 48,
  mobileButtonBottom: 24,
};
export function applyHeroSettings(target: HTMLElement, settings: HeroSettings) {
  target.style.setProperty("--home-position-desktop", `${settings.desktopPosition}%`);
  target.style.setProperty("--home-scale-desktop", String(settings.desktopZoom / 100));
  target.style.setProperty("--home-position-mobile", `${settings.mobilePosition}%`);
  target.style.setProperty("--home-scale-mobile", String(settings.mobileZoom / 100));
  target.style.setProperty("--home-button-bottom-desktop", `${settings.desktopButtonBottom}px`);
  target.style.setProperty("--home-button-bottom-mobile", `${settings.mobileButtonBottom}px`);
}
export type SiteFeatureSettings = { recruitmentEnabled: boolean };
export const defaultSiteFeatureSettings: SiteFeatureSettings = { recruitmentEnabled: true };
export function applySiteFeatureSettings(target: HTMLElement, settings: SiteFeatureSettings) {
  target.dataset.recruitment = settings.recruitmentEnabled ? "active" : "inactive";
}
export function SiteSettings() {
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      supabase.from("site_content_live").select("published").eq("page_path", "/__home_image").maybeSingle(),
      supabase.from("site_content_live").select("published").eq("page_path", "/__site_features").maybeSingle(),
    ]).then(([hero, features]) => {
      if (cancelled) return;
      if (hero.data?.published)
        applyHeroSettings(document.documentElement, {
          ...defaultHeroSettings,
          ...hero.data.published,
        } as HeroSettings);
      applySiteFeatureSettings(document.documentElement, {
        ...defaultSiteFeatureSettings,
        ...(features.data?.published || {}),
      } as SiteFeatureSettings);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
