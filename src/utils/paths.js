// Single source of truth for where content items live on the site.
// CJS so gatsby-node.js, gatsby-config.js, lib/ and the node test runner can require it.
// Keyed by Kontent.ai content type codename.
const SECTIONS = {
  gotcha: { segment: 'journal', heading: 'Journal' },
  project: { segment: 'projects', heading: 'Projects' },
  talk: { segment: 'talks', heading: 'Talks' },
}

const TYPENAME_PREFIX = 'kontent_item_'

/**
 * Kontent type codename of a node: from system.type, or from the GraphQL
 * __typename (kontent_item_talk becomes talk)
 */
const typeOf = (node) =>
  (node.system && node.system.type) ||
  (node.__typename && node.__typename.startsWith(TYPENAME_PREFIX)
    ? node.__typename.slice(TYPENAME_PREFIX.length)
    : undefined)

/**
 * Listing path of a content type, for example /talks/
 * @param {String} type - Kontent type codename (gotcha, project, talk)
 * @returns {String|undefined}
 */
const sectionPath = (type) =>
  SECTIONS[type] ? `/${SECTIONS[type].segment}/` : undefined

/**
 * Detail page path for a type and slug, with the trailing slash GitHub Pages
 * serves (a path without it costs a 301 redirect)
 * @returns {String|undefined}
 */
const pathFor = (type, slug) =>
  sectionPath(type) && slug ? `${sectionPath(type)}${slug}/` : undefined

/**
 * Detail page path of a Kontent node (needs elements.url_slug and either
 * system.type or __typename)
 * @returns {String|undefined}
 */
const itemPath = (node) =>
  pathFor(typeOf(node), node.elements && node.elements.url_slug.value)

module.exports = { SECTIONS, typeOf, sectionPath, pathFor, itemPath }
