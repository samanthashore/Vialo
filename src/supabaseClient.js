import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("🔧 Supabase Init:", {
  url: url ? "✅ URL set" : "❌ URL missing",
  key: anon ? "✅ KEY set" : "❌ KEY missing",
  mode: import.meta.env.MODE
});

export const supabaseConfigured = Boolean(url && anon);

export const supabase = supabaseConfigured 
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "implicit"
      },
      global: {
        headers: {
          "Content-Type": "application/json"
        },
        fetch: async (url, options = {}) => {
          try {
            const response = await fetch(url, options);
            if (!response.ok) {
              console.error("🚨 Supabase fetch error:", response.status, response.statusText, url);
            }
            return response;
          } catch (error) {
            console.error("🚨 Supabase network error:", error.message, url);
            throw error;
          }
        }
      }
    })
  : null;

if (!supabaseConfigured) {
  console.error("⚠️  Supabase NOT configured - auth will fail");
}

export default supabase;
