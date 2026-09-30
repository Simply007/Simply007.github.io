// CJS so gatsby-config.js and gatsby-node.js can require it too
const SITE_URL = 'https://ondrej.chrastina.dev'
const AUTHOR_NAME = 'Ondřej Chrastina'

// Stable JSON-LD node ids — every author/publisher reference points at these
const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

const AUTHOR_PROFILE = {
  jobTitle: 'Developer Advocate',
  description:
    'Self-employed Developer Relations consultant, currently working mainly with CKEditor. Focused on rich text editing, AI coding agents, and content editing. Conference speaker based in Brno, Czech Republic.',
  imageUrl:
    'https://assets-eu-01.kc-usercontent.com/6aec6c2a-3010-01c9-8295-4d988333f15d/8eff9399-d66c-415f-a343-5c17cad17e63/website-icon.png',
  // contractor engagement, not employment — affiliation, not worksFor
  affiliation: {
    '@type': 'Organization',
    name: 'CKEditor',
    url: 'https://ckeditor.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Brno',
    addressCountry: 'CZ',
  },
  knowsAbout: [
    'CKEditor 5',
    'Developer Relations',
    'TypeScript',
    'AI coding agents',
    'Model Context Protocol',
    'Headless CMS',
    'Drupal',
  ],
}

const PAGE_DESCRIPTIONS = {
  '/': 'Ondřej Chrastina, Developer Advocate for CKEditor. Talks, demos, and articles on rich text editing, AI coding agents, and developer experience.',
  '/journal/':
    'Articles by Ondřej Chrastina on CKEditor 5, headless CMS, TypeScript, and developer tooling, with practical fixes and walkthroughs.',
  '/projects/':
    'Demo projects and open-source code by Ondřej Chrastina: CKEditor AI showcases, conference workshop repos, and CMS starters.',
  '/talks/':
    'Conference talks, webinars, and videos by Ondřej Chrastina on CKEditor, Drupal, TYPO3, AI coding agents, and TypeScript.',
  '/pwa-series/':
    'A series by Ondřej Chrastina on building Progressive Web Apps with Angular and a headless CMS, and keeping a perfect Lighthouse score.',
}

// pathname arrives with or without trailing slash depending on context
const pageDescription = (pathname) =>
  PAGE_DESCRIPTIONS[pathname] ||
  PAGE_DESCRIPTIONS[pathname.replace(/\/?$/, '/')]

// Cleans artifacts left by tag stripping and CMS text: literal \" escapes,
// stray spaces before punctuation / after opening parens, repeated whitespace
const normalizeText = (s = '') =>
  s
    .replace(/\\"/g, '"')
    // only when the punctuation ends a word — keeps tokens like ".NET" intact
    .replace(/\s+([.,!?;:)])(?=\s|$)/g, '$1')
    .replace(/([(])\s+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()

const stripHtml = (html) =>
  normalizeText(
    (html || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  )

module.exports = {
  SITE_URL,
  AUTHOR_NAME,
  PERSON_ID,
  WEBSITE_ID,
  AUTHOR_PROFILE,
  PAGE_DESCRIPTIONS,
  pageDescription,
  normalizeText,
  stripHtml,
}
