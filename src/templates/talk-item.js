import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'

const TalkItem = ({ data: { kontentItemTalk } }) => {
  return (
    <Layout>
      <BannerLanding
        title={kontentItemTalk.elements.title.value}
        content={kontentItemTalk.elements.summary.value}
        button={{ title: 'Back to talks', to: '/talks' }}
        titleCodename="title"
        contentCodename="summary"
        itemId={kontentItemTalk.system.id}
        heroImage={
          kontentItemTalk.elements.image.value.length > 0
            ? kontentItemTalk.elements.image.value[0]
            : undefined
        }
      />


      <div
        id="main"
        className="alt"
        data-kontent-item-id={kontentItemTalk.system.id}
      >
        <section className='frontmatter'>
          {kontentItemTalk.elements.release_date.value && (
            <div className="box" >
              <strong>Released: </strong>
              {new Date(
                kontentItemTalk.elements.release_date.value
              ).toDateString()}
            </div>
          )}
          <div>
            {(kontentItemTalk.elements.slides_url.value || kontentItemTalk.elements.recording_url.value) &&
              (<ul className='actions'>
                {kontentItemTalk.elements.slides_url.value && (
                  <li>
                    <button
                      className="icon fa-slideshare"
                      to={kontentItemTalk.elements.slides_url.value}
                      title="Live">Slides</button>
                  </li>
                )}
                {kontentItemTalk.elements.recording_url.value && (
                  <li>
                    <button
                      className="icon fa-video"
                      to={kontentItemTalk.elements.recording_url.value}
                      title="Source code">Recording</button>
                  </li>
                )}
              </ul>)}
          </div>
        </section>
        <section>
          <div className="inner" data-kontent-element-codename="content">
            <RichText element={kontentItemTalk.elements.content} />
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
query Talk($language: String = "", $codename: String = "") {
    kontentItemTalk(
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
        slides_url {
          value
        }
        recording_url {
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
                link_to {
                  value {
                    __typename
                    ... on kontent_item_navigation_item {
                      elements {
                        slug {
                          value
                        }
                        title {
                          value
                        }
                      }
                    }
                    ... on kontent_item_project {
                      elements {
                        url_slug {
                          value
                        }
                        title {
                          value
                        }
                      }
                    }
                    ... on kontent_item_gotcha {
                      elements {
                        url_slug {
                          value
                        }
                        title {
                          value
                        }
                      }
                    }
                  }
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

export default TalkItem
