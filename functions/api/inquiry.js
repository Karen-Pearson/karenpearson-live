// Work with Karen inquiry intake.
// Stores each submission in KV. Email delivery to karen@karenpearson.live
// gets wired through Cloudflare Email Routing when the domain moves to Cloudflare.
export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  try {
    const data = await request.json();
    const clean = (v, n) => String(v || "").trim().slice(0, n);
    const name = clean(data.name, 200);
    const email = clean(data.email, 200);
    const about = clean(data.about, 4000);
    const together = clean(data.together, 4000);
    const manifest = clean(data.manifest, 4000);
    if (!name || !manifest || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: "missing or invalid fields" }, 400);
    }
    const ts = new Date().toISOString();
    const key = `inq:${ts}:${crypto.randomUUID().slice(0, 8)}`;
    await env.INQUIRIES.put(key, JSON.stringify({ ts, name, email, about, together, manifest }));
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "bad request" }, 400);
  }
}
