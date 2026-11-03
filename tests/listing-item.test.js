const { test } = require('node:test')
const assert = require('node:assert/strict')
const { loadComponent, render } = require('./helpers/render-component')

const ListingItem = loadComponent('src/components/ListingItem.js')

const talk = (slug) => ({
  __typename: 'kontent_item_talk',
  system: { id: 'id-1', codename: 'talk_1' },
  elements: {
    title: { value: 'A talk' },
    url_slug: { value: slug },
    release_date: { value: '2026-10-21T00:00:00Z' },
    image: { value: [] },
    summary: { value: '<p>Summary</p>' },
  },
})

test('a tile links its title and Learn more to the absolute detail path', () => {
  const html = render(ListingItem, { item: talk('a-talk') })
  assert.match(html, /<a href="\/talks\/a-talk\/">A talk<\/a>/)
  assert.match(html, /href="\/talks\/a-talk\/"[^>]*>Learn more/)
})

// Copilot review on PR #66: a listed item without a slug passed an undefined
// destination to Gatsby's Link
test('a tile for an item without a slug renders, without links', () => {
  const html = render(ListingItem, { item: talk('') })
  assert.match(html, /A talk/)
  assert.doesNotMatch(html, /<a /)
  assert.doesNotMatch(html, /Learn more/)
})
