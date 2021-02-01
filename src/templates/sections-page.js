import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import Section from '../components/Section'

const SectionsPage = ({ data: { kontentItemSectionsPage: pageData } }) => {
  const sections = pageData.elements.sections.value.map((section, index) => (
    <Section section={section} isFirst={index === 0} />
  ))

  return (
    <Layout>
      <div data-kontent-item-id={pageData.system.id}>
        <BannerLanding
          title={pageData.elements.header.value}
          content={pageData.elements.summary.value}
          heroImage={
            pageData.elements.hero_image.value.length > 0
              ? pageData.elements.hero_image.value[0].localFile.childImageSharp
                  .fluid
              : undefined
          }
          titleCodename="header"
          contentCodename="summary"
        />
      </div>
      <div id="main" data-kontent-item-id={pageData.system.id}>
        {sections}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query SectionsPageQuery($language: String!, $codename: String!) {
    kontentItemSectionsPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      system {
        id
      }
      elements {
        header {
          value
        }
        summary {
          value
        }
        hero_image {
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
        sections {
          value {
            ... on kontent_item_section {
              system {
                id
              }
              elements {
                header {
                  value
                }
                image {
                  value {
                    url
                    name
                    description
                  }
                }
                content {
                  value
                }
                cta {
                  value {
                    ... on kontent_item_button {
                      elements {
                        title {
                          value
                        }
                        icon {
                          value
                        }
                        external_url {
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default SectionsPage
