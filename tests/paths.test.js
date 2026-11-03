const { test } = require('node:test')
const assert = require('node:assert/strict')
const { itemPath } = require('../src/utils/paths')

const node = (__typename, slug) => ({
  __typename,
  elements: { url_slug: { value: slug } },
})

test('builds absolute paths with a trailing slash per type', () => {
  assert.equal(itemPath(node('kontent_item_talk', 'a-talk')), '/talks/a-talk/')
  assert.equal(
    itemPath(node('kontent_item_project', 'a-project')),
    '/projects/a-project/'
  )
  assert.equal(
    itemPath(node('kontent_item_gotcha', 'a-post')),
    '/journal/a-post/'
  )
})

test('returns undefined for unknown types or empty slugs', () => {
  assert.equal(itemPath(node('kontent_item_listing_page', 'x')), undefined)
  assert.equal(itemPath(node('kontent_item_talk', '')), undefined)
})
