const { test } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const sass = require('sass')

// Compile the real stylesheet once, as gatsby-plugin-sass does
const css = sass.compile(
  path.resolve(__dirname, '../src/assets/scss/main.scss'),
  {
    style: 'expanded',
    silenceDeprecations: ['import', 'global-builtin'],
    logger: sass.Logger.silent,
  }
).css

// [ids, classes/attributes/pseudo-classes, elements]; enough for these selectors
const specificity = (selector) => {
  const s = selector.replace(/::?[a-z-]+(\([^)]*\))?/g, (m) =>
    m.startsWith('::') ? ' e' : ' .p'
  )
  return [
    (s.match(/#[\w-]+/g) || []).length,
    (s.match(/\.[\w-]+|\[[^\]]+\]/g) || []).length,
    (
      s
        .replace(/#[\w-]+|\.[\w-]+|\[[^\]]+\]/g, '')
        .match(/(^|[\s>+~])[a-z][\w-]*/gi) || []
    ).length,
  ]
}
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

// all selectors of rules that set padding, outside media queries
const paddingSelectors = () => {
  const out = []
  const top = css.replace(/@media[^{]+\{([^{}]*\{[^{}]*\})*[^{}]*\}/g, '')
  for (const [, selectors, body] of top.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (/(^|;|\s)padding\s*:/.test(body)) {
      out.push(...selectors.split(',').map((s) => s.trim()))
    }
  }
  return out
}

// Copilot review on PR #69: the home page block padding lost to the generic
// wrapper padding (`#wrapper > * > * > .inner`)
test('home page latest-items padding outranks the generic wrapper inner padding', () => {
  const selectors = paddingSelectors()
  const generic = selectors.find((s) => s === '#wrapper > * > * > .inner')
  assert.ok(generic, 'generic wrapper padding rule exists')
  const own = selectors.filter(
    (s) => s.includes('.latest-items') && /\.inner$/.test(s)
  )
  assert.ok(own.length > 0, 'latest-items sets its own .inner padding')
  for (const selector of own) {
    assert.ok(
      compare(specificity(selector), specificity(generic)) > 0,
      `${selector} must be more specific than ${generic}`
    )
  }
})
