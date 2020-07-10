/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const { getKontentItemNodeTypeName } = require('@kentico/gatsby-source-kontent')
const path = require('path')
const { parsePath } = require('gatsby')

exports.createSchemaCustomization = async api => {
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
          const allNavigationItems = await context.nodeModel.runQuery({
            query: {
              filter: {},
            },
            type: type,
            firstOnly: false,
          })

          const urlFragments = [source.elements.slug.value] // /about/small-gas/subsection/<-
          let parent
          let currentContextItem = source

          do {
            parent = allNavigationItems.find(
              item =>
                item.preferred_language ===
<<<<<<< HEAD
                  currentContextItem.preferred_language &&
=======
                currentContextItem.preferred_language &&
>>>>>>> 8f7fb3703459556ecfbb5de5b5b16011ea85f58b
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

<<<<<<< HEAD
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
=======

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const { data } = await graphql(`
  query localPagesQuery {
    allKontentItemNavigationItem(filter: {elements: {external_url: {value: {eq: ""}}}}) {
      nodes {
        url
        elements {
          content_page {
            value {
              __typename
              preferred_language
              system {
                codename
>>>>>>> 8f7fb3703459556ecfbb5de5b5b16011ea85f58b
              }
            }
          }
        }
      }
    }
<<<<<<< HEAD
  `)

  data.allKontentItemNavigationItem.nodes.forEach(page => {
    const contentPage = page.elements.content_page.value[0]
    contentPageType = contentPage.__typename
    const templatePath =
      contentPageType === 'kontent_item_home_page'
        ? './src/templates/home.js'
        : contentPageType === 'kontent_item_sections_page'
        ? './src/templates/sections-page.js'
        : null

    if (!templatePath) {
      return
    }

    createPage({
      path: page.url,
      component: require.resolve(templatePath),
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename,
      },
    })
  })
}
=======
  }  
  `)

  data.allKontentItemNavigationItem.nodes.forEach(page =>{
    const contentPage = page.elements.content_page.value[0]
    contentPageType = contentPage.__typename;
    const templatePath = contentPageType === "kontent_item_home_page" 
      ? "./src/templates/home.js"
      : contentPageType === "kontent_item_sections_page" 
        ? "./src/templates/sections-page.js"
        : null;

    if(!templatePath) {
      return;
    }

    createPage({
      path: page.url,
      component: require.resolve(templatePath),
      context: {
        language: contentPage.preferred_language,
        codename: contentPage.system.codename
      }
    })
  });

}
>>>>>>> 8f7fb3703459556ecfbb5de5b5b16011ea85f58b
