"use client";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_EMAIL, supabase } from "../lib/supabase";

type TesterProfile = { status: "approved"; display_name: string | null };
type UserRole = "admin" | "tester" | "external";
type AuthState = { session: Session | null; profile: TesterProfile | null; loading: boolean; isAdmin: boolean; isTester: boolean; role: UserRole; refreshProfile: () => Promise<void> };
const AuthContext = createContext<AuthState>({session:null,profile:null,loading:true,isAdmin:false,isTester:false,role:"external",refreshProfile:async()=>{}});

export function AuthProvider({children}:{children:React.ReactNode}){
  const [session,setSession]=useState<Session|null>(null);
  const [profile,setProfile]=useState<TesterProfile|null>(null);
  const [isTester,setIsTester]=useState(false);
  const [loading,setLoading]=useState(true);
  const loadProfile=async(current:Session|null)=>{
    if(!current){setProfile(null);setIsTester(false);return;}
    const email=current.user.email?.toLowerCase()||"";
    if(email===ADMIN_EMAIL){setProfile({status:"approved",display_name:current.user.user_metadata?.full_name||null});setIsTester(false);return;}
    const {data:claimed}=await supabase.rpc("claim_tester_access");
    if(!claimed){setProfile(null);setIsTester(false);return;}
    const {data}=await supabase.from("site_testers").select("display_name,status").eq("email",email).eq("status","active").maybeSingle();
    setIsTester(Boolean(data));setProfile(data?{status:"approved",display_name:data.display_name}:null);
  };
  const refreshProfile=async()=>loadProfile(session);
  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{setSession(data.session);await loadProfile(data.session);setLoading(false)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);setLoading(true);void loadProfile(next).finally(()=>setLoading(false))});
    return()=>subscription.unsubscribe();
  },[]);
  const isAdmin=session?.user.email?.toLowerCase()===ADMIN_EMAIL;
  const role:UserRole=isAdmin?"admin":isTester?"tester":"external";
  const value=useMemo(()=>({session,profile,loading,isAdmin,isTester,role,refreshProfile}),[session,profile,loading,isAdmin,isTester,role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
