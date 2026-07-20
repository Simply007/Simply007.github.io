import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import RichText from '../components/RichText'
import { SITE_URL, AUTHOR_NAME, stripHtml } from '../utils/seo'

const JournalItem = ({ data: { kontentItemGotcha }, location }) => {
  const elements = kontentItemGotcha.elements
  const description = stripHtml(elements.summary.value)
  const image =
    elements.image.value.length > 0 ? elements.image.value[0] : undefined
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
          '@type': 'BlogPosting',
          headline: elements.title.value,
          description,
          datePublished: elements.post_date.value,
          image: image && image.url,
          url: `${SITE_URL}${location.pathname}`,
          mainEntityOfPage: `${SITE_URL}${location.pathname}`,
          author: { '@type': 'Person', name: AUTHOR_NAME, url: `${SITE_URL}/` },
          inLanguage: 'en',
        },
      }}
    >
      <BannerLanding
        title={kontentItemGotcha.elements.title.value}
        content={kontentItemGotcha.elements.summary.value}
        button={{ title: 'Back to journal', to: '/journal' }}
        titleCodename="title"
        contentCodename="summary"
        itemId={kontentItemGotcha.system.id}
        heroImage={
          kontentItemGotcha.elements.image.value.length > 0
            ? kontentItemGotcha.elements.image.value[0]
            : undefined
        }
      />
      <div
        id="main"
        className="alt"
        data-kontent-item-id={kontentItemGotcha.system.id}
      >
        <section>
          <div className="inner" data-kontent-element-codename="content">
            <RichText element={kontentItemGotcha.elements.content} />
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query GotchaQuery($language: String = "", $codename: String = "") {
    kontentItemGotcha(
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
        post_date {
          value
        }
        summary {
          value
        }
        image {
          value {
            name
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

export default JournalItem
