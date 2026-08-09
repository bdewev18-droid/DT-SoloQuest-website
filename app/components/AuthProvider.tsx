"use client";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_EMAIL, supabase } from "../lib/supabase";

type TesterProfile = { status: "pending" | "approved" | "rejected"; display_name: string | null };
type AuthState = { session: Session | null; profile: TesterProfile | null; loading: boolean; isAdmin: boolean; refreshProfile: () => Promise<void> };
const AuthContext = createContext<AuthState>({session:null,profile:null,loading:true,isAdmin:false,refreshProfile:async()=>{}});

export function AuthProvider({children}:{children:React.ReactNode}){
  const [session,setSession]=useState<Session|null>(null);
  const [profile,setProfile]=useState<TesterProfile|null>(null);
  const [loading,setLoading]=useState(true);
  const loadProfile=async(current:Session|null)=>{
    if(!current){setProfile(null);return;}
    const {data}=await supabase.from("tester_profiles").select("status,display_name").eq("id",current.user.id).maybeSingle();
    setProfile(data as TesterProfile|null);
  };
  const refreshProfile=async()=>loadProfile(session);
  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{setSession(data.session);await loadProfile(data.session);setLoading(false)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);void loadProfile(next);setLoading(false)});
    return()=>subscription.unsubscribe();
  },[]);
  const value=useMemo(()=>({session,profile,loading,isAdmin:session?.user.email?.toLowerCase()===ADMIN_EMAIL,refreshProfile}),[session,profile,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
