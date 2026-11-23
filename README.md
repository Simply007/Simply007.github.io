# chrastina.dev

Landing page for [chrastina.dev](https://chrastina.dev/). Links to the main website [ondrej.chrastina.dev](https://ondrej.chrastina.dev/) ([source](https://github.com/Simply007/Simply007.github.io)) and to [dev-relations.com](https://dev-relations.com/).

Plain static HTML, no build step. GitHub Pages serves the `main` branch root; `CNAME` sets the custom domain.

## DNS (FORPSI)

| Host | Type | Value |
| --- | --- | --- |
| `chrastina.dev` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `www.chrastina.dev` | CNAME | `simply007.github.io.` |
| `ondrej.chrastina.dev` | CNAME | `simply007.github.io.` (unchanged, the main website) |

## Updating

Edit `index.html`, bump `<lastmod>` in `sitemap.xml`, push to `main`.
