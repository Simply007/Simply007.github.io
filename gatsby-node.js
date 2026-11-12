/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const { getKontentItemNodeTypeName } = require('@kontent-ai/gatsby-source')
const path = require('path')
const { parsePath } = require('gatsby')
const fs = require('fs')
const { pathFor } = require('./src/utils/paths')
const {
  buildRobotsTxt,
  buildLlmsTxt,
  buildLlmsFullTxt,
} = require('./lib/static-seo-files')

exports.createSchemaCustomization = async (api) => {
  const {
    actions: { createTypes },
    schema,
  } = api

  const type = getKontentItemNodeTypeName('navigation_item')

  const extendedType = schema.buildObjectType({
    name: type,
    fields: {
      url: {
        type: `String`,
        resolve: async (source, args, context, info) => {
          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: {},
            },
            type: type,
          })

          const urlFragments = [source.elements.slug.value] // /about/small-gas/subsection/<-
          let parent
          let currentContextItem = source

          do {
            parent = Array.from(entries).find(
              (item) =>
                item.preferred_language ===
                  currentContextItem.preferred_language &&
                item.elements['sub_items'].value.includes(
                  currentContextItem.system.codename
                )
            )

            if (parent) {
              urlFragments.push(parent.elements.slug.value)
              currentContextItem = parent
            }
          } while (parent)

          urlFragments.reverse()
          // TODO load prefix (/) from layout
          return '/' + urlFragments.join('/')
        },
      },
    },
  })

  createTypes(extendedType)

  // Listing highlight (home page sections) declared here as well: the Kontent
  // source plugin builds its types from a cached list of content types, so a
  // stale build cache (Netlify keeps one between deploys) would not know the
  // type and the home page query would fail. Gatsby merges this definition
  // with the plugin's own when both exist.
  createTypes(`
    type kontent_item_listing_highlight_elements {
      title: kontent_item_text_element_value
      summary: kontent_item_text_element_value
      image: kontent_item_asset_element_value
      item_types: kontent_item_custom_element_value
      item_count: kontent_item_number_element_value
      link_label: kontent_item_text_element_value
      link_target: kontent_item_modular_content_element_value
    }
    type kontent_item_listing_highlight implements Node & kontent_item @dontInfer {
      system: kontent_item_system!
      elements: kontent_item_listing_highlight_elements
      preferred_language: String!
    }
  `)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const { data } = await graphql(`
    query localPagesQuery {
      allKontentItemNavigationItem(
        filter: { elements: { external_url: { value: { eq: "" } } } }
      ) {
        nodes {
          url
          elements {
            content_page {
              value {
                __typename
                preferred_language
                system {
                  codename
                }
                ... on kontent_item_listing_page {
                  elements {
                    listing_page_options__list_types {
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
  `)

  data.allKontentItemNavigationItem.nodes.forEach((page) => {
    const contentPage = page.elements.content_page.value[0]
    const contentPageType = contentPage.__typename
    const templatePath =
      contentPageType === 'kontent_item_home_page'
        ? './src/templates/home.js'
        : contentPageType === 'kontent_item_sections_page'
          ? './src/templates/sections-page.js'
          : contentPageType === 'kontent_item_listing_page'
            ? './src/templates/listing-page.js'
            : null

    if (!templatePath) {
      return
    }

    const listTypes = []
    if (
      contentPage.elements &&
      contentPage.elements.listing_page_options__list_types &&
      contentPage.elements.listing_page_options__list_types.value
    ) {
      JSON.parse(contentPage.elements.listing_page_options__list_types.value)
        .map((type) => type.codename)
        .forEach((codename) => {
          listTypes.push(codename)
        })
    }

    createPage({
      path: page.url,
      component: require.resolve(templatePath),
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename,
        listTypes,
      },
    })
  })

  const { data: gotchas } = await graphql(`
    query GotchaQuery {
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
            url_slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
    }
  `)

  gotchas.allKontentItemGotcha.nodes.forEach((journalItem) =>
    createPage({
      path: pathFor('gotcha', journalItem.elements.url_slug.value),
      component: require.resolve('./src/templates/journal-item.js'),
      context: {
        language: journalItem.preferred_language,
        codename: journalItem.system.codename,
      },
    })
  )

  const { data: projects } = await graphql(`
    query ProjectQuery {
      allKontentItemProject(
        filter: {
          elements: {
            url_slug: { value: { ne: "" } }
            channel_purpose: {
              value: { elemMatch: { codename: { eq: "website" } } }
            }
          }
        }
        sort: { elements: { release_date: { value: DESC } } }
      ) {
        nodes {
          elements {
            url_slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
    }
  `)

  projects.allKontentItemProject.nodes.forEach((projectItem) =>
    createPage({
      path: pathFor('project', projectItem.elements.url_slug.value),
      component: require.resolve('./src/templates/project-item.js'),
      context: {
        language: projectItem.preferred_language,
        codename: projectItem.system.codename,
      },
    })
  )

  const { data: talks } = await graphql(`
    query TalkQuery {
      allKontentItemTalk(
        filter: {
          elements: {
            url_slug: { value: { ne: "" } }
            channel_purpose: {
              value: { elemMatch: { codename: { eq: "website" } } }
            }
          }
        }
        sort: { elements: { release_date: { value: DESC } } }
      ) {
        nodes {
          elements {
            url_slug {
              value
            }
          }
          system {
            codename
          }
          preferred_language
        }
      }
    }
  `)

  talks.allKontentItemTalk.nodes.forEach((talkItem) =>
    createPage({
      path: pathFor('talk', talkItem.elements.url_slug.value),
      component: require.resolve('./src/templates/talk-item.js'),
      context: {
        language: talkItem.preferred_language,
        codename: talkItem.system.codename,
      },
    })
  )
}

