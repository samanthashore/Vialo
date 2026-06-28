import { createClient } from "@supabase/supabase-js";

// These come from your Vercel/Local environment variables (see .env.example).
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the keys aren't set yet, we don't crash — the app shows a friendly message.
export const supabaseConfigured = Boolean(url && anon);
export const supabase = supabaseConfigured ? createClient(url, anon) : null;
