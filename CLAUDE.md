# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog website built with Gatsby 5 (React-based static site generator). Content is managed via Kontent.ai headless CMS and fetched during build time via GraphQL.

## Commands

```bash
npm run develop    # Start Gatsby dev server with hot reload
npm run build      # Build production site (also copies CNAME to public/)
npm run clean      # Clear Gatsby cache
npm run format     # Run Prettier on all .js files
npm test           # Unit tests (node:test, tests/**/*.test.js), no build needed
```

Husky pre-commit hook automatically runs `npm run format`. Tests cover the pure helpers in `src/utils/` and `lib/`; CI (`.github/workflows/build-and-publish.yml`) runs `npm test` before the build, so a failing test blocks the deploy.

**Every fix requires a test** that reproduces the bug (fails before the fix, passes after), in the same commit. Pure logic goes into helpers in `src/utils/` or `lib/`. Components can be rendered in tests with `tests/helpers/render-component.js` (esbuild transforms the JSX, `react-dom/server` renders it, Gatsby's `Link` is stubbed and throws without a destination); see `tests/listing-item.test.js`.

## Environment Setup

Copy `.env.template` to `.env` and configure:
- `KONTENT_PROJECT_ID` - Kontent CMS project identifier (required)
- `KONTENT_LANGUAGE_CODENAMES` - Supported languages (required)
- `KONTENT_PREVIEW_ENABLED`, `KONTENT_PREVIEW_KEY`, `KONTENT_SECURED_KEY` - Preview/secured API access (optional)

## Architecture

### Content Flow
1. Content stored in Kontent.ai CMS
2. `@kontent-ai/gatsby-source` plugin fetches content via GraphQL at build time
3. `gatsby-node.js` generates dynamic pages based on navigation items from CMS
4. Three page types: Home Page, Sections Page, Listing Page (with detail views)

### Key Files
- `gatsby-config.js` - Plugin configuration, site metadata
- `gatsby-node.js` - Dynamic page generation, GraphQL schema customization
- `src/templates/` - Page templates (home.js, sections-page.js, listing-page.js, journal-item.js, project-item.js, talk-item.js)
- `src/components/layout.js` - Main layout wrapper (class component with sidebar menu state)
- `src/components/RichText.js` - Rich text rendering with code highlighting and custom element resolvers
- `src/components/RichTextImage.js` - Rich text images, wrapped in `<figure class="rich-text-image">` with a paragraph's bottom margin (Kontent's own figure markup is dropped by the renderer)
- `src/utils/paths.js` - Single source of truth for section URLs (see below)
- `src/utils/seo.js` - Site constants, page descriptions, text normalization for meta tags, and the Person JSON-LD builder (see below)
- `lib/` - Builders for `robots.txt`, `llms.txt`, `llms-full.txt` and the rich text to markdown export (run in `gatsby-node.js` `onPostBuild`)
- `src/assets/scss/` - SCSS styling with custom 12-column CSS Grid implementation

### URL paths: one source of truth

`src/utils/paths.js` is the only place that knows the section URL segments (`/journal/`, `/projects/`, `/talks/`), keyed by Kontent type codename (`gotcha`, `project`, `talk`). Never hard-code these paths; use its helpers:

- `sectionPath(type)`: listing path, for example `/talks/`
- `pathFor(type, slug)`: detail path with a trailing slash, for example `/talks/<slug>/`
- `itemPath(node)`: detail path of a Kontent node (`system.type` or GraphQL `__typename`)
- `SECTIONS[type].heading`: display name (RSS categories, `llms.txt` headings)

It is used for page creation (`gatsby-node.js`), the sitemap and RSS (`gatsby-config.js`), `lib/`, rich text buttons, listing tiles, "Back to" buttons and the page description keys. Always link with the trailing slash: GitHub Pages answers `/talks/<slug>` with a 301. The listing pages' own URLs come from the Kontent navigation items and must match `SECTIONS`.

### Person JSON-LD: CMS only

The Person node (`@id` `https://ondrej.chrastina.dev/#person`, on every page via `layout.js`) is built by `buildPerson()` in `src/utils/seo.js` from Kontent only, never from values in code:

- the **Person** content group of the Layout item `default_layout`: `person_name`, `person_job_title`, `person_description`, `person_photo`, `person_affiliation` (a `link` item: text = organization name, URL), `person_address_locality`, `person_address_country`, `person_knows_about` (`keyword` items)
- `sameAs` = the footer `social_media_accounts`, in footer order, deduped by `buildSameAs()`. A new profile is a new social media account in the footer.

The first five fields are required: `buildPerson()` throws and the build fails when one is empty. Optional fields are left out of the JSON-LD when empty. The WebSite node reuses `person_description`.

Footer icons: a social media type with an `account_icon_code` renders the Font Awesome 5 glyph. Without one (Bluesky, HackerNoon, the CKEditor blog), `Footer.js` renders its `account_icon` asset as the background of the icon circle (`.icon.icon-asset`, `--icon-url`). Upload those icons as PNG (the Kontent plan rejects SVG), drawn in the palette `bg` color `#242943` on a transparent background.

### Content Models (from Kontent.ai)
- Navigation Items (hierarchical, support external URLs)
- Home Page, Sections Page, Listing Page
- Journal Items (blog posts, type `gotcha`), Projects, Talks
- Code Snippets, Buttons, Social Media accounts

## Code Style

- Prettier configured: no semicolons, single quotes, ES5 trailing commas
- Functional components preferred; layout.js uses class component for state
- GraphQL queries inline in component files
- `lodash.get` used for safe property access in CMS data

## Deployment

GitHub Actions (`.github/workflows/build-and-publish.yml`) builds on push to `source` branch and deploys to `master` branch for GitHub Pages. Requires `KONTENT_PROJECT_ID` and `KONTENT_LANGUAGE_CODENAMES` secrets.

**After a Kontent content model change** (new type or element), clear the Netlify build cache: in Netlify, Deploys, "Clear cache and deploy site", then "Retry with latest branch commit" on the PR preview. `@kontent-ai/gatsby-source` caches the content types in the Gatsby cache (`loadAllKontentTypesCached`) and never refreshes them, so a cached Netlify build fails with `Cannot query field "<new element>"`. GitHub Actions starts without a cache, so the GitHub Pages build is not affected.
