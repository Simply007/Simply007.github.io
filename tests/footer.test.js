const { test } = require('node:test')
const assert = require('node:assert/strict')
const { loadComponent, render } = require('./helpers/render-component')

const Footer = loadComponent('src/components/Footer.js')

const account = (handle, type) => ({
  elements: {
    account_handle: { value: handle },
    social_media_type: { value: [{ elements: type }] },
  },
})

const footer = (accounts) => ({
  data: {
    elements: {
      footer_text: { value: '<p>© Ondřej Chrastina 2020</p>' },
      social_media_accounts: { value: accounts },
    },
  },
})

test('a social media type with a Font Awesome code renders the glyph icon', () => {
  const html = render(
    Footer,
    footer([
      account('Simply007', {
        label: { value: 'GitHub' },
        account_pattern: { value: 'https://github.com/%s' },
        account_icon_code: { value: 'fa-github' },
        account_icon: { value: [] },
      }),
    ])
  )
  assert.match(
    html,
    /href="https:\/\/github.com\/Simply007" class="icon alt fa-github"/
  )
  assert.doesNotMatch(html, /--icon-url/)
})

test('a social media type without a Font Awesome code renders its Account Icon asset', () => {
  const html = render(
    Footer,
    footer([
      account('simply007-cz.bsky.social', {
        label: { value: 'Bluesky' },
        account_pattern: { value: 'https://bsky.app/profile/%s' },
        account_icon_code: { value: '' },
        account_icon: {
          value: [{ url: 'https://assets.example/bluesky.png' }],
        },
      }),
    ])
  )
  assert.match(html, /class="icon alt icon-asset"/)
  assert.match(
    html,
    /style="--icon-url:url\(&quot;https:\/\/assets.example\/bluesky.png&quot;\)"/
  )
  assert.match(html, /aria-label="Bluesky"/)
})
