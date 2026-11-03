const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  SECTIONS,
  typeOf,
  sectionPath,
  pathFor,
  itemPath,
} = require('../src/utils/paths')

const node = (__typename, slug) => ({
  __typename,
  elements: { url_slug: { value: slug } },
})

test('every section has a segment and a heading', () => {
  for (const section of Object.values(SECTIONS)) {
    assert.match(section.segment, /^[a-z-]+$/)
    assert.ok(section.heading)
  }
})

test('section paths per type', () => {
  assert.equal(sectionPath('gotcha'), '/journal/')
  assert.equal(sectionPath('project'), '/projects/')
  assert.equal(sectionPath('talk'), '/talks/')
  assert.equal(sectionPath('listing_page'), undefined)
})

test('pathFor builds a detail path with a trailing slash', () => {
  assert.equal(pathFor('talk', 'a-talk'), '/talks/a-talk/')
  assert.equal(pathFor('talk', ''), undefined)
  assert.equal(pathFor('unknown', 'x'), undefined)
})

test('typeOf reads system.type or the GraphQL __typename', () => {
  assert.equal(typeOf({ system: { type: 'project' } }), 'project')
  assert.equal(typeOf({ __typename: 'kontent_item_gotcha' }), 'gotcha')
  assert.equal(typeOf({ __typename: 'SitePage' }), undefined)
})

test('itemPath works from __typename and from system.type', () => {
  assert.equal(itemPath(node('kontent_item_talk', 'a-talk')), '/talks/a-talk/')
  assert.equal(
    itemPath(node('kontent_item_gotcha', 'a-post')),
    '/journal/a-post/'
  )
  assert.equal(
    itemPath({
      system: { type: 'project' },
      elements: { url_slug: { value: 'a-project' } },
    }),
    '/projects/a-project/'
  )
  assert.equal(itemPath(node('kontent_item_listing_page', 'x')), undefined)
  assert.equal(itemPath(node('kontent_item_talk', '')), undefined)
})
