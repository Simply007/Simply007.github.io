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
            data-kontent-element-codename="image"
          />
        </a>
      ) : null
    const actions =
      section.elements.cta.value.length > 0
        ? section.elements.cta.value.map(cta => (
            <li key={cta.elements.external_url.value}>
              <a href={cta.elements.external_url.value} className="button">
                <span
                    className={
                      cta.elements.icon.value
                        ? `icon ${cta.elements.icon.value}`
                        : undefined
                    }
                  >
                    {cta.elements.title.value}
                  </span>
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
      <section
        className={image && 'spotlights'}
        data-kontent-item-id={section.system.id}
      >
        {image}
        <div className="content">
          <div className="inner">
            <header className="major" data-kontent-element-codename="header">
              {header}
            </header>
            <p
              dangerouslySetInnerHTML={{
                __html: section.elements.content.value,
              }}
              data-kontent-element-codename="content"
            />
            <ul
              className="actions"
              style={{ display: 'inline-block' }}
              data-kontent-element-codename="cta"
            >
              {actions}
            </ul>
          </div>
        </div>
      </section>
    )
  })
  return (
    <Layout>
      <div data-kontent-item-id={pageData.system.id}>
        <BannerLanding
          title={pageData.elements.header.value}
          content={pageData.elements.summary.value}
          heroImage={
            pageData.elements.hero_image.value.length > 0
              ? pageData.elements.hero_image.value[0].localFile.childImageSharp
                  .fluid
              : undefined
          }
          titleCodename="header"
          contentCodename="summary"
        />
      </div>
      <div id="main" data-kontent-item-id={pageData.system.id}>
        {sections}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query SectionsPageQuery($language: String!, $codename: String!) {
    kontentItemSectionsPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      system {
        id
      }
      elements {
        header {
          value
        }
        summary {
          value
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
        sections {
          value {
            ... on kontent_item_section {
              system {
                id
              }
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
