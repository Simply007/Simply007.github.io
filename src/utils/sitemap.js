// CJS so gatsby-config.js (sitemap plugin) and the node test runner can require it
const { itemPath } = require('./paths')

const newest = (dates) =>
  dates
    .filter(Boolean)
    .reduce(
      (latest, date) =>
        !latest || new Date(date) > new Date(latest) ? date : latest,
      undefined
    )

const isWebsite = (item) =>
  !item.elements.channel_purpose ||
  item.elements.channel_purpose.value.some((c) => c.codename === 'website')

// Kontent items exist once per language variant with the same codename
const variantKey = (language, codename) => `${language || ''}:${codename}`

/**
 * Pair every built page with a lastmod:
 * - item pages: the item's Kontent last_modified
 * - listing pages: newest of the listing item itself and the website items it
 *   lists (including items without a slug, which the listing still renders)
 * - other content pages (for example /pwa-series/): their own last_modified
 * - home: newest of everything above and of the shared layout item
 * Only website-channel items count. Content items are matched by language and
 * codename, so each page uses its own language variant.
 * @param {Object} args
 * @param {Array} args.pages - allSitePage nodes ({ path, pageContext })
 * @param {Array} args.items - gotcha/project/talk nodes with system.type
 * @param {Array} args.contentItems - allKontentItem nodes ({ preferred_language, system: { codename, last_modified } })
 * @param {Object} [args.layout] - the layout item every page renders ({ codename, language })
 */
const resolveSitemapPages = ({
  pages,
  items,
  contentItems,
  layout = { codename: 'default_layout', language: 'en-US' },
}) => {
  const lastmodByPath = {}
  const websiteItems = []
  for (const item of items) {
    if (!isWebsite(item)) continue
    websiteItems.push(item)
    const path = itemPath(item)
    if (path) {
      lastmodByPath[path] = newest([
        lastmodByPath[path],
        item.system.last_modified,
      ])
    }
  }
  const lastmodByVariant = {}
  for (const node of contentItems) {
    lastmodByVariant[
      variantKey(node.preferred_language, node.system.codename)
    ] = node.system.last_modified
  }

  const resolved = pages.map((page) => {
    if (lastmodByPath[page.path]) {
      return { ...page, lastmod: lastmodByPath[page.path] }
    }
    const context = page.pageContext || {}
    const own = lastmodByVariant[variantKey(context.language, context.codename)]
    const listTypes = context.listTypes || []
    const listed = websiteItems
      .filter((item) => listTypes.includes(item.system.type))
      .map((item) => item.system.last_modified)
    return { ...page, lastmod: newest([own, ...listed]) }
  })

  const layoutLastmod =
    lastmodByVariant[variantKey(layout.language, layout.codename)]
  const siteNewest = newest([
    ...resolved.map((page) => page.lastmod),
    layoutLastmod,
  ])
  return resolved.map((page) =>
    page.path === '/' ? { ...page, lastmod: siteNewest } : page
  )
}

module.exports = { newest, resolveSitemapPages }
