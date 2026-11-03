// CJS so the node test runner and gatsby-config.js can require it
const SECTION_BY_TYPE = {
  kontent_item_gotcha: 'journal',
  kontent_item_project: 'projects',
  kontent_item_talk: 'talks',
}

/**
 * Absolute path of a listing item's detail page, with the trailing slash
 * GitHub Pages serves (a path without it costs a 301 redirect)
 * @param {Object} item - Kontent node with __typename and elements.url_slug
 * @returns {String|undefined}
 */
const itemPath = (item) => {
  const section = SECTION_BY_TYPE[item.__typename]
  const slug = item.elements.url_slug.value
  return section && slug ? `/${section}/${slug}/` : undefined
}

module.exports = { SECTION_BY_TYPE, itemPath }
