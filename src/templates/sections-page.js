import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'

const SectionsPage = ({ data }) => (
  <Layout>
    <pre>{JSON.stringify(data, null, 4)}</pre>
  </Layout>
)

export const query = graphql`
  query SectionsPageQuery($language: String!, $codename: String!) {
    kontentItemSectionsPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      elements {
        header {
          value
        }
        summary {
          value
        }
        sections {
          value {
            ... on kontent_item_section {
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
