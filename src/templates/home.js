import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const Home = ({ data }) => (
  <Layout>
    <pre>
      {JSON.stringify(data, null, 4)}
    </pre>
  </Layout>
);

export const query = graphql`
  query HomePageQuery($language: String!, $codename: String!) {
    kontentItemHomePage(preferred_language: {eq: $language}, system: {codename: {eq: $codename}}) {
      elements {
        profile_photo {
          value {
            url
            description
            name
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

<<<<<<< HEAD
export default Home
=======
export default Home;
>>>>>>> 8f7fb3703459556ecfbb5de5b5b16011ea85f58b
