import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import '../assets/scss/main.scss'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import get from 'lodash.get'

//TODO: Footer

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
                keywords {
                  linked_items {
                    ... on KontentItemKeyword {
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
                    description
                    name
                  }
                }
                header {
                  linked_items {
                    ... on KontentItemHeader {
                      elements {
                        menu_caption {
                          value
                        }
                        menu {
                          linked_items {
                            system {
                              name
                              codename
                            }
                          }
                        }
                        title_link {
                          linked_items {
                            ... on KontentItemLink {
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
                      }
                    }
                  }
                }
                footer {
                  linked_items {
                    ... on KontentItemFooter {
                      id
                      elements {
                        footer_text {
                          resolvedData {
                            html
                          }
                        }
                        social_media_accounts {
                          linked_items {
                            ... on KontentItemSocialMediaAccount {
                              id
                              elements {
                                account_handle {
                                  value
                                }
                                social_media_type {
                                  linked_items {
                                    ... on KontentItemSocialMediaType {
                                      id
                                      elements {
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
            'kontentItemLayout.elements.header.linked_items[0]'
          )
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
                {children}
                <Footer />
              </div>
              <Menu onToggleMenu={this.handleToggleMenu} />
            </div>
          )
        }}
      ></StaticQuery>
    )
  }
}

export default DefaultLayout
