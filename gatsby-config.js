require('dotenv').config()

const { SITE_URL, AUTHOR_NAME, stripHtml } = require('./src/utils/seo')
const { SECTIONS, pathFor } = require('./src/utils/paths')
const { resolveSitemapPages } = require('./src/utils/sitemap')

module.exports = {
  siteMetadata: {
    title: AUTHOR_NAME,
    description: `Personal site and journal of ${AUTHOR_NAME} — software developer.`,
    siteUrl: SITE_URL,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "Ondřej Chrastina's personal site.",
        short_name: 'chrastina',
        start_url: '/',
        background_color: '#242943',
        theme_color: '#242943',
        display: 'minimal-ui',
        icon: 'src/assets/images/website-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: '@kontent-ai/gatsby-source',
      options: {
        projectId: process.env.KONTENT_PROJECT_ID, // Fill in your Project ID
        // if false used authorization key for secured API
        usePreviewUrl:
          process.env.KONTENT_PREVIEW_ENABLED &&
          process.env.KONTENT_PREVIEW_ENABLED.toLowerCase() === 'true',
        authorizationKey:
          process.env.KONTENT_PREVIEW_ENABLED &&
          process.env.KONTENT_PREVIEW_ENABLED.toLowerCase() === 'true'
            ? process.env.KONTENT_PREVIEW_KEY
            : undefined,
        languageCodenames: process.env.KONTENT_LANGUAGE_CODENAMES.split(
          ','
        ).map((lang) => lang.trim()),
        includeTaxonomies: true, // opt-out by default
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-remove-serviceworker',
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-R3560X2K2Q', // Google Analytics / GA
        ],
        pluginConfig: {
          exclude: ['/style-guide/**'],
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: ['/style-guide', '/style-guide/*'],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
                pageContext
              }
            }
            allKontentItem {
              nodes {
                system {
                  codename
                  last_modified
                }
              }
            }
            allKontentItemGotcha(
              filter: { elements: { url_slug: { value: { ne: "" } } } }
            ) {
              nodes {
                system {
                  type
                  last_modified
                }
                elements {
                  url_slug {
                    value
                  }
                  channel_purpose {
                    value {
                      codename
                    }
                  }
                }
              }
            }
            allKontentItemProject(
              filter: { elements: { url_slug: { value: { ne: "" } } } }
            ) {
              nodes {
                system {
                  type
                  last_modified
                }
                elements {
                  url_slug {
                    value
                  }
                  channel_purpose {
                    value {
                      codename
                    }
                  }
                }
              }
            }
            allKontentItemTalk(
              filter: { elements: { url_slug: { value: { ne: "" } } } }
            ) {
              nodes {
                system {
                  type
                  last_modified
                }
                elements {
                  url_slug {
                    value
                  }
                  channel_purpose {
                    value {
                      codename
                    }
                  }
                }
              }
            }
          }
        `,
        resolvePages: ({
          allSitePage,
          allKontentItem,
          allKontentItemGotcha,
          allKontentItemProject,
          allKontentItemTalk,
        }) =>
          resolveSitemapPages({
            pages: allSitePage.nodes,
            items: [
              ...allKontentItemGotcha.nodes,
              ...allKontentItemProject.nodes,
              ...allKontentItemTalk.nodes,
            ],
            contentItems: allKontentItem.nodes,
          }),
        serialize: ({ path, lastmod }) => ({ url: path, lastmod }),
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            output: '/rss.xml',
            title: `${AUTHOR_NAME} — Journal, Projects & Talks`,
            query: `
              {
                allKontentItemGotcha(
                  filter: {
                    elements: {
                      url_slug: { value: { ne: "" } }
                      channel_purpose: {
                        value: { elemMatch: { codename: { eq: "website" } } }
                      }
                    }
                  }
                ) {
                  nodes {
                    elements {
                      title {
                        value
                      }
                      summary {
                        value
                      }
                      post_date {
                        value
                      }
                      url_slug {
                        value
                      }
                    }
                  }
                }
                allKontentItemProject(
                  filter: {
                    elements: {
                      url_slug: { value: { ne: "" } }
                      channel_purpose: {
                        value: { elemMatch: { codename: { eq: "website" } } }
                      }
                    }
                  }
                ) {
                  nodes {
                    elements {
                      title {
                        value
                      }
                      summary {
                        value
                      }
                      release_date {
                        value
                      }
                      url_slug {
                        value
                      }
                    }
                  }
                }
                allKontentItemTalk(
                  filter: {
                    elements: {
                      url_slug: { value: { ne: "" } }
                      channel_purpose: {
                        value: { elemMatch: { codename: { eq: "website" } } }
                      }
                    }
                  }
                ) {
                  nodes {
                    elements {
                      title {
                        value
                      }
                      summary {
                        value
                      }
                      release_date {
                        value
                      }
                      url_slug {
                        value
                      }
                    }
                  }
                }
              }
            `,
            serialize: ({
              query: {
                site,
                allKontentItemGotcha,
                allKontentItemProject,
                allKontentItemTalk,
              },
            }) => {
              const toFeedItem = (type) => (node) => {
                const url = `${site.siteMetadata.siteUrl}${pathFor(type, node.elements.url_slug.value)}`
                const category = SECTIONS[type].heading
                return {
                  title: node.elements.title.value,
                  description: stripHtml(node.elements.summary.value),
                  date: (node.elements.post_date || node.elements.release_date)
                    .value,
                  url,
                  guid: url,
                  categories: [category],
                }
              }
              return allKontentItemGotcha.nodes
                .map(toFeedItem('gotcha'))
                .concat(allKontentItemProject.nodes.map(toFeedItem('project')))
                .concat(allKontentItemTalk.nodes.map(toFeedItem('talk')))
                .sort((a, b) => new Date(b.date) - new Date(a.date))
            },
          },
        ],
      },
    },
    'gatsby-plugin-image',
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
