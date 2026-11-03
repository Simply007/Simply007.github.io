// Converts Kontent.ai rich text elements to markdown for llms-full.txt.
// Node-only (used from gatsby-node.js onPostBuild), hence lib/ not src/.
const TurndownService = require('turndown')
const { SITE_URL } = require('../src/utils/seo')
const { itemPath } = require('../src/utils/paths')

const linkedItemToMarkdown = (item) => {
  switch (item.system.type) {
    case 'code_snippet': {
      try {
        const { language, code } = JSON.parse(item.elements.code.value)
        return '\n\n```' + (language || '') + '\n' + code + '\n```\n\n'
      } catch (e) {
        return ''
      }
    }
    case 'button': {
      const title = item.elements.title.value
      if (item.elements.external_url.value) {
        return `\n\n[${title}](${item.elements.external_url.value})\n\n`
      }
      const target = item.elements.link_to.value[0]
      if (!target) {
        return ''
      }
      const label = title || target.elements.title.value
      const path = buttonTargetPath(target)
      // no detail page to link to (for example an empty url_slug): keep the label as text
      return path
        ? `\n\n[${label}](${SITE_URL}${path})\n\n`
        : `\n\n${label}\n\n`
    }
    default:
      return ''
  }
}

// Content items (project, journal) link to their detail page, navigation items
// to their slug. undefined when the target has no usable path.
const buttonTargetPath = (target) => {
  if (target.elements.url_slug) {
    return itemPath(target)
  }
  if (target.elements.slug && target.elements.slug.value) {
    return `/${target.elements.slug.value}/`
  }
  return undefined
}

const richTextToMarkdown = (contentElement) => {
  if (!contentElement || !contentElement.value) {
    return ''
  }
  const linkedItems = new Map(
    (contentElement.modular_content || []).map((item) => [
      item.system.codename,
      item,
    ])
  )
  const isKontentObject = (node) =>
    node.nodeName === 'OBJECT' &&
    node.getAttribute('type') === 'application/kenticocloud'
  const resolveKontentObject = (node) => {
    const item = linkedItems.get(node.getAttribute('data-codename'))
    return item ? linkedItemToMarkdown(item) : ''
  }
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    // Kontent object placeholders are empty elements, so turndown routes
    // them here instead of through rules
    blankReplacement: (content, node) =>
      isKontentObject(node)
        ? resolveKontentObject(node)
        : node.isBlock
          ? '\n\n'
          : '',
  })
  turndownService.addRule('kontentObject', {
    filter: isKontentObject,
    replacement: (content, node) => resolveKontentObject(node),
  })
  return turndownService.turndown(contentElement.value).trim()
}

module.exports = { richTextToMarkdown, buttonTargetPath }
