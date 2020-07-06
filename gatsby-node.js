/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const {
  getKontentItemNodeTypeName,
} = require("@kentico/gatsby-source-kontent")
const path = require('path')


exports.createSchemaCustomization = async api => {

  const {
    actions: { createTypes },
    schema,
  } = api;

  const type = getKontentItemNodeTypeName("navigation_item")


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
          });

          const urlFragments = [source.elements.slug.value]; // /about/small-gas/subsection/<-
          let parent;
          let currentContextItem = source;

          do {
            parent = allNavigationItems.find(item =>
              item.preferred_language === currentContextItem.preferred_language
              && item.elements["sub_items"].value.includes(currentContextItem.system.codename));

            if (parent) {
              urlFragments.push(parent.elements.slug.value)
              currentContextItem = parent;
            }
          } while (parent)

          urlFragments.reverse();
          // TODO load prefix (/) from layout
          return "/" + urlFragments.join("/");
        }
      }
    }
  });

  createTypes(extendedType)
}