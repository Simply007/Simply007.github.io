import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import '../assets/scss/main.scss'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import SmartLinkWrapper from './SmartLinkWrapper'
import get from 'lodash.get'
import { AUTHOR_NAME } from '../utils/seo'

class DefaultLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuVisible: false,
      loading: 'is-loading',
    }
    this.handleToggleMenu = this.handleToggleMenu.bind(this)
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ loading: '' })
    }, 100)
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  handleToggleMenu() {
    this.setState({
      isMenuVisible: !this.state.isMenuVisible,
    })
  }

  render() {
    const { children } = this.props
    const ogImageWidth = 1200

    return (
      <SmartLinkWrapper>
        <StaticQuery
          query={graphql`
            {
              site {
                siteMetadata {
                  siteUrl
                }
              }
              kontentItemLayout(
                system: { codename: { eq: "default_layout" } }
                preferred_language: { eq: "en-US" }
              ) {
                system {
                  id
                }
                elements {
                  title {
                    value
                  }
                  meta_description {
                    value
                  }
                  site_url {
                    value
                  }
                  keywords {
                    value {
                      ... on kontent_item_keyword {
                        elements {
                          keyword {
                            value
                          }
                        }
                      }
                    }
                  }
                  image {
                    value {
                      url
                      name
                      width
                      height
                      description
                    }
                  }
                  header {
                    value {
                      ... on kontent_item_header {
                        system {
                          id
                        }
                        elements {
                          menu_caption {
                            value
                          }
                          menu {
                            value {
                              system {
                                name
                                codename
                              }
                            }
                          }
                          title_link {
                            value {
                              ... on kontent_item_link {
                                id
                                elements {
                                  text {
                                    value
                                  }
                                  url {
                                    value
                                  }
                                }
                              }
                            }
                          }
                          menu {
                            value {
                              ... on kontent_item_navigation_item {
                                system {
                                  id
                                }
                                url
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
                  footer {
                    value {
                      ... on kontent_item_footer {
                        id
                        elements {
                          footer_text {
                            value
                          }
                          social_media_accounts {
                            value {
                              ... on kontent_item_social_media_account {
                                id
                                elements {
                                  account_handle {
                                    value
                                  }
                                  social_media_type {
                                    value {
                                      ... on kontent_item_social_media_type {
                                        id
                                        elements {
                                          label {
                                            value
                                          }
                                          account_icon {
                                            value {
                                              url
                                              description
                                              name
                                            }
                                          }
                                          account_icon_code {
                                            value
                                          }
                                          account_pattern {
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
                  }
                }
              }
            }
          `}
          render={(data) => {
            const headerData = get(
              data,
              'kontentItemLayout.elements.header.value[0]'
            )
            const footerData = get(
              data,
              'kontentItemLayout.elements.footer.value[0]'
            )

            const otherData = get(data, 'kontentItemLayout.elements')

            const seo = this.props.seo || {}
            const siteUrl = get(data, 'site.siteMetadata.siteUrl')
            const defaultTitle = otherData.title.value
            const title = seo.title
              ? `${seo.title} | ${defaultTitle}`
              : defaultTitle
            const description =
              seo.description || otherData.meta_description.value
            const canonicalUrl = `${siteUrl}${seo.path || '/'}`
            const seoImage =
              (seo.image && seo.image.url && seo.image) ||
              otherData.image.value[0]
            const imageUrl = `${seoImage.url}?w=${ogImageWidth}&format=auto`

            const sameAs = get(
              footerData,
              'elements.social_media_accounts.value',
              []
            ).map((account) =>
              account.elements.social_media_type.value[0].elements.account_pattern.value.replace(
                '%s',
                account.elements.account_handle.value
              )
            )
            const jsonLdBlocks = [
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: defaultTitle,
                url: `${siteUrl}/`,
                description: otherData.meta_description.value,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: AUTHOR_NAME,
                url: `${siteUrl}/`,
                sameAs,
              },
            ].concat(seo.jsonLd ? [].concat(seo.jsonLd) : [])
            return (
              <div
                className={`body ${this.state.loading} ${
                  this.state.isMenuVisible ? 'is-menu-visible' : ''
                }`}
              >
                <div id="wrapper">
                  <Header
                    onToggleMenu={this.handleToggleMenu}
                    data={headerData}
                  />
                  <Helmet
                    title={title}
                    meta={[
                      { property: 'og:title', content: title },
                      {
                        name: 'description',
                        content: description,
                      },
                      {
                        name: 'keywords',
                        content: otherData.keywords.value
                          .map((keyword) => keyword.elements.keyword.value)
                          .join(','),
                      },
                      { property: 'og:type', content: seo.ogType || 'website' },
                      { property: 'og:url', content: canonicalUrl },
                      {
                        property: 'og:description',
                        content: description,
                      },
                      {
                        property: 'og:image',
                        content: imageUrl,
                      },
                      {
                        property: 'og:image:width',
                        content: ogImageWidth,
                      },
                      {
                        property: 'og:image:height',
                        content:
                          (ogImageWidth / seoImage.width) * seoImage.height,
                      },
                      { name: 'twitter:card', content: 'summary_large_image' },
                      { name: 'twitter:title', content: title },
                      {
                        name: 'twitter:description',
                        content: description,
                      },
                      {
                        name: 'twitter:image',
                        content: imageUrl,
                      },
                    ]}
                    link={[
                      { rel: 'canonical', href: canonicalUrl },
                      {
                        rel: 'alternate',
                        type: 'application/rss+xml',
                        title: `${AUTHOR_NAME} — Journal, Projects & Talks`,
                        href: `${siteUrl}/rss.xml`,
                      },
                    ]}
                    htmlAttributes={{
                      lang: 'en',
                    }}
                  >
                    {jsonLdBlocks.map((block, index) => (
                      <script key={index} type="application/ld+json">
                        {JSON.stringify(block)}
                      </script>
                    ))}
                  </Helmet>
                  {children}
                  {/* <Contact /> */}
                  <Footer
                    data={footerData}
                    footerItemId={get(data, 'kontentItemLayout.system.id')}
                  />
                </div>
                <Menu
                  onToggleMenu={this.handleToggleMenu}
                  data={get(
                    data,
                    'kontentItemLayout.elements.header.value[0].elements.menu.value'
                  )}
                  data-kontent-item-id={get(
                    data,
                    'kontentItemLayout.elements.header.value[0].system.id'
                  )}
                />
              </div>
            )
          }}
        ></StaticQuery>
      </SmartLinkWrapper>
    )
  }
}

export default DefaultLayout
