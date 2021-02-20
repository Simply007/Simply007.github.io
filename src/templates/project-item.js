import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'

const ProjectItem = ({ data: { kontentItemProject } }) => (
  <Layout>
    <BannerLanding
      title={kontentItemProject.elements.title.value}
      content={kontentItemProject.elements.summary.value}
      button={{ title: 'Back to projects', to: '/projects' }}
      titleCodename="title"
      contentCodename="summary"
      itemId={kontentItemProject.system.id}
      heroImage={
        kontentItemProject.elements.image.value.length > 0
          ? kontentItemProject.elements.image.value[0].localFile.childImageSharp
              .fluid
          : undefined
      }
    />
    <div
      id="main"
      className="alt"
      data-kontent-item-id={kontentItemProject.system.id}
    >
      <section>
        <div className="inner" data-kontent-element-codename="content">
          <RichText element={kontentItemProject.elements.content}/>            
        </div>
      </section>
    </div>
  </Layout>
)

export const query = graphql`
  query ProjectQuery($language: String = "", $codename: String = "") {
    kontentItemProject(
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
        release_date {
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

export default ProjectItem
