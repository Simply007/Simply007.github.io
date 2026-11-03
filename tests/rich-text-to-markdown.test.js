const { test } = require('node:test')
const assert = require('node:assert/strict')
const { buttonTargetPath } = require('../lib/rich-text-to-markdown')

const contentItem = (__typename, slug) => ({
  __typename,
  elements: { title: { value: 'T' }, url_slug: { value: slug } },
})

test('project and journal targets link to their detail page', () => {
  assert.equal(
    buttonTargetPath(contentItem('kontent_item_project', 'demo')),
    '/projects/demo/'
  )
  assert.equal(
    buttonTargetPath(contentItem('kontent_item_gotcha', 'post')),
    '/journal/post/'
  )
})

test('a content item with an empty url_slug has no path and does not throw', () => {
  assert.equal(
    buttonTargetPath(contentItem('kontent_item_project', '')),
    undefined
  )
  assert.equal(
    buttonTargetPath(contentItem('kontent_item_gotcha', '')),
    undefined
  )
})

test('navigation items link to their slug', () => {
  assert.equal(
    buttonTargetPath({
      __typename: 'kontent_item_navigation_item',
      elements: { slug: { value: 'talks' } },
    }),
    '/talks/'
  )
  assert.equal(
    buttonTargetPath({
      __typename: 'kontent_item_navigation_item',
      elements: { slug: { value: '' } },
    }),
    undefined
  )
})
