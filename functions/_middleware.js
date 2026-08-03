// One site, one address: karenpearson.live.
//
// Cloudflare gives every Pages project a *.pages.dev hostname and there is no
// setting to turn it off. karenpearson-live.pages.dev exists, and so does a
// preview hostname for every deployment ever made. This makes all of them
// serve nothing but a permanent redirect home.
//
// WHY IT MATTERS: the live site and every pages.dev hostname serve identical
// files. Left alone that is a fully crawlable duplicate of the site, for a
// client whose entire value is being the ONE entity AI systems recommend.
// Duplicates split citations and authority. noindex would hide it from search
// but still serve her content to anyone who hit the URL. A 301 is stronger:
// nothing is served, crawlers record karenpearson.live, and any link that ever
// pointed at a pages.dev URL passes its value to her real domain.
//
// Nicole's ruling 2026-08-03: "I don't want pages.dev. I want karenpearson.live.
// That's all."
//
// Matches the .pages.dev suffix rather than a list of hostnames, so it covers
// karenpearson-live.pages.dev, every <hash>.karenpearson-live.pages.dev preview,
// and any future branch alias, with nothing to remember to update.

const CANONICAL_HOST = "karenpearson.live";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const host = url.hostname;

  if (host === CANONICAL_HOST) {
    return next();
  }

  if (host === `www.${CANONICAL_HOST}` || host.endsWith(".pages.dev")) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }

  // Any other hostname reaching this Worker is unexpected. Serve it, but never
  // let it be indexed, so an unforeseen host cannot become a second copy.
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set("X-Robots-Tag", "noindex, nofollow");
  return out;
}
