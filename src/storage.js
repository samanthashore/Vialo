// Drop-in replacement for the prototype's `window.storage`, backed by localStorage.
// The app code calls window.storage.get/set/delete/list and is otherwise unchanged.
// When you add accounts + a backend later, swap this file for API calls.
const NS = "vialo:";

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const v = localStorage.getItem(NS + key);
      return v == null ? null : { key, value: v, shared: false };
    },
    async set(key, value) {
      localStorage.setItem(NS + key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(NS + key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(NS))
        .map((k) => k.slice(NS.length))
        .filter((k) => k.startsWith(prefix));
      return { keys, prefix, shared: false };
    },
  };
}
