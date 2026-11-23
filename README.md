# chrastina.dev

The landing page for [chrastina.dev](https://chrastina.dev/). It points visitors to:

- **[ondrej.chrastina.dev](https://ondrej.chrastina.dev/)**, the main website with talks, projects and articles ([source](https://github.com/Simply007/Simply007.github.io))
- **[dev-relations.com](https://dev-relations.com/)**, a space for developers to share knowledge and connect

## Why this page exists

Until November 2026, `chrastina.dev` served the registrar's "no content yet" parking page. Google treats parked domains as low value, and in Search Console none of the 83 pages on `ondrej.chrastina.dev` were indexed. A real page on the apex domain removes that signal and keeps `chrastina.dev` free for other uses later, which a plain 301 redirect would not.

## What's in the repo

There's no build step. GitHub Pages serves the files as they are.

| File | Purpose |
| --- | --- |
| `index.html` | The page: content, inline CSS (light and dark theme), meta tags, Open Graph and JSON-LD |
| `favicon.svg` | Browser tab icon |
| `robots.txt` | Allows all crawlers and points to the sitemap |
| `sitemap.xml` | Lists the one URL with its `lastmod` date |
| `CNAME` | Custom domain for GitHub Pages (`chrastina.dev`) |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll and serve the files as they are |

## Run it locally

Any static file server works, for example:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Change the page

1. Edit `index.html`.
2. If the content changed, set `<lastmod>` in `sitemap.xml` to today's date.
3. Commit and push to `main`. GitHub Pages deploys within a minute or two.

Keep the page about the domain, not about a person: the title, description, Open Graph tags and JSON-LD describe `chrastina.dev` as a guidepost. When you add or remove a site, update both the card in the page and the JSON-LD `ItemList`. The canonical URL stays `https://chrastina.dev/`.

## Hosting and DNS

GitHub Pages serves the `main` branch root, with the custom domain set in `CNAME` and HTTPS enforced. `chrastina.dev` is a verified domain on the GitHub account, so no other account can claim it for its Pages site.

DNS lives at FORPSI. The records this site needs:

| Host | Type | Value |
| --- | --- | --- |
| `chrastina.dev` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `www.chrastina.dev` | CNAME | `simply007.github.io` |

Don't touch the other records on the domain:

| Records | Used for |
| --- | --- |
| `ondrej` and `www.ondrej` CNAME | The main website |
| MX, `v=spf1`, `zoho-verification` and `zmail._domainkey` | Zoho email |
| `google-site-verification` TXT | Google Search Console Domain property |
| `_github-pages-challenge-…` TXT | GitHub Pages domain verification |

## Search Console

The Domain property `chrastina.dev` covers this page and `ondrej.chrastina.dev`. After a significant change, run URL Inspection on `https://chrastina.dev/` and click **Request indexing**.
