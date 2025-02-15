import React from 'react'
import { ImageElement, RichTextElement } from '@kontent-ai/gatsby-components'
import CodeHighlighter from '../components/CodeHighlighter'

const RichText = ({ element }) => (
  <RichTextElement
    value={element.value}
    linkedItems={element.modular_content}
    resolveLinkedItem={(linkedItem) => {
      switch (linkedItem.system.type) {
        case 'code_snippet':
          const codeComponent = JSON.parse(linkedItem.elements.code.value)
          return (
            <CodeHighlighter
              language={codeComponent.language}
              code={codeComponent.code}
            />
          )
        case 'button':
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
        default:
          return <div>Component not supported</div>
      }
    }}
    images={element.images}
    resolveImage={(image) => {
      return <ImageElement image={image} />
    }}
  />
)

export default RichText
