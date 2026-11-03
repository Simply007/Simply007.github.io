const { test } = require('node:test')
const assert = require('node:assert/strict')
const { newest, resolveSitemapPages } = require('../src/utils/sitemap')

const item = (type, slug, lastModified, channels = ['website']) => ({
  system: { type, last_modified: lastModified },
  elements: {
    url_slug: { value: slug },
    channel_purpose: { value: channels.map((codename) => ({ codename })) },
  },
})

const pages = [
  {
    path: '/',
    pageContext: { codename: 'home', language: 'en-US', listTypes: [] },
  },
  {
    path: '/talks/',
    pageContext: {
      codename: 'talks_page',
      language: 'en-US',
      listTypes: ['talk'],
    },
  },
  {
    path: '/journal/',
    pageContext: {
      codename: 'journal_page',
      language: 'en-US',
      listTypes: ['gotcha'],
    },
  },
  {
    path: '/pwa-series/',
    pageContext: { codename: 'pwa', language: 'en-US', listTypes: [] },
  },
  { path: '/talks/a/', pageContext: { codename: 'talk_a' } },
  { path: '/talks/b/', pageContext: { codename: 'talk_b' } },
  { path: '/journal/c/', pageContext: { codename: 'gotcha_c' } },
]
const items = [
  item('talk', 'a', '2026-10-01T00:00:00.000Z'),
  item('talk', 'b', '2026-11-03T10:00:00.000Z'),
  item('talk', 'hidden', '2026-12-01T00:00:00.000Z', ['other']),
  item('gotcha', 'c', '2025-06-22T00:00:00.000Z'),
]
const contentItems = [
  {
    preferred_language: 'en-US',
    system: { codename: 'home', last_modified: '2024-01-01T00:00:00.000Z' },
  },
  {
    preferred_language: 'en-US',
    system: {
      codename: 'talks_page',
      last_modified: '2025-01-01T00:00:00.000Z',
    },
  },
  {
    preferred_language: 'en-US',
    system: {
      codename: 'journal_page',
      last_modified: '2025-07-01T00:00:00.000Z',
    },
  },
  {
    preferred_language: 'en-US',
    system: { codename: 'pwa', last_modified: '2023-05-05T00:00:00.000Z' },
  },
]
const byPath = Object.fromEntries(
  resolveSitemapPages({ pages, items, contentItems }).map((p) => [
    p.path,
    p.lastmod,
  ])
)

test('item pages keep their own last_modified', () => {
  assert.equal(byPath['/talks/a/'], '2026-10-01T00:00:00.000Z')
  assert.equal(byPath['/journal/c/'], '2025-06-22T00:00:00.000Z')
})

test('a listing gets the newest website item it lists', () => {
  assert.equal(byPath['/talks/'], '2026-11-03T10:00:00.000Z')
})

test('a listing keeps its own date when that is newer than its items', () => {
  assert.equal(byPath['/journal/'], '2025-07-01T00:00:00.000Z')
})

test('a plain content page uses its own last_modified', () => {
  assert.equal(byPath['/pwa-series/'], '2023-05-05T00:00:00.000Z')
})

test('home gets the newest date on the site, ignoring non-website items', () => {
  assert.equal(byPath['/'], '2026-11-03T10:00:00.000Z')
})

test('newest ignores empty values', () => {
  assert.equal(
    newest([undefined, '2020-01-01T00:00:00Z', null]),
    '2020-01-01T00:00:00Z'
  )
  assert.equal(newest([]), undefined)
})

// Regression tests for the Copilot review on PR #68

const run = (overrides) =>
  Object.fromEntries(
    resolveSitemapPages({ pages, items, contentItems, ...overrides }).map(
      (p) => [p.path, p.lastmod]
    )
  )

test('a website item without a slug still bumps its listing (the listing renders it)', () => {
  const byPath = run({
    items: [...items, item('talk', '', '2026-11-10T00:00:00.000Z')],
  })
  assert.equal(byPath['/talks/'], '2026-11-10T00:00:00.000Z')
  assert.equal(byPath['/'], '2026-11-10T00:00:00.000Z')
})

test('a non-website item sharing a slug does not override the published page', () => {
  const byPath = run({
    items: [...items, item('talk', 'a', '2027-01-01T00:00:00.000Z', ['other'])],
  })
  assert.equal(byPath['/talks/a/'], '2026-10-01T00:00:00.000Z')
  assert.equal(byPath['/'], '2026-11-03T10:00:00.000Z')
})

test('content pages use their own language variant', () => {
  const variant = (language, codename, lastModified) => ({
    preferred_language: language,
    system: { codename, last_modified: lastModified },
  })
  const byPath = Object.fromEntries(
    resolveSitemapPages({
      pages: [
        {
          path: '/pwa-series/',
          pageContext: {
            codename: 'pwa',
            language: 'en-US',
            language: 'en-US',
            listTypes: [],
          },
        },
        {
          path: '/cs/pwa-series/',
          pageContext: {
            codename: 'pwa',
            language: 'en-US',
            language: 'cs-CZ',
            listTypes: [],
          },
        },
      ],
      items: [],
      contentItems: [
        variant('en-US', 'pwa', '2023-05-05T00:00:00.000Z'),
        variant('cs-CZ', 'pwa', '2025-09-09T00:00:00.000Z'),
      ],
    }).map((p) => [p.path, p.lastmod])
  )
  assert.equal(byPath['/pwa-series/'], '2023-05-05T00:00:00.000Z')
  assert.equal(byPath['/cs/pwa-series/'], '2025-09-09T00:00:00.000Z')
})

test('a layout-only edit bumps the home page', () => {
  const byPath = run({
    contentItems: [
      ...contentItems,
      {
        preferred_language: 'en-US',
        system: {
          codename: 'default_layout',
          last_modified: '2026-12-24T00:00:00.000Z',
        },
      },
    ],
  })
  assert.equal(byPath['/'], '2026-12-24T00:00:00.000Z')
  assert.equal(byPath['/talks/'], '2026-11-03T10:00:00.000Z')
})

// Copilot review on PR #68: language variants sharing a slug
test('a detail page uses the language variant it renders, not the newest one', () => {
  const variantItem = (language, lastModified) => ({
    preferred_language: language,
    system: {
      type: 'talk',
      codename: 'talk_shared',
      last_modified: lastModified,
    },
    elements: {
      url_slug: { value: 'shared' },
      channel_purpose: { value: [{ codename: 'website' }] },
    },
  })
  const byPath = Object.fromEntries(
    resolveSitemapPages({
      pages: [
        {
          path: '/talks/shared/',
          pageContext: { codename: 'talk_shared', language: 'en-US' },
        },
      ],
      items: [
        variantItem('en-US', '2026-01-01T00:00:00.000Z'),
        variantItem('cs-CZ', '2026-06-01T00:00:00.000Z'),
      ],
      contentItems: [],
    }).map((p) => [p.path, p.lastmod])
  )
  assert.equal(byPath['/talks/shared/'], '2026-01-01T00:00:00.000Z')
})
