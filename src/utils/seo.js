// CJS so gatsby-config.js and gatsby-node.js can require it too
const SITE_URL = 'https://ondrej.chrastina.dev'
const AUTHOR_NAME = 'Ondřej Chrastina'

const stripHtml = (html) =>
  (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

module.exports = { SITE_URL, AUTHOR_NAME, stripHtml }
