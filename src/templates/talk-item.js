import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'
import { SITE_URL, AUTHOR_NAME, stripHtml } from '../utils/seo'

const TalkItem = ({ data: { kontentItemTalk }, location }) => {
  const elements = kontentItemTalk.elements
  const description = stripHtml(elements.summary.value)
  const image =
    elements.image.value.length > 0 ? elements.image.value[0] : undefined
  const canonicalUrl = `${SITE_URL}${location.pathname}`
  return (
    <Layout
      seo={{
        title: elements.title.value,
        description,
        path: location.pathname,
        ogType: 'article',
        image,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: elements.title.value,
          description,
          datePublished: elements.release_date.value,
          image: image && image.url,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          sameAs: [
            elements.recording_url.value,
            elements.slides_url.value,
          ].filter(Boolean),
          associatedMedia: elements.recording_url.value
            ? {
                '@type': 'VideoObject',
                name: elements.title.value,
                contentUrl: elements.recording_url.value,
              }
            : undefined,
          author: { '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/` },
          inLanguage: 'en',
        },
      }}
    >
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
        <section className="frontmatter">
          {kontentItemTalk.elements.release_date.value && (
            <div>
              <strong>Released: </strong>
              {new Date(
                kontentItemTalk.elements.release_date.value
              ).toDateString()}
            </div>
          )}
          <div>
            {(kontentItemTalk.elements.slides_url.value ||
              kontentItemTalk.elements.recording_url.value) && (
              <ul className="actions">
                {kontentItemTalk.elements.slides_url.value && (
                  <li>
                    <a
                      className="button icon fa-slideshare"
                      href={kontentItemTalk.elements.slides_url.value}
                      title="Slides"
                    >
                      Slides
                    </a>
                  </li>
                )}
                {kontentItemTalk.elements.recording_url.value && (
                  <li>
                    <a
                      className="button icon fa-video"
                      href={kontentItemTalk.elements.recording_url.value}
                      title="Source code"
                    >
                      Recording
                    </a>
                  </li>
                )}
              </ul>
            )}
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