const contentFragment = `
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
`

exports.onPostBuild = async ({ graphql, reporter }) => {
  const language = process.env.KONTENT_LANGUAGE_CODENAMES.split(',')[0].trim()

  const { data, errors } = await graphql(
    `
      query StaticSeoFilesQuery($language: String!) {
        kontentItemLayout(
          system: { codename: { eq: "default_layout" } }
          preferred_language: { eq: $language }
        ) {
          elements {
            title {
              value
            }
            meta_description {
              value
            }
          }
        }
        allKontentItemGotcha(
          filter: {
            preferred_language: { eq: $language }
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
            system {
              last_modified
            }
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
              content {
                ${contentFragment}
              }
            }
          }
        }
        allKontentItemProject(
          filter: {
            preferred_language: { eq: $language }
            elements: {
              url_slug: { value: { ne: "" } }
              channel_purpose: {
                value: { elemMatch: { codename: { eq: "website" } } }
              }
            }
          }
          sort: { elements: { release_date: { value: DESC } } }
        ) {
          nodes {
            system {
              last_modified
            }
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
              live_url {
                value
              }
              source_code_url {
                value
              }
              content {
                ${contentFragment}
              }
            }
          }
        }
        allKontentItemTalk(
          filter: {
            preferred_language: { eq: $language }
            elements: {
              url_slug: { value: { ne: "" } }
              channel_purpose: {
                value: { elemMatch: { codename: { eq: "website" } } }
              }
            }
          }
          sort: { elements: { release_date: { value: DESC } } }
        ) {
          nodes {
            system {
              last_modified
            }
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
              slides_url {
                value
              }
              recording_url {
                value
              }
              content {
                ${contentFragment}
              }
            }
          }
        }
      }
    `,
    { language }
  )

  if (errors) {
    reporter.panicOnBuild('StaticSeoFilesQuery failed', errors)
    return
  }

  const siteContent = {
    siteTitle: data.kontentItemLayout.elements.title.value,
    siteDescription: data.kontentItemLayout.elements.meta_description.value,
    // keyed by Kontent type codename, see src/utils/paths.js
    itemsByType: {
      gotcha: data.allKontentItemGotcha.nodes,
      project: data.allKontentItemProject.nodes,
      talk: data.allKontentItemTalk.nodes,
    },
  }

  fs.writeFileSync('./public/robots.txt', buildRobotsTxt())
  fs.writeFileSync('./public/llms.txt', buildLlmsTxt(siteContent))
  fs.writeFileSync('./public/llms-full.txt', buildLlmsFullTxt(siteContent))
  reporter.info('Wrote robots.txt, llms.txt, and llms-full.txt')
}
