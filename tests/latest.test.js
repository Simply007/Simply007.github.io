const { test } = require('node:test')
const assert = require('node:assert/strict')
const { latestReleased } = require('../src/utils/latest')

const talk = (slug, date) => ({ slug, date })
const getDate = (node) => node.date
const BUILD = '2026-11-03T20:00:00.000Z'

test('skips upcoming talks and still returns three past ones', () => {
  // more than three upcoming talks ahead of the past ones (Copilot review on PR #69)
  const nodes = [
    talk('u1', '2027-03-01'),
    talk('u2', '2027-02-01'),
    talk('u3', '2027-01-01'),
    talk('u4', '2026-12-01'),
    talk('p1', '2026-10-21'),
    talk('p2', '2026-09-29'),
    talk('p3', '2026-09-17'),
    talk('p4', '2026-05-01'),
  ]
  assert.deepEqual(
    latestReleased(nodes, getDate, BUILD, 3).map((n) => n.slug),
    ['p1', 'p2', 'p3']
  )
})

test('uses the given cutoff, not the current clock', () => {
  // a talk dated after the build stays out even once that date has passed
  const nodes = [talk('later', '2026-11-04'), talk('past', '2026-11-01')]
  assert.deepEqual(
    latestReleased(nodes, getDate, BUILD, 3).map((n) => n.slug),
    ['past']
  )
  assert.deepEqual(
    latestReleased(nodes, getDate, '2026-11-05T00:00:00.000Z', 3).map(
      (n) => n.slug
    ),
    ['later', 'past']
  )
})

test('a talk released exactly at the cutoff counts', () => {
  assert.equal(latestReleased([talk('t', BUILD)], getDate, BUILD, 3).length, 1)
})

test('items without a date are kept', () => {
  assert.equal(latestReleased([talk('n', '')], getDate, BUILD, 3).length, 1)
})
