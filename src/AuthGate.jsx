import React, { useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "./supabaseClient";
import { setStorageUser, migrateLocalData } from "./storage.js";
import App from "./App.jsx";

const ACCENT = "#1c8a74";

const css = `
.va-root{position:fixed;inset:0;background:#f5f6f8;display:flex;align-items:center;justify-content:center;padding:22px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1c2128;overflow:auto;}
.va-card{width:100%;max-width:380px;background:#fff;border:1px solid #ebedf0;border-radius:22px;padding:28px 24px;box-shadow:0 12px 40px rgba(28,33,40,.06);}
.va-brand{display:flex;align-items:center;justify-content:center;gap:9px;margin-bottom:4px;}
.va-logo{width:34px;height:34px;border-radius:10px;background:${ACCENT};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;}
.va-name{font-size:22px;font-weight:780;letter-spacing:-.02em;}
.va-sub{text-align:center;color:#6b7280;font-size:13.5px;margin:6px 0 20px;}
.va-field{margin-bottom:11px;}
.va-label{display:block;font-size:12px;font-weight:650;color:#6b7280;margin:0 0 5px 2px;}
.va-input{width:100%;box-sizing:border-box;border:1px solid #e2e5e9;border-radius:12px;padding:12px 13px;font-size:15px;outline:none;background:#fafbfc;color:#1c2128;transition:border .15s;}
.va-input:focus{border-color:${ACCENT};background:#fff;}
.va-btn{width:100%;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .15s,transform .05s;}
.va-btn:active{transform:scale(.99);}
.va-btn-primary{background:${ACCENT};color:#fff;margin-top:4px;}
.va-btn-primary:disabled{opacity:.6;cursor:default;}
.va-oauth{display:flex;align-items:center;justify-content:center;gap:9px;background:#fff;border:1px solid #e2e5e9;color:#1c2128;margin-top:9px;}
.va-oauth:hover{background:#fafbfc;}
.va-divider{display:flex;align-items:center;gap:10px;color:#9aa1ab;font-size:12px;margin:17px 0;}
.va-divider::before,.va-divider::after{content:"";flex:1;height:1px;background:#ebedf0;}
.va-toggle{text-align:center;font-size:13.5px;color:#6b7280;margin-top:18px;}
.va-toggle button{background:none;border:none;color:${ACCENT};font-weight:700;cursor:pointer;font-size:13.5px;padding:0 2px;}
.va-msg{border-radius:11px;padding:10px 12px;font-size:13px;margin-bottom:12px;line-height:1.4;}
.va-msg.err{background:#fdecec;color:#b4231f;}
.va-msg.ok{background:#e8f5f1;color:#15705e;}
.va-foot{text-align:center;font-size:11.5px;color:#9aa1ab;margin-top:18px;line-height:1.5;}
.va-load{position:fixed;inset:0;background:#f5f6f8;display:flex;align-items:center;justify-content:center;}
.va-spin{width:26px;height:26px;border:3px solid #e2e5e9;border-top-color:${ACCENT};border-radius:50%;animation:vaspin .7s linear infinite;}
@keyframes vaspin{to{transform:rotate(360deg);}}
`;

function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"/></svg>
  );
}
function AppleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M17.05 12.54c-.02-2.07 1.69-3.06 1.77-3.11-.96-1.41-2.46-1.6-2.99-1.62-1.27-.13-2.49.75-3.13.75-.65 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.04 8.23.69.99 1.51 2.1 2.58 2.06 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.7.65 1.11-.02 1.82-1.01 2.5-2.01.79-1.15 1.11-2.27 1.13-2.33-.02-.01-2.17-.83-2.19-3.29ZM15 6.27c.57-.69.96-1.65.85-2.61-.82.03-1.82.55-2.41 1.24-.53.61-.99 1.59-.87 2.52.92.07 1.85-.46 2.43-1.15Z"/></svg>
  );
}

export default function AuthGate() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false); // storage user set + migration done

  useEffect(() => {
    if (!supabaseConfigured) { setChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (session?.user) {
        setStorageUser(session.user.id);
        await migrateLocalData(session.user.id);
        if (active) setReady(true);
      } else {
        setStorageUser(null);
        setReady(false);
      }
    })();
    return () => { active = false; };
  }, [session]);

  if (!supabaseConfigured) {
    return (
      <div className="va-root"><style>{css}</style>
        <div className="va-card">
          <div className="va-brand"><div className="va-logo">V</div><div className="va-name">Vialo</div></div>
          <div className="va-msg err" style={{ marginTop: 16 }}>
            Accounts aren’t configured yet. Add <b>VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b> to your
            environment variables, then redeploy. (See the README.)
          </div>
        </div>
      </div>
    );
  }

  if (checking) return <div className="va-load"><style>{css}</style><div className="va-spin" /></div>;

  if (session && ready) return <App />;
  if (session && !ready) return <div className="va-load"><style>{css}</style><div className="va-spin" /></div>;

  return <AuthForm />;
}

function AuthForm() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const submit = async () => {
    setErr(""); setOk("");
    if (!email || !pw) { setErr("Enter your email and password."); return; }
    if (mode === "signup" && pw.length < 6) { setErr("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) setErr(error.message);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password: pw });
        if (error) setErr(error.message);
        else if (!data.session) setOk("Check your email to confirm your account, then sign in.");
      }
    } catch (e) { setErr(String(e?.message || e)); }
    setBusy(false);
  };

  const oauth = async (provider) => {
    setErr("");
    try {
      await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
    } catch (e) { setErr(String(e?.message || e)); }
  };

  return (
    <div className="va-root"><style>{css}</style>
      <div className="va-card">
        <div className="va-brand"><div className="va-logo">V</div><div className="va-name">Vialo</div></div>
        <div className="va-sub">{mode === "signin" ? "Sign in to your protocol" : "Create your account"}</div>

        {err && <div className="va-msg err">{err}</div>}
        {ok && <div className="va-msg ok">{ok}</div>}

        <div className="va-field">
          <label className="va-label">Email</label>
          <input className="va-input" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <div className="va-field">
          <label className="va-label">Password</label>
          <input className="va-input" type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"} value={pw}
            onChange={(e) => setPw(e.target.value)} placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>

        <button className="va-btn va-btn-primary" disabled={busy} onClick={submit}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        <div className="va-divider">or</div>

        <button className="va-btn va-oauth" onClick={() => oauth("google")}><GoogleMark /> Continue with Google</button>
        <button className="va-btn va-oauth" onClick={() => oauth("apple")}><AppleMark /> Continue with Apple</button>

        <div className="va-toggle">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); setOk(""); }}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </div>

        <div className="va-foot">
          Your data is private to your account. Vialo is for tracking and education only — not medical advice.
        </div>
      </div>
    </div>
  );
}
