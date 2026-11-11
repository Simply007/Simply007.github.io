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

**Every fix requires a test** that reproduces the bug (fails before the fix, passes after), in the same commit. Pure logic goes into helpers in `src/utils/` or `lib/`. Components can be rendered in tests with `tests/helpers/render-component.js` (esbuild transforms the JSX, `react-dom/server` renders it, Gatsby's `Link` is stubbed and throws without a destination); see `tests/listing-item.test.js`. Style regressions can be tested by compiling `main.scss` with `sass` (dev dependency), see `tests/styles.test.js`. Rules for blocks inside the page wrapper must outrank `#wrapper > * > * > .inner` (scope them under `#wrapper`).

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
- `src/utils/seo.js` - Site constants, author profile, page descriptions, full page title overrides (`PAGE_TITLES`, passed as `seo.fullTitle`, used without the " | <site title>" suffix), text normalization for meta tags
- `lib/` - Builders for `robots.txt`, `llms.txt`, `llms-full.txt` and the rich text to markdown export (run in `gatsby-node.js` `onPostBuild`)
- `src/components/ListingHighlights.js` - Listing highlights, the home page sections (Landing page type). Content: the Home page `sections` linked items of type **Listing highlight** in Kontent (title, summary, image, item types via the type selector custom element, item count, link label, link target). `src/utils/highlights.js` (`highlightsFrom`, tested) picks the newest items of the chosen types with `site.buildTime` as the cutoff (never the browser clock, that would break hydration), and drops the "See all" link when its label or target is empty. No highlights, nothing renders. Styles: `.listing-highlights` in `_tiles.scss`, accent by position (`listing-highlight-accent-1` to `-6`), stripe on the text side (tested in `tests/styles.test.js`). Showcase: `/style-guide/listing-highlights`
- `src/assets/scss/` - SCSS styling with custom 12-column CSS Grid implementation

### URL paths: one source of truth

`src/utils/paths.js` is the only place that knows the section URL segments (`/journal/`, `/projects/`, `/talks/`), keyed by Kontent type codename (`gotcha`, `project`, `talk`). Never hard-code these paths; use its helpers:

- `sectionPath(type)`: listing path, for example `/talks/`
- `pathFor(type, slug)`: detail path with a trailing slash, for example `/talks/<slug>/`
- `itemPath(node)`: detail path of a Kontent node (`system.type` or GraphQL `__typename`)
- `SECTIONS[type].heading`: display name (RSS categories, `llms.txt` headings)

It is used for page creation (`gatsby-node.js`), the sitemap and RSS (`gatsby-config.js`), `lib/`, rich text buttons, listing tiles, "Back to" buttons and the page description keys. Always link with the trailing slash: GitHub Pages answers `/talks/<slug>` with a 301. The listing pages' own URLs come from the Kontent navigation items and must match `SECTIONS`.

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
