const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buildSameAs, socialAccountUrl } = require('../src/utils/seo')

const account = (handle, pattern) => ({
  elements: {
    account_handle: { value: handle },
    social_media_type: {
      value: [{ elements: { account_pattern: { value: pattern } } }],
    },
  },
})

test('maps a footer social account through its type pattern', () => {
  assert.equal(
    socialAccountUrl(account('simply007', 'https://www.drupal.org/u/%s')),
    'https://www.drupal.org/u/simply007'
  )
})

test('sameAs keeps the footer order', () => {
  assert.deepEqual(
    buildSameAs([
      account('Simply007', 'https://github.com/%s'),
      account('simply007-cz.bsky.social', 'https://bsky.app/profile/%s'),
    ]),
    [
      'https://github.com/Simply007',
      'https://bsky.app/profile/simply007-cz.bsky.social',
    ]
  )
})

test('dedupes case-insensitively and ignores trailing slashes', () => {
  assert.deepEqual(
    buildSameAs([
      account('simply007/', 'https://Dev.to/%s'),
      account('simply007', 'https://dev.to/%s'),
    ]),
    ['https://Dev.to/simply007/']
  )
})

test('drops accounts that resolve to an empty URL', () => {
  assert.deepEqual(buildSameAs([account('', '%s')]), [])
})

test('no accounts, no sameAs', () => {
  assert.deepEqual(buildSameAs(), [])
})
