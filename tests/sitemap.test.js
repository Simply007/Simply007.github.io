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
  { path: '/', pageContext: { codename: 'home', listTypes: [] } },
  {
    path: '/talks/',
    pageContext: { codename: 'talks_page', listTypes: ['talk'] },
  },
  {
    path: '/journal/',
    pageContext: { codename: 'journal_page', listTypes: ['gotcha'] },
  },
  { path: '/pwa-series/', pageContext: { codename: 'pwa', listTypes: [] } },
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
  { system: { codename: 'home', last_modified: '2024-01-01T00:00:00.000Z' } },
  {
    system: {
      codename: 'talks_page',
      last_modified: '2025-01-01T00:00:00.000Z',
    },
  },
  {
    system: {
      codename: 'journal_page',
      last_modified: '2025-07-01T00:00:00.000Z',
    },
  },
  { system: { codename: 'pwa', last_modified: '2023-05-05T00:00:00.000Z' } },
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
