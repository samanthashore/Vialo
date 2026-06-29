import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("⚠️  Supabase not configured:", { 
    hasUrl: !!url, 
    hasKey: !!anon,
    env: import.meta.env.MODE
  });
}

export const supabaseConfigured = Boolean(url && anon);
export const supabase = supabaseConfigured 
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      db: { schema: "public" },
      global: {
        fetch: (url, options = {}) => {
          // Log fetch attempts in development
          if (import.meta.env.DEV) {
            console.log("📡 Supabase fetch:", url.toString().slice(0, 100));
          }
          return fetch(url, options);
        }
      }
    })
  : null;
