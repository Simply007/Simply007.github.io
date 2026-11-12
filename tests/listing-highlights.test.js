const { test } = require('node:test')
const assert = require('node:assert/strict')
const { loadComponent, render } = require('./helpers/render-component')

const ListingHighlights = loadComponent('src/components/ListingHighlights.js')

const talk = (slug, date) => ({
  __typename: 'kontent_item_talk',
  system: { codename: `talk_${slug}` },
  elements: {
    title: { value: `Talk ${slug}` },
    url_slug: { value: slug },
    release_date: { value: date },
    image: { value: [{ url: `https://assets.example/${slug}.jpg` }] },
  },
})

const highlight = {
  key: 'talks',
  title: 'I speak',
  summary: 'Talks and workshops.',
  photo: '/static/i-speak.jpg',
  photoAlt: 'Speaking',
  items: [
    talk('a', '2026-11-10'),
    talk('b', '2026-10-21'),
    talk('c', '2026-09-29'),
  ],
  link: { label: 'See all talks', path: '/talks/' },
}

test('a home section shows its title, the newest items and a See all link', () => {
  const html = render(ListingHighlights, { highlights: [highlight] })
  assert.match(html, /class="spotlights listing-highlight-accent-1"/)
  assert.match(html, /<h2>I speak<\/h2>/)
  assert.equal((html.match(/<li>/g) || []).length, 3)
  assert.match(html, /href="\/talks\/a\/">Talk a<\/a>/)
  assert.match(
    html,
    /https:\/\/assets\.example\/a\.jpg\?w=192&amp;h=120&amp;fit=crop/
  )
  assert.match(html, /href="\/talks\/"[^>]*>See all talks →<\/a>/)
})

test('the section title is plain text, not a link', () => {
  const html = render(ListingHighlights, { highlights: [highlight] })
  assert.doesNotMatch(html, /<h2><a/)
})

test('no link label or target: no See all link and a plain photo', () => {
  const html = render(ListingHighlights, {
    highlights: [{ ...highlight, link: null }],
  })
  assert.doesNotMatch(html, /See all/)
  assert.match(html, /<div class="image"><img/)
})

test('no highlights renders nothing', () => {
  assert.equal(render(ListingHighlights, { highlights: [] }), '')
  assert.equal(render(ListingHighlights, { highlights: undefined }), '')
})

test('the accent follows the position and cycles after 6', () => {
  const many = Array.from({ length: 7 }, (_, i) => ({
    ...highlight,
    key: `h${i}`,
  }))
  const html = render(ListingHighlights, { highlights: many })
  assert.match(html, /listing-highlight-accent-6/)
  assert.equal((html.match(/listing-highlight-accent-1"/g) || []).length, 2)
})
