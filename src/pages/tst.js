import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

const ComponentName = ({ data }) => (
  <div>
    <h1>Hello gatsby-image</h1>
    <pre>{JSON.stringify(data, null, 4)}</pre>
    <Img fixed={data.kontentItemHomePage.elements.hero_image.value[0].localFile.childImageSharp.fixed} />
  </div>
);

export const query = graphql`
  {
    kontentItemHomePage {
      elements {
        hero_image {
          value {
            localFile {
              childImageSharp {
                fixed(width: 1000) {
                  ...GatsbyImageSharpFixed_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`

export default ComponentName
