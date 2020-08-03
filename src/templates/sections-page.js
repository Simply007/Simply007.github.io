import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'

const SectionsPage = ({ data: { kontentItemSectionsPage: pageData } }) => {
  const sections = pageData.elements.sections.value.map((section, index) => {
    const image =
      section.elements.image.value.length > 0 ? (
        <a
          href={section.elements.cta.value[0].elements.external_url.value}
          className="image"
        >
          <img
            src={section.elements.image.value[0].url}
            alt={
              section.elements.image.value[0].description ||
              section.elements.image.value[0].name
            }
          />
        </a>
      ) : null
    const actions =
      section.elements.cta.value.length > 0
        ? section.elements.cta.value.map(cta => (
            <li key={cta.elements.external_url.value}>
              <a href={cta.elements.external_url.value} className="button">
                {cta.elements.title.value}
              </a>
            </li>
          ))
        : null

    const header =
      index === 0 ? (
        <h2>{section.elements.header.value}</h2>
      ) : (
        <h3>{section.elements.header.value}</h3>
      )

    return (
      <section className={image && 'spotlights'}>
        {image}
        <div className="content">
          <div className="inner">
            <header className="major">{header}</header>
            <p
              dangerouslySetInnerHTML={{
                __html: section.elements.content.value,
              }}
            />
            <ul className="actions">{actions}</ul>
          </div>
        </div>
      </section>
    )
  })
  return (
    <Layout>
      <BannerLanding
        title={pageData.elements.header.value}
        content={pageData.elements.summary.value}
      />
      <div id="main">{sections}</div>
    </Layout>
  )
}

export const query = graphql`
  query SectionsPageQuery($language: String!, $codename: String!) {
    kontentItemSectionsPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      elements {
        header {
          value
        }
        summary {
          value
        }
        sections {
          value {
            ... on kontent_item_section {
              elements {
                header {
                  value
                }
                image {
                  value {
                    url
                    name
                    description
                  }
                }
                content {
                  value
                }
                cta {
                  value {
                    ... on kontent_item_button {
                      elements {
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
        }
      }
    }
  }
`

export default SectionsPage
