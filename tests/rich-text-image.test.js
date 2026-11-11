const { test } = require('node:test')
const assert = require('node:assert/strict')
const { loadComponent, render } = require('./helpers/render-component')

const RichTextImage = loadComponent('src/components/RichTextImage.js')

const image = {
  image_id: 'a',
  url: 'https://assets-eu-01.kc-usercontent.com/project/asset/screenshot.jpg',
  width: 1280,
  height: 720,
  description: 'A screenshot',
}

// A rich text image followed by a heading rendered with no space between them:
// the bare gatsby-image-wrapper has no margin, unlike paragraphs
test('a rich text image renders inside a spaced figure', () => {
  const html = render(RichTextImage, { image })
  assert.match(html, /^<figure class="rich-text-image">/)
  assert.match(html, /gatsby-image-wrapper/)
  assert.match(html, /<\/figure>$/)
})
