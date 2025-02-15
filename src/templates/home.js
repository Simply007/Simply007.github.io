import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Banner from '../components/Banner'

const Home = ({ data }) => (
  <Layout>
    <Banner data={data.kontentItemHomePage} />
  </Layout>
)

export const query = graphql`
  query HomePageQuery($language: String!, $codename: String!) {
    kontentItemHomePage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      system {
        id
      }
      elements {
        profile_photo {
          value {
            name
            url
            width
            height
            description
          }
        }
        hero_image {
          value {
            name
            url
            width
            height
            description
          }
        }
        primary_text {
          value
        }
        secondary_text {
          value
        }
        cta {
          value {
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
        }
      }
    }
  }
`

export default Home
