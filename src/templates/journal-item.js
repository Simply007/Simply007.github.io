import React from 'react'
import { graphql } from 'gatsby'
import { RichTextElement } from '@kentico/gatsby-kontent-components'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'

const JournalItem = ({ data: { kontentItemJournalItem } }) => (
  <Layout>
    <BannerLanding
      title={kontentItemJournalItem.elements.title.value}
      content={kontentItemJournalItem.elements.summary.value}
    />
    <div id="main" className="alt">
      <section>
        <div className="inner">
          <RichTextElement
            value={kontentItemJournalItem.elements.content.value}
            linkedItems={
              kontentItemJournalItem.elements.content.modular_content
            }
            resolveLinkedItem={linkedItem => {
              switch (linkedItem.__typename) {
                case 'kontent_item_code_snippet':
                  return (
                    <div className="box">
                      <code>
                        {JSON.parse(linkedItem.elements.code.value).code}
                      </code>
                    </div>
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
  query JournalItemQuery(
    $preferred_language: StringQueryOperatorInput = {}
    $codename: String = ""
  ) {
    kontentItemJournalItem(
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
