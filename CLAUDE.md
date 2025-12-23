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
```

**Note:** No test suite is configured. Husky pre-commit hook automatically runs `npm run format`.

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
- `src/templates/` - Page templates (home.js, sections-page.js, listing-page.js, journal-item.js, project-item.js)
- `src/components/layout.js` - Main layout wrapper (class component with sidebar menu state)
- `src/components/RichText.js` - Rich text rendering with code highlighting and custom element resolvers
- `src/assets/scss/` - SCSS styling with custom 12-column CSS Grid implementation

### Content Models (from Kontent.ai)
- Navigation Items (hierarchical, support external URLs)
- Home Page, Sections Page, Listing Page
- Journal Items (blog posts), Projects
- Code Snippets, Buttons, Social Media accounts

## Code Style

- Prettier configured: no semicolons, single quotes, ES5 trailing commas
- Functional components preferred; layout.js uses class component for state
- GraphQL queries inline in component files
- `lodash.get` used for safe property access in CMS data

## Deployment

GitHub Actions (`.github/workflows/build-and-publish.yml`) builds on push to `source` branch and deploys to `master` branch for GitHub Pages. Requires `KONTENT_PROJECT_ID` and `KONTENT_LANGUAGE_CODENAMES` secrets.
