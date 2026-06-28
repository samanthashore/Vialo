# Pyn — peptide & GLP-1 tracker (now with accounts)

Vite + React app with **real accounts and a database** (Supabase). People sign up
with email + password or Google/Apple, and their peptides, logs, and progress are
saved to their account and sync across devices. The AI features (Pairings, photo
scan) still run through the serverless proxy so your Anthropic key stays private.

## What changed from the local version
- `src/supabaseClient.js` — connects to your Supabase project.
- `src/storage.js` — the same `window.storage` the app already used, now backed by
  Supabase and scoped to the signed-in user (was localStorage).
- `src/AuthGate.jsx` — the sign in / sign up / Google / Apple screen. The app only
  loads once someone is signed in.
- `src/App.jsx` — added an **Account** section under the Tools tab (shows your email
  + Sign out). Everything else is unchanged.
- `supabase/schema.sql` — the database table + security rules.

## One-time setup (about 15 minutes)

### 1. Create a Supabase project
Go to https://supabase.com → sign in → **New project**. Pick a name and a strong
database password (save it). Wait ~2 min for it to finish.

### 2. Create the table
In the project: **SQL Editor → New query** → open `supabase/schema.sql` from this
folder, paste the whole thing in, and click **Run**. You should see "Success."

### 3. Get your two keys
**Project Settings → API** (or **Data API**). Copy:
- **Project URL** → this is `VITE_SUPABASE_URL`
- **anon / public** key → this is `VITE_SUPABASE_ANON_KEY`

(The anon key is safe to expose in the browser — your data is protected by the
Row Level Security rules from step 2, not by hiding the key.)

### 4. Add the keys to your environment
- **Local:** create a file named `.env` (copy `.env.example`) and fill in the values.
- **Vercel:** Project → **Settings → Environment Variables** → add `VITE_SUPABASE_URL`
  and `VITE_SUPABASE_ANON_KEY` (check **Production**), then redeploy.

### 5. Turn on sign-in methods
In Supabase: **Authentication → Providers**.
- **Email** is on by default. (For easy testing you can turn OFF "Confirm email" under
  Authentication → Providers → Email, so signups log in instantly.)
- **Google** and **Apple**: toggle on and follow Supabase's setup. Google needs an
  OAuth client (~10 min, free). **Apple sign-in needs a paid Apple Developer account**
  and extra config — email + password works immediately, so you can add Apple later.
- **Authentication → URL Configuration:** set **Site URL** to your live Vercel URL and
  add it to **Redirect URLs**, so Google/Apple return to your app after login.

## Run locally
```bash
npm install
npm run dev          # the app, using your .env keys
# AI features need the proxy too:
npm i -g vercel && vercel dev
```

## Deploy / update the live site
Push this folder to your GitHub repo (overwriting the old files), and Vercel rebuilds
automatically. Make sure the env vars from steps 4–5 are set, then test on your main
URL. Sign up once — your old browser data (if any) lifts into your new account on
first login.

## Privacy note (important)
You're now storing other people's health data on a server. Keep a privacy policy,
and remember the clinic/white-label version handles real patient data (PHI) — that
path needs HIPAA compliance, including a BAA with Anthropic and with Supabase, before
real patients use it.
