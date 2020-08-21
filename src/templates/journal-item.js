import React from 'react'
import { graphql } from 'gatsby'
import { RichTextElement } from '@kentico/gatsby-kontent-components'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import CodeHighlighter from '../components/CodeHighlighter'

const JournalItem = ({ data: { kontentItemGotcha } }) => (
  <Layout>
    <BannerLanding
      title={kontentItemGotcha.elements.title.value}
      content={kontentItemGotcha.elements.summary.value}
      button={{ title: 'Back to journal', to: '/journal' }}
    />
    <div id="main" className="alt">
      <section>
        <div className="inner">
          <RichTextElement
            value={kontentItemGotcha.elements.content.value}
            linkedItems={kontentItemGotcha.elements.content.modular_content}
            resolveLinkedItem={linkedItem => {
              switch (linkedItem.__typename) {
                case 'kontent_item_code_snippet':
                  const codeComponent = JSON.parse(
                    linkedItem.elements.code.value
                  )
                  return (
                    <CodeHighlighter
                      language={codeComponent.language}
                      code={codeComponent.code}
                    />
                  )
                default:
                  return <div>Component not supported</div>
              }
            }}
          />
        </div>
      </section>
    </div>
  </Layout>
)

export const query = graphql`
  query GotchaQuery(
    $preferred_language: StringQueryOperatorInput = {}
    $codename: String = ""
  ) {
    kontentItemGotcha(
      preferred_language: $preferred_language
      system: { codename: { eq: $codename } }
    ) {
      elements {
        title {
          value
        }
        post_date {
          value
        }
        summary {
          value
        }
        image {
          value {
            url
          }
        }
        content {
          value
          modular_content {
            ... on kontent_item_code_snippet {
              system {
                codename
              }
              elements {
                code {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

export default JournalItem
