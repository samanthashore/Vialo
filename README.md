# Vialo — peptide & GLP-1 tracker

A Vite + React app, generated from the working prototype. It runs in any browser,
installs as a PWA, and is ready to deploy. The AI features (Pairings, photo-scan)
call your own serverless proxy so the Anthropic API key is never exposed.

> Rename freely: change `name` in `package.json`, `<title>` in `index.html`, and the
> `name`/`short_name` in `public/manifest.webmanifest`.

## Run it locally

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). Everything works locally
**except the AI features**, which need the server proxy (next section). Your data
is saved in the browser via localStorage (`src/storage.js`).

## Turn on the AI features (Pairings + photo-scan)

These call `/api/anthropic`, a serverless function (`api/anthropic.js`) that holds
your secret key. To run the full app locally with the proxy:

```bash
npm i -g vercel
vercel dev        # serves the app + /api together
```

Set your key first (get one at https://console.anthropic.com):

```bash
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env   # local only; never commit
```

## Deploy (fastest: Vercel)

1. Push this folder to a GitHub repo.
2. Import it at https://vercel.com — it auto-detects Vite.
3. In the project's **Settings → Environment Variables**, add `ANTHROPIC_API_KEY`.
4. Deploy. You get a live URL; point your domain at it.

The `/api/anthropic.js` function deploys automatically. `vercel.json` rewrites all
non-API routes to `index.html` so the single-page app works on refresh.

Netlify/Cloudflare also work — move `api/anthropic.js` into their functions format
(`netlify/functions/` or a Worker) and set the same env var.

## Install as an app (PWA)

On a deployed HTTPS URL, mobile browsers offer "Add to Home Screen." Add real
icons at `public/icon-192.png` and `public/icon-512.png` (referenced in the
manifest) before shipping. For App Store / Play Store presence, wrap this build
with **Capacitor** (`npm i @capacitor/core @capacitor/cli`, then `npx cap init`)
to get native camera, push notifications, and store listings while reusing this code.

## Project layout

```
api/anthropic.js     server proxy — holds ANTHROPIC_API_KEY, forwards to Anthropic
src/App.jsx          the app (one component; calls /api/anthropic for AI)
src/storage.js       window.storage shim backed by localStorage (swap for a DB later)
src/main.jsx         mounts the app
public/manifest...   PWA manifest
vercel.json          SPA routing + API passthrough
```

## Before real users / a clinic version

- Add real PWA icons and a privacy policy.
- Keep it a **tracking/education** tool — don't sell or facilitate buying peptides
  in-app (App Store policy + legal risk). Link out to the clinic for commerce.
- The provider dashboard / patient data is **PHI**: that version needs accounts, a
  real database, and HIPAA compliance (incl. a BAA with Anthropic and your host).
- Have a clinician review the "What to expect" content before anyone relies on it.
