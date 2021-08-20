import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'

const JournalItem = ({ data: { kontentItemGotcha } }) => (
  <Layout
    itemId={`${kontentItemGotcha.system.id}_${kontentItemGotcha.system.language}`}
  >
    <BannerLanding
      title={kontentItemGotcha.elements.title.value}
      content={kontentItemGotcha.elements.summary.value}
      button={{ title: 'Back to journal', to: '/journal' }}
      titleCodename="title"
      contentCodename="summary"
      itemId={kontentItemGotcha.system.id}
      heroImage={
        kontentItemGotcha.elements.image.value.length > 0
          ? kontentItemGotcha.elements.image.value[0]
          : undefined
      }
    />
    <div
      id="main"
      className="alt"
      data-kontent-item-id={kontentItemGotcha.system.id}
    >
      <section>
        <div className="inner" data-kontent-element-codename="content">
          <RichText element={kontentItemGotcha.elements.content} />
        </div>
      </section>

      <section>
        <div id="widget-root-2ba84926-16c7-41b5-9c33-327aa9f2a44d"></div>
      </section>
    </div>
  </Layout>
)

export const query = graphql`
  query GotchaQuery($language: String = "", $codename: String = "") {
    kontentItemGotcha(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      system {
        id
        language
      }
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
            name
            url
            width
            height
            description
          }
        }
        content {
          value
          modular_content {
            __typename
            system {
              codename
            }
            ... on kontent_item_code_snippet {
              elements {
                code {
                  value
                }
              }
            }
            ... on kontent_item_button {
              elements {
                icon {
                  value
                }
                title {
                  value
                }
                external_url {
                  value
                }
              }
            }
          }
          images {
            image_id
            url
            width
            height
            description
          }
        }
      }
    }
  }
`

export default JournalItem
