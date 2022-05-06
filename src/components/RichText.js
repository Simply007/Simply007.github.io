import React from 'react'
import { RichTextElement } from '@kentico/gatsby-kontent-components'
import CodeHighlighter from '../components/CodeHighlighter'
import { ImageElement } from '@kentico/gatsby-kontent-components'

const RichText = ({ element }) => (
  <RichTextElement
    value={element.value}
    linkedItems={element.modular_content}
    resolveLinkedItem={linkedItem => {
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
    resolveImage={image => {
      return <ImageElement image={image} />
    }}
  />
)

export default RichText
