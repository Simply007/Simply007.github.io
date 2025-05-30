/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const { getKontentItemNodeTypeName } = require('@kontent-ai/gatsby-source')
const path = require('path')
const { parsePath } = require('gatsby')

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
        },
        sort: {
          elements: {
            post_date: {
              value: DESC
            }
          }
        }
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
      path: `/journal/${journalItem.elements.url_slug.value}`,
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
        },
        sort: {
          elements: {
            release_date: {
              value: DESC
            }
          }
        }
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
      path: `/projects/${projectItem.elements.url_slug.value}`,
      component: require.resolve('./src/templates/project-item.js'),
      context: {
        language: projectItem.preferred_language,
        codename: projectItem.system.codename,
      },
    })
  )
}
