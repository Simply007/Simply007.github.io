const { test } = require('node:test')
const assert = require('node:assert/strict')
const { PAGE_TITLES, pageTitle } = require('../src/utils/seo')

test('home has its own full title', () => {
  assert.equal(
    pageTitle('/'),
    'Ondřej Chrastina | DevRel Expert and AI Enthusiast'
  )
  assert.equal(pageTitle(''), pageTitle('/'))
})

// #59 PRD: 60 characters or fewer (Copilot review on PR #69)
test('every title override is 60 characters or fewer', () => {
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    assert.ok([...title].length <= 60, `${path}: ${[...title].length} chars`)
  }
})

test('title overrides start with the name and have no em or en dashes', () => {
  for (const title of Object.values(PAGE_TITLES)) {
    assert.ok(title.startsWith('Ondřej Chrastina'))
    assert.doesNotMatch(title, /[–—]/)
  }
})

test('other pages fall back to the suffixed title', () => {
  assert.equal(pageTitle('/talks/'), undefined)
})
