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

/**
 * Pair every built page with a lastmod:
 * - item pages: the item's Kontent last_modified (as before)
 * - listing pages: newest of the listing item itself and the website items it lists
 * - other content pages (for example /pwa-series/): their own last_modified
 * - home: newest of everything above
 * @param {Object} args
 * @param {Array} args.pages - allSitePage nodes ({ path, pageContext })
 * @param {Array} args.items - gotcha/project/talk nodes with system.type
 * @param {Array} args.contentItems - allKontentItem nodes ({ system: { codename, last_modified } })
 */
const resolveSitemapPages = ({ pages, items, contentItems }) => {
  const lastmodByPath = {}
  const websiteItems = []
  for (const item of items) {
    const path = itemPath(item)
    if (!path) continue
    lastmodByPath[path] = item.system.last_modified
    if (isWebsite(item)) websiteItems.push(item)
  }
  const lastmodByCodename = {}
  for (const node of contentItems) {
    lastmodByCodename[node.system.codename] = node.system.last_modified
  }

  const resolved = pages.map((page) => {
    if (lastmodByPath[page.path]) {
      return { ...page, lastmod: lastmodByPath[page.path] }
    }
    const context = page.pageContext || {}
    const own = lastmodByCodename[context.codename]
    const listTypes = context.listTypes || []
    const listed = websiteItems
      .filter((item) => listTypes.includes(item.system.type))
      .map((item) => item.system.last_modified)
    return { ...page, lastmod: newest([own, ...listed]) }
  })

  const siteNewest = newest(resolved.map((page) => page.lastmod))
  return resolved.map((page) =>
    page.path === '/'
      ? { ...page, lastmod: newest([page.lastmod, siteNewest]) }
      : page
  )
}

module.exports = { newest, resolveSitemapPages }
