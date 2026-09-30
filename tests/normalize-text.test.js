const { test } = require('node:test')
const assert = require('node:assert/strict')
const { normalizeText, stripHtml } = require('../src/utils/seo')

test('unescapes literal \\" quotes', () => {
  assert.equal(
    normalizeText('\\"Extreme TypeScript\\"'),
    '"Extreme TypeScript"'
  )
})

test('removes space before punctuation', () => {
  assert.equal(
    normalizeText('CKEditor 5 , it’s great .'),
    'CKEditor 5, it’s great.'
  )
})

test('removes space after opening paren', () => {
  assert.equal(normalizeText('see ( this) here'), 'see (this) here')
})

test('preserves tokens that start with punctuation, like .NET', () => {
  assert.equal(
    normalizeText('Jamstack Apps in .NET utilizing Statiq'),
    'Jamstack Apps in .NET utilizing Statiq'
  )
})

test('collapses whitespace', () => {
  assert.equal(normalizeText('a   b \n c'), 'a b c')
})

test('stripHtml applies normalization to inline markup', () => {
  assert.equal(
    stripHtml('<p>When integrating <a href="#">CKEditor 5</a>, it’s tempting</p>'),
    'When integrating CKEditor 5, it’s tempting'
  )
})
