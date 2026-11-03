// Render a JSX component from src/ to static HTML inside node:test, without a
// build: esbuild transforms the file, react-dom/server renders it. Gatsby's
// Link needs the Gatsby runtime, so it is replaced by a plain anchor that
// fails loudly when it gets no destination (as the real Link would misbehave).
const fs = require('fs')
const path = require('path')
const Module = require('module')
const { transformSync } = require('esbuild')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

const gatsbyStub = {
  Link: ({ to, children, ...props }) => {
    if (typeof to !== 'string' || to === '') {
      throw new Error(`Link rendered without a destination (to=${to})`)
    }
    return React.createElement('a', { href: to, ...props }, children)
  },
  graphql: () => {},
}

const loadComponent = (relativePath) => {
  const file = path.resolve(__dirname, '..', '..', relativePath)
  const { code } = transformSync(fs.readFileSync(file, 'utf8'), {
    loader: 'jsx',
    format: 'cjs',
    jsx: 'transform',
  })
  const mod = new Module(file, module)
  mod.filename = file
  mod.paths = Module._nodeModulePaths(path.dirname(file))
  const requireOriginal = mod.require.bind(mod)
  mod.require = (id) => (id === 'gatsby' ? gatsbyStub : requireOriginal(id))
  mod._compile(code, file)
  return mod.exports.default || mod.exports
}

const render = (Component, props) =>
  renderToStaticMarkup(React.createElement(Component, props))

module.exports = { loadComponent, render }
