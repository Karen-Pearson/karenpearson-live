// CSV export of all inquiries. Requires the secret key.
// GET /api/inquiries?key=<INQUIRY_KEY>
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.INQUIRY_KEY || url.searchParams.get("key") !== env.INQUIRY_KEY) {
    return new Response("forbidden", { status: 403 });
  }
  const rows = [["time", "name", "email", "about", "together", "manifest", "legacy_message"]];
  let cursor;
  do {
    const page = await env.INQUIRIES.list({ prefix: "inq:", cursor });
    for (const k of page.keys) {
      const v = await env.INQUIRIES.get(k.name);
      if (v) {
        const d = JSON.parse(v);
        rows.push([d.ts, d.name, d.email, d.about || "", d.together || "", d.manifest || "", d.message || ""]);
      }
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  const csv = rows
    .map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(","))
    .join("\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=work-with-karen-inquiries.csv",
    },
  });
}
