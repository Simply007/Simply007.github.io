# chrastina.dev

The landing page for [chrastina.dev](https://chrastina.dev/). It points visitors to:

- **[ondrej.chrastina.dev](https://ondrej.chrastina.dev/)**, the main website with talks, projects and articles ([source](https://github.com/Simply007/ondrej.chrastina.dev)), shown as the featured card
- **[dev-relations.com](https://dev-relations.com/)**, a space for developers to share knowledge and connect
- **Project websites**: every Simply007 repo with GitHub Pages and no custom domain of its own

This repo is the GitHub **user site** (`Simply007.github.io`). GitHub Pages serves every other Simply007 repo with Pages under the user site's domain, so they all live at `https://chrastina.dev/<repo>/`. Until November 2026 the user site was the personal website and they lived at `ondrej.chrastina.dev/<repo>/`; that site now redirects those old URLs here.

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
| `scripts/update-projects.mjs` | Regenerates the project websites list |
| `projects-exclude.json` | Repos to leave out of the list |
| `.github/workflows/update-projects.yml` | Runs the script weekly and commits changes |
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

### Project websites

The list between `<!-- projects:start -->` and `<!-- projects:end -->` in `index.html` is generated, so don't edit it by hand. `scripts/update-projects.mjs` takes every Simply007 repo with GitHub Pages, keeps the ones that answer 200 at `https://chrastina.dev/<repo>/` (a repo with its own custom domain answers with a redirect instead), sorts them by last push and writes them with their GitHub description and **Fork** / **Archived** tags. It also rewrites the JSON-LD `ItemList` (sites off this domain stay first) and, when anything changed, the sitemap `lastmod`.

The workflow `.github/workflows/update-projects.yml` runs it every Monday at 06:00 UTC, on manual dispatch (Actions → Update project websites → Run workflow), and when the script or the exclude list changes. It commits only when the list changed.

To hide a repo, add its name to `projects-exclude.json`, for example `["Home", "SimplyUpForGrabs"]`. To change a description, edit it on the repo in GitHub; the next run picks it up.

Run it locally:

```bash
GITHUB_TOKEN=$(gh auth token) node scripts/update-projects.mjs
```

A repo that moves off this domain (gets a custom domain or turns Pages off) also needs its entry removed from `src/utils/legacy-redirects.js` in the [personal website](https://github.com/Simply007/ondrej.chrastina.dev), or the old URL keeps redirecting to a dead page.

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
