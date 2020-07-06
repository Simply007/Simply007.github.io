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
  kontentItemLayout(system: {codename: {eq: "default_layout"}}, preferred_language: {eq: "en-US"}) {
    elements {
      title {
        value
      }
      meta_description {
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
          description
          name
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
              <Menu onToggleMenu={this.handleToggleMenu} data={get(data, 'kontentItemLayout.elements.header.value[0].elements.menu.value')} />
            </div>
          )
        }}
      ></StaticQuery>
    )
  }
}

export default DefaultLayout
