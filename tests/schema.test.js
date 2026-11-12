const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createSchemaCustomization } = require('../gatsby-node')

// Netlify deploy preview on PR #69 failed: with a stale build cache the Kontent
// source plugin did not know the new listing_highlight type, so the home page
// query (`... on kontent_item_listing_highlight`) did not compile
test('the listing highlight type is declared independently of the plugin cache', async () => {
  const created = []
  await createSchemaCustomization({
    actions: { createTypes: (def) => created.push(def) },
    schema: { buildObjectType: (config) => config },
  })
  const sdl = created.filter((def) => typeof def === 'string').join('\n')
  assert.match(
    sdl,
    /type kontent_item_listing_highlight implements Node & kontent_item/
  )
  for (const field of [
    'title',
    'summary',
    'image',
    'item_types',
    'item_count',
    'link_label',
    'link_target',
  ]) {
    assert.match(
      sdl,
      new RegExp(`\\b${field}: kontent_item_\\w+_element_value`)
    )
  }
})
