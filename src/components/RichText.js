import React from 'react'
import { RichTextElement } from '@kentico/gatsby-kontent-components'
import CodeHighlighter from '../components/CodeHighlighter'
import Img from 'gatsby-image'

const RichText = ({ element }) => (
  <RichTextElement
    value={element.value}
    linkedItems={element.modular_content}
    resolveLinkedItem={linkedItem => {
      switch (linkedItem.__typename) {
        case 'kontent_item_code_snippet':
          const codeComponent = JSON.parse(linkedItem.elements.code.value)
          return (
            <CodeHighlighter
              language={codeComponent.language}
              code={codeComponent.code}
            />
          )
        case 'kontent_item_button':
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
    resolveImage={image => (
      <Img
        fluid={image.localFile.childImageSharp.fluid}
        style={{
          padding: '0',
          width: '80%',
          margin: '0 0 1em 2em',
          maxWidth: '600px',
        }}
        imgStyle={{
          width: '100%',
        }}
      />
    )}
  />
)

export default RichText
