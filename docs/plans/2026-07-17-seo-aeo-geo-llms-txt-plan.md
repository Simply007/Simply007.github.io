# SEO → AEO/GEO package: robots.txt, llms.txt, llms-full.txt, per-page meta, JSON-LD, RSS

Status: designed & user-refined, not yet implemented (2026-07-17).

## Reviewing from the phone (setup before starting)

The task-by-task review happens from the user's phone via two channels:

**1. Claude Remote Control — conversation, approvals, questions.**
- One-time setup: install the Claude mobile app (iOS/Android), sign in with the same account as the Mac.
- Connect this session: run `/rc` in the running session (or start via `claude remote-control` for a QR code / session URL), then open it on the phone (scan QR or pick the session under **Code** in the app).
- Enable push: run `/config` and turn on **"Push when actions required"** (permission prompts, review questions) and **"Push when Claude decides"** (task-ready notifications). Accept OS notification permission on the phone.
- The full conversation syncs: the user sees each task announcement + evidence, answers review questions, and approves permission prompts from the phone.
- Constraint: the `claude` process must keep running on the Mac. Laptop sleep is fine (auto-reconnects); killing the terminal ends the session. Docs: https://code.claude.com/docs/en/remote-control.md

**2. GitHub mobile app — the actual diff review.**
- Each task is committed **and pushed to the PR branch immediately**, so the diff is reviewable per-commit on the phone (GitHub app → PR → Commits).
- The user's PR comments / review verdicts on GitHub are part of the durable review record; the Review record table below links each task's commit hash to the verdict.
- After each push, Claude sends a push notification ("task N ready for review: <commit subject>") and waits.

## Execution & review protocol (read first)

Work proceeds **task by task** — one numbered task from the Implementation order at a time. Do not batch tasks. For each task:

1. **Announce** the task before touching anything: which files will be created/modified and how (referencing the relevant plan section).
2. **Implement** only that task, then **show the evidence**: the diff (`git diff`) or new-file contents, plus the task's verification output (e.g., converter smoke-test result, generated `public/llms.txt` snippet, view-source excerpt).
3. **Stop and wait for the user's review.** Do not start the next task until the user approves or requests changes.
4. **Record the review** in the Review record table just below this protocol: task, commit hash, files touched, verification evidence summary, user verdict (approved / changes requested + notes, or link to the GitHub PR review comment), date. Each task is committed and **pushed to the PR branch before review** so the diff is inspectable from the phone; approval gates starting the *next* task, not the commit itself.

