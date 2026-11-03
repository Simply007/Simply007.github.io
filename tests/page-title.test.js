const { test } = require('node:test')
const assert = require('node:assert/strict')
const { pageTitle } = require('../src/utils/seo')

test('home has its own full title', () => {
  const title = pageTitle('/')
  assert.ok(title.startsWith('Ondřej Chrastina'))
  assert.equal(pageTitle(''), title)
})

test('home title has no em or en dashes', () => {
  assert.doesNotMatch(pageTitle('/'), /[–—]/)
})

test('other pages fall back to the suffixed title', () => {
  assert.equal(pageTitle('/talks/'), undefined)
})
