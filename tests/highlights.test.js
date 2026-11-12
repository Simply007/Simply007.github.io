const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  parseItemTypes,
  pickItems,
  highlightLink,
  highlightsFrom,
} = require('../src/utils/highlights')

const BUILD = '2026-11-11T12:00:00.000Z'
const node = (slug, field, date) => ({
  system: { codename: slug },
  elements: { [field]: { value: date } },
})
const pools = {
  talk: [
    node('t-upcoming', 'release_date', '2027-01-20'),
    node('t1', 'release_date', '2026-11-10'),
    node('t2', 'release_date', '2026-10-21'),
    node('t3', 'release_date', '2026-09-29'),
  ],
  gotcha: [node('g1', 'post_date', '2026-11-01')],
}
const codenames = (items) => items.map((n) => n.system.codename)

test('parseItemTypes reads codenames from the type selector value', () => {
  assert.deepEqual(
    parseItemTypes('[{"id":"1","name":"Talk","codename":"talk"}]'),
    ['talk']
  )
  assert.deepEqual(parseItemTypes(''), [])
  assert.deepEqual(parseItemTypes('not json'), [])
})

test('pickItems takes the newest released items, up to the count', () => {
  assert.deepEqual(codenames(pickItems(pools, ['talk'], 2, BUILD)), [
    't1',
    't2',
  ])
})

test('pickItems merges several types by date', () => {
  assert.deepEqual(codenames(pickItems(pools, ['talk', 'gotcha'], 3, BUILD)), [
    't1',
    'g1',
    't2',
  ])
})

test('pickItems with an unknown type or a zero count is empty', () => {
  assert.deepEqual(pickItems(pools, ['video'], 3, BUILD), [])
  assert.deepEqual(pickItems(pools, ['talk'], 0, BUILD), [])
})

test('highlightLink needs both the label and the target', () => {
  const target = { value: [{ elements: { slug: { value: 'talks' } } }] }
  assert.deepEqual(
    highlightLink({
      link_label: { value: 'See all talks' },
      link_target: target,
    }),
    { label: 'See all talks', path: '/talks/' }
  )
  assert.equal(
    highlightLink({ link_label: { value: '  ' }, link_target: target }),
    null
  )
  assert.equal(
    highlightLink({
      link_label: { value: 'See all' },
      link_target: { value: [] },
    }),
    null
  )
})

test('highlightsFrom maps listing highlights and skips other linked types', () => {
  const sections = [
    {
      __typename: 'kontent_item_section',
      system: { codename: 's' },
      elements: {},
    },
    {
      __typename: 'kontent_item_listing_highlight',
      system: { codename: 'listing_highlight_i_speak' },
      elements: {
        title: { value: 'I speak' },
        summary: { value: 'Talks.' },
        image: { value: [{ url: 'https://a/x.jpg', description: 'Alt' }] },
        item_types: { value: '[{"codename":"talk"}]' },
        item_count: { value: 3 },
        link_label: { value: '' },
        link_target: { value: [] },
      },
    },
  ]
  const [h, ...rest] = highlightsFrom(sections, pools, BUILD)
  assert.equal(rest.length, 0)
  assert.equal(h.title, 'I speak')
  assert.equal(h.photoAlt, 'Alt')
  assert.deepEqual(codenames(h.items), ['t1', 't2', 't3'])
  assert.equal(h.link, null)
})

test('no linked sections gives no highlights', () => {
  assert.deepEqual(highlightsFrom(null, pools, BUILD), [])
})
