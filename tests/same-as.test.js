const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buildSameAs, EXTRA_SAME_AS } = require('../src/utils/seo')

test('appends the extra profiles after the footer accounts', () => {
  const result = buildSameAs(['https://github.com/Simply007'])
  assert.equal(result[0], 'https://github.com/Simply007')
  assert.deepEqual(result.slice(1), EXTRA_SAME_AS)
})

test('dedupes case-insensitively and ignores trailing slashes', () => {
  assert.deepEqual(
    buildSameAs(
      ['https://Dev.to/simply007/', 'https://dev.to/simply007'],
      ['https://dev.to/Simply007']
    ),
    ['https://Dev.to/simply007/']
  )
})

test('drops empty values', () => {
  assert.deepEqual(buildSameAs(['', null, 'https://a.example'], []), [
    'https://a.example',
  ])
})

test('extra profiles include Bluesky, HackerNoon, X and the CKEditor author page', () => {
  const joined = EXTRA_SAME_AS.join(' ')
  for (const host of ['bsky.app', 'hackernoon.com', 'x.com', 'ckeditor.com']) {
    assert.ok(joined.includes(host), host)
  }
})
