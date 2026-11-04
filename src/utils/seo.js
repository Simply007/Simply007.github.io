// CJS so gatsby-config.js and gatsby-node.js can require it too
const { sectionPath } = require('./paths')
const SITE_URL = 'https://ondrej.chrastina.dev'
const AUTHOR_NAME = 'Ondřej Chrastina'

// Stable JSON-LD node ids — every author/publisher reference points at these
const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

const sameAsKey = (url) => url.trim().toLowerCase().replace(/\/+$/, '')

// Kontent social_media_account -> profile URL (account_pattern with %s = handle)
const socialAccountUrl = (account) =>
  account.elements.social_media_type.value[0].elements.account_pattern.value.replace(
    '%s',
    account.elements.account_handle.value
  )

/**
 * Person sameAs: the footer social accounts, in footer order, deduped
 * case-insensitively and ignoring trailing slashes
 * @param {Array<Object>} accounts Kontent social_media_account items
 * @returns {Array<String>}
 */
const buildSameAs = (accounts = []) => {
  const seen = new Set()
  return accounts.map(socialAccountUrl).filter((url) => {
    if (!url) return false
    const key = sameAsKey(url)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Person group of the Kontent Layout type; the build fails without these
const REQUIRED_PERSON_ELEMENTS = [
  'person_name',
  'person_job_title',
  'person_description',
  'person_photo',
  'person_affiliation',
]

const isEmpty = (element) =>
  !element ||
  element.value === null ||
  element.value === undefined ||
  (typeof element.value === 'string' && element.value.trim() === '') ||
  (Array.isArray(element.value) && element.value.length === 0)

/**
 * Person JSON-LD built only from Kontent: the Person group of the layout item
 * and the footer social accounts. Throws when a required field is empty, so a
 * missing CMS value fails the build instead of shipping a code fallback.
 * @param {Object} layout default_layout elements
 * @param {Array<Object>} accounts footer social_media_account items
 * @param {String} siteUrl
 * @returns {Object}
 */
const buildPerson = (layout = {}, accounts = [], siteUrl = SITE_URL) => {
  const missing = REQUIRED_PERSON_ELEMENTS.filter((codename) =>
    isEmpty(layout[codename])
  )
  if (missing.length) {
    throw new Error(
      `Kontent default_layout is missing Person fields: ${missing.join(', ')}`
    )
  }
  const affiliation = layout.person_affiliation.value[0].elements
  const locality = isEmpty(layout.person_address_locality)
    ? undefined
    : layout.person_address_locality.value
  const country = isEmpty(layout.person_address_country)
    ? undefined
    : layout.person_address_country.value
  const knowsAbout = (
    (layout.person_knows_about && layout.person_knows_about.value) ||
    []
  ).map((keyword) => keyword.elements.keyword.value)
  const sameAs = buildSameAs(accounts)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: layout.person_name.value,
    url: `${siteUrl}/`,
    image: layout.person_photo.value[0].url,
    jobTitle: layout.person_job_title.value,
    description: layout.person_description.value,
    // contractor engagement, not employment: affiliation, not worksFor
    affiliation: {
      '@type': 'Organization',
      name: affiliation.text.value,
      ...(affiliation.url.value ? { url: affiliation.url.value } : {}),
    },
    ...(locality || country
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(locality ? { addressLocality: locality } : {}),
            ...(country ? { addressCountry: country } : {}),
          },
        }
      : {}),
    ...(knowsAbout.length ? { knowsAbout } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

const PAGE_DESCRIPTIONS = {
  '/': 'Ondřej Chrastina, Developer Advocate for CKEditor. Talks, demos, and articles on rich text editing, AI coding agents, and developer experience.',
  [sectionPath('gotcha')]:
    'Articles by Ondřej Chrastina on CKEditor 5, headless CMS, TypeScript, and developer tooling, with practical fixes and walkthroughs.',
  [sectionPath('project')]:
    'Demo projects and open-source code by Ondřej Chrastina: CKEditor AI showcases, conference workshop repos, and CMS starters.',
  [sectionPath('talk')]:
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
  socialAccountUrl,
  buildSameAs,
  buildPerson,
  PAGE_DESCRIPTIONS,
  pageDescription,
  normalizeText,
  stripHtml,
}
