// Server-side proxy for the Anthropic API.
// The browser calls /api/anthropic; this function adds the secret key and forwards
// the request to Anthropic. NEVER put the key in front-end code.
//
// Works as-is on Vercel (a file in /api becomes a serverless function).
// Set ANTHROPIC_API_KEY in your host's Environment Variables.
//
// Netlify/Cloudflare: move this logic into their function format (see README).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ type: "error", error: { message: "Method not allowed" } });
    return;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res
      .status(500)
      .json({ type: "error", error: { message: "ANTHROPIC_API_KEY is not set on the server." } });
    return;
  }
  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res
      .status(500)
      .json({ type: "error", error: { message: String((e && e.message) || e) } });
  }
}
