import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'
import { SITE_URL, AUTHOR_NAME, stripHtml } from '../utils/seo'

const ProjectItem = ({ data: { kontentItemProject }, location }) => {
  const elements = kontentItemProject.elements
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
        image,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': elements.source_code_url.value
            ? 'SoftwareSourceCode'
            : 'CreativeWork',
          name: elements.title.value,
          description,
          datePublished: elements.release_date.value,
          image: image && image.url,
          codeRepository: elements.source_code_url.value || undefined,
          url: elements.live_url.value || canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          author: { '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/` },
          inLanguage: 'en',
        },
      }}
    >
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
        <section className="frontmatter">
          {kontentItemProject.elements.release_date.value && (
            <div>
              <strong>Released: </strong>
              {new Date(
                kontentItemProject.elements.release_date.value
              ).toDateString()}
            </div>
          )}
          <div>
            {(kontentItemProject.elements.live_url.value ||
              kontentItemProject.elements.source_code_url.value) && (
              <ul className="actions">
                {kontentItemProject.elements.live_url.value && (
                  <li>
                    <a
                      className="button icon fa-globe"
                      href={kontentItemProject.elements.live_url.value}
                      title="See Live"
                    >
                      Live URL <span className="icon fa-external-link-alt" />
                    </a>
                  </li>
                )}
                {kontentItemProject.elements.source_code_url.value && (
                  <li>
                    <a
                      className="button icon fa-code"
                      href={kontentItemProject.elements.source_code_url.value}
                      title="Source code"
                    >
                      Source Code <span className="icon fa-external-link-alt" />
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </section>
        <section>
          <div className="inner" data-kontent-element-codename="content">
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

export default ProjectItem
