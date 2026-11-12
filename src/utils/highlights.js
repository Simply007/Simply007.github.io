// CJS so the node test runner can require it
const { latestReleased } = require('./latest')

const HIGHLIGHT_TYPENAME = 'kontent_item_listing_highlight'

/**
 * Content type codenames picked in the type selector custom element. Its value
 * is a JSON string like `[{"id":"…","name":"Talk","codename":"talk"}]`.
 * @param {String} value
 * @returns {String[]}
 */
const parseItemTypes = (value) => {
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed)
      ? parsed.map((type) => type && type.codename).filter(Boolean)
      : []
  } catch (e) {
    return []
  }
}

const itemDate = (node) =>
  (node.elements.release_date || node.elements.post_date || {}).value

/**
 * The newest released items of the given types, merged across types.
 * @param {Object} pools - content type codename => Kontent nodes
 * @param {String[]} codenames
 * @param {Number} count
 * @param {String|Date} cutoff - build time (see latest.js)
 * @returns {Array}
 */
const pickItems = (pools, codenames, count, cutoff) => {
  const nodes = codenames
    .flatMap((codename) => pools[codename] || [])
    .sort((a, b) => new Date(itemDate(b) || 0) - new Date(itemDate(a) || 0))
  return latestReleased(nodes, itemDate, cutoff, count > 0 ? count : 0)
}

/**
 * The "See all" link, or null when the label or the target is missing.
 * @param {Object} elements - listing highlight elements
 * @returns {{ label: String, path: String } | null}
 */
const highlightLink = (elements) => {
  const label = ((elements.link_label || {}).value || '').trim()
  const target = ((elements.link_target || {}).value || [])[0]
  const slug = target && target.elements && target.elements.slug.value
  return label && slug
    ? { label, path: `/${slug.replace(/^\/|\/$/g, '')}/` }
    : null
}

/**
 * Props for <ListingHighlights> from the home page `sections` linked items.
 * Items of other types (for example Section) are skipped.
 * @param {Array} sections - linked items of the home page
 * @param {Object} pools - content type codename => Kontent nodes
 * @param {String|Date} cutoff - build time
 * @returns {Array}
 */
const highlightsFrom = (sections, pools, cutoff) =>
  (sections || [])
    .filter((node) => node && node.__typename === HIGHLIGHT_TYPENAME)
    .map((node) => {
      const { elements } = node
      const image = (elements.image.value || [])[0] || {}
      return {
        key: node.system.codename,
        title: elements.title.value,
        summary: elements.summary.value,
        photo: image.url,
        photoAlt: image.description || '',
        items: pickItems(
          pools,
          parseItemTypes(elements.item_types.value),
          Number(elements.item_count.value) || 0,
          cutoff
        ),
        link: highlightLink(elements),
      }
    })

module.exports = { parseItemTypes, pickItems, highlightLink, highlightsFrom }
