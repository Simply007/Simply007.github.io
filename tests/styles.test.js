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

// Listing highlights: the accent stripe sits on the text side. Odd positions
// show the photo on the left (stripe right), even ones are reversed (stripe
// left)
const rulesFor = (selector) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) =>
      selectors.split(',').some((s) => s.trim() === selector)
    )
    .map(([, , body]) => body)
    .join(';')

test('listing highlights keep the accent stripe on the text side', () => {
  assert.match(
    rulesFor('#wrapper .listing-highlights > section:nth-child(odd)'),
    /border-right-style: solid/
  )
  assert.match(
    rulesFor('#wrapper .listing-highlights > section:nth-child(even)'),
    /border-left-style: solid/
  )
})

test('every listing highlight position up to 6 has an accent', () => {
  for (let i = 1; i <= 6; i++) {
    assert.match(
      rulesFor(`#wrapper .listing-highlights > .listing-highlight-accent-${i}`),
      /border-color:/
    )
  }
})

test('the See all link in a listing highlight is underlined', () => {
  assert.match(
    rulesFor('#wrapper .listing-highlights .listing-highlight-see-all a'),
    /border-bottom: solid 1px currentColor/
  )
})
