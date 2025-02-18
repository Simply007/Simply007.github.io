import React from 'react'
import { ImageElement, RichTextElement } from '@kontent-ai/gatsby-components'
import CodeHighlighter from '../components/CodeHighlighter'

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
            debugger;
            const linkedContentItem = linkedItem.elements.link_to.value[0]
            const title = linkedItem.elements.title.value || linkedContentItem.elements.title.value;
            switch (linkedContentItem.__typename) {
              case 'kontent_item_navigation_item': {
                return (
                  <p>
                    <a
                      href={`/${linkedContentItem.elements.slug.value}`}
                      className="button"
                    >
                      <span className={`icon ${linkedItem.elements.icon.value}`}>
                        {title}
                      </span>
                    </a>
                  </p>
                )
              }
              case 'kontent_item_project': {
                const iconCode = linkedItem.elements.icon.value || 'fa-project-diagram';
                return (
                  <p>
                    <a
                      href={`/projects/${linkedContentItem.elements.url_slug.value}`}
                      className="button"
                    >
                      <span className={`icon ${iconCode}`}>
                        {title}
                      </span>
                    </a>
                  </p>
                )
              }
              case 'kontent_item_gotcha': {
                const iconCode = linkedItem.elements.icon.value || 'fa-blog';
                return (
                  <p>
                    <a
                      href={`/gotchas/${linkedContentItem.elements.url_slug.value}`}
                      className="button"
                    >
                      <span className={`icon ${iconCode}`}>
                        {title}
                      </span>
                    </a>
                  </p>
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
    resolveImage={(image) => {
      return <ImageElement image={image} />
    }}
  />
)

export default RichText