If the user requests changes, apply them as a follow-up commit, re-show evidence, and add a new row (don't overwrite the previous verdict) — the table plus the per-commit PR history is the audit trail of the review.

## Review record

| # | Task | Commit | Files touched | Evidence shown | Verdict | Date |
|---|------|--------|---------------|----------------|---------|------|
| 1 | Branch + plan doc + deps (turndown 7.2.4, gatsby-plugin-feed 5.16.0) | 77c2ad4, bad8128 | docs/plans/…plan.md, package.json, package-lock.json | `node -e require(...)` confirmed both packages resolve; npm audit notice pre-existing, install clean; PR #50 opened | ✅ approved (blanket go-ahead 2026-07-20: "the plan is on… start implementing") | 2026-07-17 |
| 2 | SEO utils + rich-text→markdown converter | (see feat commit) | src/utils/seo.js, lib/rich-text-to-markdown.js | Smoke test vs real page-data: 3 fenced ```javascript blocks, 2 images, no `<object>`/`&nbsp;` remnants. Fix applied: turndown routes empty `<object>` through `blankReplacement`, not rules | ✅ per blanket go-ahead | 2026-07-20 |
| 3 | static-seo-files builders + onPostBuild | (see feat commit) | lib/static-seo-files.js, gatsby-node.js | Build writes public/robots.txt (828 B), llms.txt (19 KB), llms-full.txt (120 KB) | ✅ per blanket go-ahead | 2026-07-20 |
| 4 | siteMetadata + RSS feed | (see feat commit) | gatsby-config.js | public/rss.xml valid XML, 10 journal items, correct /journal/{slug}/ links + pubDates | ✅ per blanket go-ahead | 2026-07-20 |
| 5 | layout.js per-page SEO merge + global JSON-LD | (see feat commit) | src/components/layout.js | Built HTML: per-page titles, canonical + rss alternate links, og:url==canonical, WebSite + Person (9 sameAs) on every page | ✅ per blanket go-ahead | 2026-07-20 |
| 6 | templates seo prop + RichText /journal/ fix | d996c48 | 5 templates, RichText.js | journal→BlogPosting, project→SoftwareSourceCode, talk→CreativeWork verified in built HTML; og:type article on journal/talks | ✅ per blanket go-ahead | 2026-07-20 |
| 7 | format + full build verification | (this commit) | prettier-normalized files | `KONTENT_PREVIEW_ENABLED=false npm run build` succeeds (local preview key expired — 401 unrelated to changes; CI uses delivery API). All checklist items pass | ✅ per blanket go-ahead | 2026-07-20 |
| 8 | Combined RSS: journal + projects + talks in /rss.xml | 24a87f2 | gatsby-config.js, layout.js | Rebuilt: 50 items (10 Journal, 16 Projects, 24 Talks), date-sorted DESC, category per item, feed + link titles updated | ✅ user-requested change | 2026-07-20 |

## Context

The site (Gatsby 5 + Kontent.ai, https://ondrej.chrastina.dev, GitHub Pages) currently has good but incomplete SEO:

- ✅ `sitemap.xml` — generated by `gatsby-plugin-sitemap` (gatsby-config.js:55-59, excludes `/style-guide*`); emits `/sitemap-index.xml` + `/sitemap-0.xml` with trailing-slash URLs.
- ✅ Global meta/OG/Twitter tags — `react-helmet` in `src/components/layout.js:218-266`, fed from the Kontent `default_layout` item via StaticQuery. **Same meta on every page.**
- ❌ No `robots.txt`, no per-page title/description, no canonical URLs, no JSON-LD, no RSS, no `llms.txt`/`llms-full.txt`.
- Note: articles are cross-posted to dev.to with `canonical_url` pointing back to this site — adding self-referencing `<link rel="canonical">` here reinforces this site as the original source when crawlers reconcile the duplicates.

Goal (user-confirmed): full AEO/GEO package. `llms-full.txt` contains **full article bodies** converted to markdown. `robots.txt` **explicitly welcomes all AI crawlers**. Generation lives in a custom `onPostBuild` in `gatsby-node.js` (no extra robots plugin).

**Verified facts** (checked against real built page-data and source):
- `content.value` is an HTML string with `<object type="application/kenticocloud" data-codename="X">` placeholders for modular content and `<figure><img src="https://assets-eu-01.kc-usercontent.com/...">` with src already inlined.
- `code_snippet.elements.code.value` is a JSON string `{"language","code"}`.
- Templates' `link_to.value` fragments already include `__typename` (journal-item.js:91).
- Single language: `KONTENT_LANGUAGE_CODENAMES=en-US`; layout hardcodes `en-US`.
- `npm run copy` (cpx CNAME) doesn't clean `public/`, so onPostBuild output survives.
- Gatsby page templates always receive a `location` prop (pathname has trailing slash — `trailingSlash: 'always'` default).
- Pre-existing bug: `src/components/RichText.js:76` links gotcha buttons to `/gotchas/{slug}` but pages live at `/journal/{slug}` — fix in the same PR since the markdown converter must use `/journal/`.

## Dependencies

```bash
npm install turndown gatsby-plugin-feed
```
- `turndown` — HTML→markdown; bundles domino so it runs in plain Node (CJS). Handles nested lists/entities/inline code that regex conversion would botch.
- `gatsby-plugin-feed@^5.14.0` — RSS with proper XML escaping/RFC-822 dates; supports arbitrary sources via custom `query`+`serialize`.

## Files to create

### 1. `src/utils/seo.js` (CJS so both gatsby-config/node and webpack can use it)
Exports `SITE_URL = 'https://ondrej.chrastina.dev'`, `AUTHOR_NAME = 'Ondřej Chrastina'`, and `stripHtml(html)` (tag strip + entity decode + whitespace collapse).

### 2. `lib/rich-text-to-markdown.js` (node-only)
`richTextToMarkdown(contentElement)`:
- Turndown with `{ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' }`.
- Custom rule for `<object type="application/kenticocloud">`: look up `data-codename` in a Map built from `modular_content`; `code_snippet` → fenced block with language (parse `code.value` JSON); `button` → markdown link (external_url, or `/projects/{slug}/`, `/journal/{slug}/` for gotcha, `/{slug}/` for navigation_item — absolute URLs); unknown types → `''`.
- `<figure><img>` converts to `![alt](url)` out of the box — no rule needed.
- Defensive: return `''` for missing/empty content.

**Smoke-test first** (de-risks the whole feature): `node -e` the converter against the content element in `public/page-data/journal/ckeditor-5-pitfall-don-t-forget-the-paragraph-plugin/page-data.json` — expect fenced ```javascript blocks, image links, no `<object>`/`&nbsp;` remnants.

### 3. `lib/static-seo-files.js` — three pure builders
- `buildRobotsTxt()` — `User-agent: * / Allow: /`, then explicit per-bot Allow groups (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, meta-externalagent), `Sitemap: https://ondrej.chrastina.dev/sitemap-index.xml`, and header comments pointing at `/llms.txt` and `/llms-full.txt` (no standard robots directive for those). No Disallow lines.
- `buildLlmsTxt(...)` — llmstxt.org format: `# Ondřej Chrastina`, `> {stripped meta_description}`, pointer to llms-full.txt, then `## Journal`, `## Projects`, `## Talks` sections of `- [title](absolute-url/): first line of stripped summary`, and an `## Optional` section linking sitemap + `/rss.xml`.
- `buildLlmsFullTxt(...)` — same header, then per item (journal, projects, talks) separated by `---`: `# title`, bullet metadata (URL, Published date, Section, extra links: live_url/source_code_url/slides_url/recording_url when present), stripped summary, then `richTextToMarkdown(content)`.

All generated URLs absolute with trailing slashes (must match sitemap). Don't add .txt files to the sitemap; skip `<link>` tags for llms.txt (no established convention).

## Files to modify

### 4. `gatsby-node.js` — add `onPostBuild`
- Query (with `$language` from `process.env.KONTENT_LANGUAGE_CODENAMES.split(',')[0].trim()`): `kontentItemLayout` (default_layout title + meta_description), `allKontentItemGotcha` / `allKontentItemProject` / `allKontentItemTalk` — same filters as createPages (`url_slug ne ""`, `channel_purpose` = website, sorted by date DESC), with title/summary/date/url_slug/content incl. modular_content fragments mirrored from `src/templates/journal-item.js:64-134` (plus talk/project extra URL fields).
- `reporter.panicOnBuild` on query errors; `fs.writeFileSync('./public/robots.txt' | 'llms.txt' | 'llms-full.txt', ...)`; `reporter.info` on success.

### 5. `gatsby-config.js`
- `siteMetadata`: add `title` and `description` (gatsby-plugin-feed validates these), keep `siteUrl`.
- Add `gatsby-plugin-feed` with `output: '/rss.xml'`, custom query over `allKontentItemGotcha` (same website/url_slug filter, post_date DESC) and `serialize` mapping to `{ title, description: stripHtml(summary), date: post_date, url/guid: siteUrl + /journal/{slug}/ }`. `require('./src/utils/seo')` at top for `stripHtml`.

### 6. `src/components/layout.js` — per-page SEO merge (keep class component + react-helmet + StaticQuery)
New optional prop: `<Layout seo={{ title, description, path, ogType, image, jsonLd }}>`.
- Add `site { siteMetadata { siteUrl } }` to the StaticQuery.
- Merge in the render callback: `title = seo.title ? \`${seo.title} | ${defaultTitle}\` : defaultTitle`; `description = seo.description || meta_description`; `canonicalUrl = siteUrl + (seo.path || '/')`; image = `seo.image` (Kontent asset `{url,width,height}`) or default-layout image, keeping the existing `?w=1200&format=auto` resize + height math.
- Update Helmet: page title, og:/twitter: title+description, `og:type = seo.ogType || 'website'`, `og:url = canonicalUrl` (replaces `site_url.value`), plus `link=[{rel:'canonical', href:canonicalUrl}, {rel:'alternate', type:'application/rss+xml', href: siteUrl+'/rss.xml', title:'Ondřej Chrastina — Journal'}]`.
- Global JSON-LD on every page as Helmet `<script type="application/ld+json">` children: `WebSite` (name, url, description) + `Person` (AUTHOR_NAME, url, `sameAs` built from footer social accounts using the `account_pattern.value.replace('%s', handle)` logic already in `src/components/Footer.js:8`), concatenated with `seo.jsonLd` (object or array).

### 7. Templates — pass `seo` prop (destructure `location` from props)
- `journal-item.js`: `title`, `description: stripHtml(summary)`, `path: location.pathname`, `ogType: 'article'`, `image`, `jsonLd: BlogPosting` (headline, description, datePublished: post_date, image, url/mainEntityOfPage: SITE_URL+pathname, author Person, inLanguage 'en').
- `project-item.js`: same pattern; `jsonLd` `@type: source_code_url ? 'SoftwareSourceCode' : 'CreativeWork'` with `codeRepository`, `url: live_url || canonical`, `datePublished: release_date`.
- `talk-item.js`: `ogType: 'article'`; `jsonLd: CreativeWork` with `sameAs: [recording_url, slides_url].filter(Boolean)`; add `associatedMedia: VideoObject` when recording_url exists. (Event rejected — no venue/event-date data.)
- `listing-page.js`: `title` (primary_text), `path`; optional CollectionPage JSON-LD (low priority).
- `sections-page.js`: `title` (header), `path`.
- `home.js`: `seo={{ path: location.pathname }}` only — defaults are correct for the homepage.

### 8. `src/components/RichText.js:76` — fix `/gotchas/` → `/journal/` button link.

## Git workflow — separate branch + PR

All changes land via a feature branch and pull request, never directly on `source`:

1. Before branching, check `git status` — other agents may be working in the repo. If the working tree is dirty with unrelated changes, use an isolated worktree instead of branching in place: `git worktree add ../Simply007.github.io-seo feat/seo-aeo-geo` (branch created from `source`). Otherwise: `git checkout source && git pull && git checkout -b feat/seo-aeo-geo`.
2. Commit in logical units matching the implementation order (suggested): deps + converter/utils; onPostBuild + static-file builders; gatsby-config (siteMetadata + feed); layout.js per-page SEO; templates + RichText.js `/journal/` fix. Husky pre-commit runs `npm run format` automatically.
3. Push the branch and open a PR against `source` (the default branch) with `gh pr create`, summarizing: what's generated (robots.txt, llms.txt, llms-full.txt, rss.xml), the meta/JSON-LD changes, and the RichText.js bug fix. Include verification evidence (snippets of generated files, validator results) in the PR description.
4. CI: `.github/workflows/build-and-publish.yml` triggers on PRs, so the PR run validates the full `gatsby build` (including onPostBuild and the feed) with the Kontent secrets before merge. Deployment to `master`/GitHub Pages only happens after merge to `source`.
5. After merge: delete the branch (and remove the worktree if one was used: `git worktree remove ../Simply007.github.io-seo`).

## Implementation order

1. `npm install turndown gatsby-plugin-feed`
2. `src/utils/seo.js` + `lib/rich-text-to-markdown.js`; **converter smoke test** against existing page-data JSON
3. `lib/static-seo-files.js` + `onPostBuild` in gatsby-node.js
4. gatsby-config.js (siteMetadata + feed)
5. layout.js
6. Templates + RichText.js fix
7. `npm run format`, then `npm run build`

## Verification

- `npm run build` succeeds (local `.env` has Kontent access).
- `public/robots.txt` — expected content; Sitemap line matches `/sitemap-index.xml`.
- `public/llms.txt` — H1/blockquote/3 sections; URLs (trailing slash) spot-checked against `public/sitemap-0.xml`.
- `public/llms-full.txt` — check the CKEditor paragraph-plugin post: fenced ```javascript blocks, image markdown, no `<object>`/`&nbsp;` remnants.
- `public/rss.xml` — journal items with `/journal/{slug}/` links and dates.
- View source `public/journal/<any>/index.html` — canonical link (trailing slash), rss alternate link, `<title>{post} | {site}</title>`, `og:type=article`, `og:url`==canonical, 3 JSON-LD scripts (WebSite, Person, BlogPosting) → validate at validator.schema.org.
- View source `public/index.html` — default title, canonical `https://ondrej.chrastina.dev/`, WebSite+Person JSON-LD.
- `gatsby develop` renders pages normally (feed/onPostBuild only run on `build` — expected).
- Post-deploy: `curl` the four new URLs; W3C feed validator; Search Console URL inspection on one post.

## Risks

- Rich-text format drift → format verified against real built data; converter degrades to `''` on unknowns; smoke test runs before any wiring.
- gatsby-plugin-feed requires `siteMetadata.title/description` → added in step 4.
- gatsby-plugin-offline → no change needed; .txt/.xml aren't precached and bots don't run the SW.
- Trailing-slash mismatch between generated URLs and sitemap → explicit checklist item.
- Repo may drift while other agents work on it concurrently — re-check `layout.js`, `gatsby-config.js`, `gatsby-node.js`, and the templates against this plan before implementing.
