const { test } = require('node:test')
const assert = require('node:assert/strict')
const { parseCategories, buildSearch } = require('../src/utils/category-filter')

test('parses an empty query string', () => {
  assert.deepEqual(parseCategories(''), new Set())
  assert.deepEqual(parseCategories(undefined), new Set())
})

test('parses comma separated categories', () => {
  assert.deepEqual(
    parseCategories('?categories=ai,ckeditor'),
    new Set(['ai', 'ckeditor'])
  )
})

test('parses encoded commas and ignores empty values', () => {
  assert.deepEqual(
    parseCategories('?categories=ai%2C%2Cjs_ts,'),
    new Set(['ai', 'js_ts'])
  )
})

test('builds a query string with readable commas', () => {
  assert.equal(
    buildSearch('', new Set(['ai', 'ckeditor'])),
    '?categories=ai,ckeditor'
  )
})

test('removes the param when nothing is selected', () => {
  assert.equal(buildSearch('?categories=ai', new Set()), '')
})

test('keeps unrelated params', () => {
  assert.equal(
    buildSearch('?utm_source=x&categories=ai', new Set(['devrel'])),
    '?utm_source=x&categories=devrel'
  )
  assert.equal(
    buildSearch('?utm_source=x&categories=ai', new Set()),
    '?utm_source=x'
  )
})

test('round trips', () => {
  const selected = new Set(['_net', 'next_js'])
  assert.deepEqual(parseCategories(buildSearch('', selected)), selected)
})
