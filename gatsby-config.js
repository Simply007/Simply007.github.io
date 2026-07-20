require('dotenv').config()

const { SITE_URL, AUTHOR_NAME, stripHtml } = require('./src/utils/seo')

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
    'gatsby-plugin-offline',
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
            title: `${AUTHOR_NAME} — Journal`,
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
                  sort: { elements: { post_date: { value: DESC } } }
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
              }
            `,
            serialize: ({ query: { site, allKontentItemGotcha } }) =>
              allKontentItemGotcha.nodes.map((node) => {
                const url = `${site.siteMetadata.siteUrl}/journal/${node.elements.url_slug.value}/`
                return {
                  title: node.elements.title.value,
                  description: stripHtml(node.elements.summary.value),
                  date: node.elements.post_date.value,
                  url,
                  guid: url,
                }
              }),
          },
        ],
      },
    },
    'gatsby-plugin-image',
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
}
