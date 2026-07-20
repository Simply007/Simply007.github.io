// Builders for robots.txt, llms.txt, and llms-full.txt written by
// gatsby-node.js onPostBuild.
const { SITE_URL, stripHtml } = require('../src/utils/seo')
const { richTextToMarkdown } = require('./rich-text-to-markdown')

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
]

const buildRobotsTxt = () =>
  [
    `# ${SITE_URL}`,
    '# All crawlers welcome — humans, search engines, and AI/LLM bots alike.',
    `# Machine-readable site summary: ${SITE_URL}/llms.txt`,
    `# Full content in markdown:      ${SITE_URL}/llms-full.txt`,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers, explicitly welcome',
    ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    '',
  ].join('\n')

const SECTIONS = [
  { key: 'journal', heading: 'Journal', pathPrefix: '/journal/' },
  { key: 'projects', heading: 'Projects', pathPrefix: '/projects/' },
  { key: 'talks', heading: 'Talks', pathPrefix: '/talks/' },
]

const itemUrl = (section, item) =>
  `${SITE_URL}${section.pathPrefix}${item.elements.url_slug.value}/`

const firstLine = (text) => text.split('\n')[0].trim()

const buildLlmsTxt = ({ siteTitle, siteDescription, ...itemsBySection }) => {
  const lines = [
    `# ${siteTitle}`,
    '',
    `> ${stripHtml(siteDescription)}`,
    '',
    `Full article content in markdown: ${SITE_URL}/llms-full.txt`,
    '',
  ]
  SECTIONS.forEach((section) => {
    const items = itemsBySection[section.key] || []
    if (items.length === 0) {
      return
    }
    lines.push(`## ${section.heading}`, '')
    items.forEach((item) => {
      const summary = firstLine(stripHtml(item.elements.summary.value))
      lines.push(
        `- [${item.elements.title.value}](${itemUrl(section, item)}): ${summary}`
      )
    })
    lines.push('')
  })
  lines.push(
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap-index.xml)`,
    `- [RSS feed](${SITE_URL}/rss.xml)`,
    ''
  )
  return lines.join('\n')
}

const itemDate = (item) =>
  (
    (item.elements.post_date || item.elements.release_date || {}).value || ''
  ).slice(0, 10)

const EXTRA_LINKS = [
  ['live_url', 'Live'],
  ['source_code_url', 'Source code'],
  ['slides_url', 'Slides'],
  ['recording_url', 'Recording'],
]

const buildItemMarkdown = (section, item) => {
  const lines = [
    `# ${item.elements.title.value}`,
    '',
    `- URL: ${itemUrl(section, item)}`,
    `- Published: ${itemDate(item)}`,
    `- Section: ${section.heading}`,
  ]
  EXTRA_LINKS.forEach(([key, label]) => {
    const element = item.elements[key]
    if (element && element.value) {
      lines.push(`- ${label}: ${element.value}`)
    }
  })
  lines.push('', stripHtml(item.elements.summary.value))
  const body = richTextToMarkdown(item.elements.content)
  if (body) {
    lines.push('', body)
  }
  return lines.join('\n')
}

const buildLlmsFullTxt = ({ siteTitle, siteDescription, ...itemsBySection }) => {
  const documents = [
    `# ${siteTitle}\n\n> ${stripHtml(siteDescription)}`,
  ]
  SECTIONS.forEach((section) => {
    const items = itemsBySection[section.key] || []
    items.forEach((item) => {
      documents.push(buildItemMarkdown(section, item))
    })
  })
  return documents.join('\n\n---\n\n') + '\n'
}

module.exports = { buildRobotsTxt, buildLlmsTxt, buildLlmsFullTxt }
