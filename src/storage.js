// window.storage — same interface the app already uses (get/set/delete/list),
// but now backed by Supabase and scoped to the signed-in user. Each user's
// data lives in the `app_state` table (one row per key) and is isolated by
// Row Level Security, so people only ever see their own data.
import { supabase } from "./supabaseClient";

let uid = null;

// Called by AuthGate once we know who's signed in (or null on sign-out).
export function setStorageUser(id) {
  uid = id || null;
}

// One-time: if this account has no cloud data yet but there's older data saved
// in this browser (from before accounts existed), lift it into the account so
// nothing is lost. Safe to call on every login — it no-ops if cloud data exists.
export async function migrateLocalData(userId) {
  if (!supabase || !userId) return;
  try {
    const { data } = await supabase
      .from("app_state").select("key").eq("user_id", userId).limit(1);
    if (data && data.length) return; // account already has data
    const rows = [];
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("vialo:")) {
        rows.push({ user_id: userId, key: k.slice(6), value: localStorage.getItem(k) });
      }
    }
    if (rows.length) {
      await supabase.from("app_state").upsert(rows, { onConflict: "user_id,key" });
    }
  } catch (_) { /* ignore */ }
}

if (typeof window !== "undefined") {
  window.storage = {
    async get(key) {
      if (!uid || !supabase) return null;
      const { data, error } = await supabase
        .from("app_state").select("value")
        .eq("user_id", uid).eq("key", key).maybeSingle();
      if (error || !data) return null;
      return { key, value: data.value, shared: false };
    },
    async set(key, value) {
      if (!uid || !supabase) return null;
      const { error } = await supabase.from("app_state").upsert(
        { user_id: uid, key, value, updated_at: new Date().toISOString() },
        { onConflict: "user_id,key" }
      );
      return error ? null : { key, value, shared: false };
    },
    async delete(key) {
      if (!uid || !supabase) return null;
      await supabase.from("app_state").delete().eq("user_id", uid).eq("key", key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      if (!uid || !supabase) return { keys: [], prefix, shared: false };
      const { data } = await supabase
        .from("app_state").select("key").eq("user_id", uid).like("key", `${prefix}%`);
      return { keys: (data || []).map((r) => r.key), prefix, shared: false };
    },
  };
}
