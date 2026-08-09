import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://rqxfjffwzdfefinfcxjo.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3EuoFYUzqUvNX7IPrhZKpQ_mkW-Gl97";
export const ADMIN_EMAIL = "bdewev18@gmail.com";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
