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
      elements {
        profile_photo {
          value {,
            url
            description
            name
            localFile {
              childImageSharp {
                fluid(quality: 90, maxHeight: 150) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
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
