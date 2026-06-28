import React from "react";
import { createRoot } from "react-dom/client";
import "./storage.js";      // installs window.storage (Supabase-backed, per-user)
import AuthGate from "./AuthGate.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>,
);
