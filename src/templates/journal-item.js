import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'

const JournalItem = ({ data: { kontentItemGotcha } }) => (
  <Layout>
    <BannerLanding
      title={kontentItemGotcha.elements.title.value}
      content={kontentItemGotcha.elements.summary.value}
      button={{ title: 'Back to journal', to: '/journal' }}
      titleCodename="title"
      contentCodename="summary"
      itemId={kontentItemGotcha.system.id}
      heroImage={
        kontentItemGotcha.elements.image.value.length > 0
          ? kontentItemGotcha.elements.image.value[0].localFile.childImageSharp
              .fluid
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
            localFile {
              childImageSharp {
                fluid(quality: 90, maxHeight: 1920) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        content {
          value
          modular_content {
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
            description
            localFile {
              childImageSharp {
                fluid(quality: 100, maxWidth: 1920) {
                  ...GatsbyImageSharpFluid_withWebp
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
