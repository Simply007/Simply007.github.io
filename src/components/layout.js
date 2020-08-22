import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import '../assets/scss/main.scss'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import get from 'lodash.get'

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

    return (
      <StaticQuery
        query={graphql`
          {
            kontentItemLayout(
              system: { codename: { eq: "default_layout" } }
              preferred_language: { eq: "en-US" }
            ) {
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
                    localFile {
                      childImageSharp {
                        fixed(width: 1200, quality: 100) {
                          src
                          width
                          height
                        }
                      }
                    }
                    description
                  }
                }
                header {
                  value {
                    ... on kontent_item_header {
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
        render={data => {
          const headerData = get(
            data,
            'kontentItemLayout.elements.header.value[0]'
          )
          const footerData = get(
            data,
            'kontentItemLayout.elements.footer.value[0]'
          )

          const otherData = get(data, 'kontentItemLayout.elements')

          const imageUrl = `${otherData.site_url.value.trimEnd('/')}${otherData.image.value[0].localFile.childImageSharp.fixed.src }`;
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
                  title={otherData.title.value}
                  meta={[
                    { property: 'og:title', content: otherData.title.value },
                    {
                      name: 'description',
                      content: otherData.meta_description.value,
                    },
                    {
                      name: 'keywords',
                      content: otherData.keywords.value
                        .map(keyword => keyword.elements.keyword.value)
                        .join(','),
                    },
                    { property: 'og:type', content: 'website' },
                    { property: 'og:url', content: otherData.site_url.value },
                    {
                      property: 'og:description',
                      content: otherData.meta_description.value,
                    },
                    {
                      property: 'og:image',
                      content: imageUrl
                    },
                    {
                      property: 'og:image:width',
                      content:
                        otherData.image.value[0].localFile.childImageSharp.fixed
                          .width,
                    },
                    {
                      property: 'og:image:height',
                      content:
                        otherData.image.value[0].localFile.childImageSharp.fixed
                          .height,
                    },
                    { name: 'twitter:card', content: 'summary_large_image' },
                    { name: 'twitter:title', content: otherData.title.value },
                    {
                      name: 'twitter:description',
                      content: otherData.meta_description.value,
                    },
                    {
                      name: 'twitter:image',
                      content: imageUrl
                    },
                  ]}
                  htmlAttributes={{
                    lang: 'en',
                  }}
                ></Helmet>
                {children}
                {/* <Contact /> */}
                <Footer data={footerData} />
              </div>
              <Menu
                onToggleMenu={this.handleToggleMenu}
                data={get(
                  data,
                  'kontentItemLayout.elements.header.value[0].elements.menu.value'
                )}
              />
            </div>
          )
        }}
      ></StaticQuery>
    )
  }
}

export default DefaultLayout
