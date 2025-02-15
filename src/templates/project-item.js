import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'

const ProjectItem = ({ data: { kontentItemProject } }) => {
  return (
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
            ? kontentItemProject.elements.image.value[0]
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
            <ul className="icons">
              {kontentItemProject.elements.live_url.value && (
                <li>
                  <Link
                    className="icon alt fa-globe"
                    to={kontentItemProject.elements.live_url.value}
                    title="Live"
                  />
                </li>
              )}
              {kontentItemProject.elements.source_code_url.value && (
                <li>
                  <Link
                    className="icon alt fa-code"
                    to={kontentItemProject.elements.source_code_url.value}
                    title="Source code"
                  />
                </li>
              )}
              {kontentItemProject.elements.release_date.value && (
                <li>
                  <strong>Released: </strong>
                  {new Date(
                    kontentItemProject.elements.release_date.value
                  ).toDateString()}
                </li>
              )}
            </ul>
            <RichText element={kontentItemProject.elements.content} />
          </div>
        </section>
      </div>
    </Layout>
  )
}

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
        source_code_url {
          value
        }
        live_url {
          value
        }
        summary {
          value
        }
        image {
          value {
            url
            width
            height
            description
          }
        }
        content {
          value
          modular_content {
            system {
              codename
              type
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

export default ProjectItem
