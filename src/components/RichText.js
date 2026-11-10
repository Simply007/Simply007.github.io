import React from 'react'
import { RichTextElement } from '@kontent-ai/gatsby-components'
import CodeHighlighter from '../components/CodeHighlighter'
import RichTextImage from './RichTextImage'
import { itemPath } from '../utils/paths'

// Button to a project or journal post; plain text when the item has no
// detail page (empty url_slug), instead of a link without an href
const ContentItemButton = ({ item, iconCode, title }) => {
  const href = itemPath(item)
  return (
    <p>
      {href ? (
        <a href={href} className="button">
          <span className={`icon ${iconCode}`}>{title}</span>
        </a>
      ) : (
        title
      )}
    </p>
  )
}

const RichText = ({ element }) => (
  <RichTextElement
    value={element.value}
    linkedItems={element.modular_content}
    resolveLinkedItem={(linkedItem) => {
      switch (linkedItem.system.type) {
        case 'code_snippet': {
          const codeComponent = JSON.parse(linkedItem.elements.code.value)
          return (
            <CodeHighlighter
              language={codeComponent.language}
              code={codeComponent.code}
            />
          )
        }
        case 'button': {
          if (linkedItem.elements.external_url.value) {
            return (
              <p>
                <a
                  href={linkedItem.elements.external_url.value}
                  className="button"
                >
                  <span className={`icon ${linkedItem.elements.icon.value}`}>
                    {linkedItem.elements.title.value}
                  </span>
                </a>
              </p>
            )
            // link existing content item
          } else if (linkedItem.elements.link_to.value.length > 0) {
            const linkedContentItem = linkedItem.elements.link_to.value[0]
            const title =
              linkedItem.elements.title.value ||
              linkedContentItem.elements.title.value
            switch (linkedContentItem.__typename) {
              case 'kontent_item_navigation_item': {
                return (
                  <p>
                    <a
                      href={`/${linkedContentItem.elements.slug.value}`}
                      className="button"
                    >
                      <span
                        className={`icon ${linkedItem.elements.icon.value}`}
                      >
                        {title}
                      </span>
                    </a>
                  </p>
                )
              }
              case 'kontent_item_project': {
                const iconCode =
                  linkedItem.elements.icon.value || 'fa-project-diagram'
                return (
                  <ContentItemButton
                    item={linkedContentItem}
                    iconCode={iconCode}
                    title={title}
                  />
                )
              }
              case 'kontent_item_gotcha': {
                const iconCode = linkedItem.elements.icon.value || 'fa-blog'
                return (
                  <ContentItemButton
                    item={linkedContentItem}
                    iconCode={iconCode}
                    title={title}
                  />
                )
              }
              default: {
                return <div>Component not supported</div>
              }
            }
          }
          return <div>Component not supported</div>
        }
        default: {
          return <div>Component not supported</div>
        }
      }
    }}
    images={element.images}
    resolveImage={(image) => <RichTextImage image={image} />}
  />
)

export default RichText
