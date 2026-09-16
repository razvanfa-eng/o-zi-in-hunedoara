/*
 * Funcție Netlify — primește o recenzie, verifică captcha (Cloudflare
 * Turnstile), încarcă opțional poza în Supabase Storage și inserează
 * rândul cu status = "pending" (moderare).
 *
 * Variabile de mediu necesare (Netlify -> Site settings -> Environment):
 *   SUPABASE_URL                 https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    cheia "service_role" (SECRETĂ — doar aici)
 *   TURNSTILE_SECRET_KEY         secret key de la Cloudflare Turnstile
 *                                (dacă lipsește, verificarea captcha e sărită)
 *
 * Bucket Storage (public) așteptat:  review-photos
 */

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let p;
  try { p = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  const placeId = String(p.placeId || "").trim();
  const rating = Number(p.rating);
  const name = String(p.name || "").trim();
  const title = String(p.title || "").trim();
  const body = String(p.body || "").trim();

  if (!placeId || !name || !body || !(rating >= 1 && rating <= 5)) {
    return json({ error: "Missing or invalid fields" }, 400);
  }
  if (name.length > 80 || title.length > 120 || body.length > 4000) {
    return json({ error: "Field too long" }, 400);
  }

  // --- Captcha (Cloudflare Turnstile) ---
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: String(p.token || "") })
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!verify.success) return json({ error: "Captcha failed" }, 400);
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) return json({ error: "Server not configured" }, 500);
  const base = SUPABASE_URL.replace(/\/$/, "");

  // --- Poză opțională -> Supabase Storage ---
  let image_url = null;
  if (p.imageBase64 && /^image\/(png|jpe?g|webp)$/.test(String(p.imageType || ""))) {
    try {
      const bytes = Buffer.from(String(p.imageBase64), "base64");
      if (bytes.length > 0 && bytes.length <= 3 * 1024 * 1024) {
        const ext = p.imageType === "image/png" ? "png" : p.imageType === "image/webp" ? "webp" : "jpg";
        const objPath = `review-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const up = await fetch(`${base}/storage/v1/object/${objPath}`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${SERVICE_KEY}`,
            apikey: SERVICE_KEY,
            "content-type": p.imageType,
            "x-upsert": "true"
          },
          body: bytes
        });
        if (up.ok) image_url = `${base}/storage/v1/object/public/${objPath}`;
      }
    } catch { /* ignoră eroarea de poză, salvează recenzia oricum */ }
  }

  // --- Inserare rând (moderare: status pending) ---
  const ins = await fetch(`${base}/rest/v1/reviews`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "content-type": "application/json",
      prefer: "return=minimal"
    },
    body: JSON.stringify({
      place_id: placeId,
      rating,
      author_name: name,
      title: title || null,
      body,
      image_url,
      status: "pending"
    })
  });

  if (!ins.ok) {
    const detail = await ins.text().catch(() => "");
    return json({ error: "Could not save review", detail: detail.slice(0, 300) }, 502);
  }
  return json({ ok: true, moderated: true });
};
