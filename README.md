# karenpearson.live

The live site for Karen Pearson, philosopher, author, and artist on Decatur Island.

Hosted on Cloudflare Pages, project `karenpearson-live`, on Karen's own Cloudflare
account. Pushing to `main` is source control. Publishing is `wrangler pages deploy site`.

## What is here

- `site/` the whole website. 50 pages: 34 essays, the blog index, the questions
  page, work, vlog, and eleven legal pages.
- `functions/` Cloudflare Pages Functions. The contact form intake, the CSV export,
  and the middleware that redirects every `*.pages.dev` hostname to karenpearson.live
  so there is only ever one copy of this site.
- `wrangler.toml` project and KV binding.

## Do not change these two things

`site/robots.txt` reads `Allow: /` with no `Disallow` for any AI crawler. That is
deliberate. It is what lets ChatGPT, Claude, Perplexity, Google and Bing read this
site and quote it in answers. Adding a `Disallow` line, or turning on Cloudflare's
managed robots.txt in the dashboard, removes this site from those answers.

`functions/_middleware.js` keeps every preview URL pointing home. Removing it creates
a duplicate copy of the site at a different address, which splits the site's authority.

Built 2026-08-03.
