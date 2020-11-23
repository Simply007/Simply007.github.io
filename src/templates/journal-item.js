import React from 'react'
import { graphql } from 'gatsby'
import { RichTextElement } from '@kentico/gatsby-kontent-components'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import CodeHighlighter from '../components/CodeHighlighter'
import Img from 'gatsby-image'

const JournalItem = ({ data: { kontentItemGotcha } }) => (
  <Layout>
    <BannerLanding
      title={kontentItemGotcha.elements.title.value}
      content={kontentItemGotcha.elements.summary.value}
      button={{ title: 'Back to journal', to: '/journal' }}
      titleCodename="title"
      contentCodename="summary"
      itemId={kontentItemGotcha.system.id}
    />
    <div
      id="main"
      className="alt"
      data-kontent-item-id={kontentItemGotcha.system.id}
    >
      <section>
        <div className="inner" data-kontent-element-codename="content">
          <RichTextElement
            value={kontentItemGotcha.elements.content.value}
            linkedItems={kontentItemGotcha.elements.content.modular_content}
            resolveLinkedItem={linkedItem => {
              switch (linkedItem.__typename) {
                case 'kontent_item_code_snippet':
                  const codeComponent = JSON.parse(
                    linkedItem.elements.code.value
                  )
                  return (
                    <CodeHighlighter
                      language={codeComponent.language}
                      code={codeComponent.code}
                    />
                  )
                case 'kontent_item_button':
                  return (
                    <p>
                      <a href={linkedItem.elements.external_url.value} className="button">
                        <span className={`icon ${linkedItem.elements.icon.value}`}>
                          {linkedItem.elements.title.value}
                        </span>
                      </a>
                    </p>
                  );
                default:
                  return <div>Component not supported</div>
              }
            }}
            images={kontentItemGotcha.elements.content.images}
            resolveImage={image => (
              <Img
                fluid={image.localFile.childImageSharp.fluid}
                className="box"
                style={{
                  padding: '0',
                  width: '80%',
                  margin: '0 0 1em 2em',
                  maxWidth: '600px',
                }}
                imgStyle={{
                  width: '100%',
                }}
              />
            )}
          />
        </div>
      </section>
    </div>
  </Layout>
)

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
            url
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

export default JournalItem
