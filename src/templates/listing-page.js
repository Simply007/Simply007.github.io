import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import ListingItem from '../components/ListingItem'

/**
 * Check if there is an intersect in the following Set and array
 * @param {Set<String>} selectedCategories - selected categories
 * @param {Array<String>} itemCategories - categories you want to verify against
 */
const categorySuits = (selectedCategories, itemCategories) => {
  return (
    [...selectedCategories].filter((category) =>
      itemCategories.includes(category)
    ).length > 0
  )
}

const getPostItemValue = (item) => (
  (item.__typename === 'kontent_item_project' && item.elements.release_date.value)
  || (item.__typename === 'kontent_item_gotcha' && item.elements.post_date.value)
);

const ListingPage = ({
  data: { kontentItemListingPage: pageData, allKontentItem: listingData },
}) => {
  const [selectedCategories, setSelectedCategories] = useState(new Set())

  const gotchas = listingData.nodes.filter(
    (node) =>
      node.__typename === 'kontent_item_gotcha' &&
      node.elements.channel_purpose.value
        .map((i) => i.codename)
        .includes('website')
  )

  const projects = listingData.nodes.filter(
    (node) =>
      node.__typename === 'kontent_item_project' &&
      node.elements.channel_purpose.value
        .map((i) => i.codename)
        .includes('website')
  )

  const items = gotchas.concat(projects)

  const allCategories = {}
  for (const item of items) {
    for (const itemCategory of item.elements.listing_category.value) {
      allCategories[itemCategory.codename] = itemCategory
    }
  }

  const allItems = items.filter((item) =>
    selectedCategories.size === 0
      ? true
      : categorySuits(
        selectedCategories,
        item.elements.listing_category.value.map((c) => c.codename)
      )
  )

  const listingOverview = allItems
    .filter((item) =>
      selectedCategories.size === 0
        ? true
        : categorySuits(
          selectedCategories,
          item.elements.listing_category.value.map((c) => c.codename)
        )
    )
    .sort((a, b) => {
      const left = getPostItemValue(a);
      const right = getPostItemValue(b);

      if (left && right) {
        return new Date(right) - new Date(left)
      }
      else
        return 0;
    })
    .map((item) => <ListingItem key={item.system.codename} item={item} />)

  const categories = Object.values(allCategories)
  const categoriesComponents = categories.map((category) => (
    <li key={category.codename}>
      <button
        className={`button${selectedCategories.has(category.codename) ? ' toggle' : ''
          }`}
        data-category-codename={category.codename}
        onClick={() =>
          setSelectedCategories((selectedCategories) => {
            if (selectedCategories.has(category.codename)) {
              const result = new Set(selectedCategories)
              result.delete(category.codename)
              return result
            } else {
              return new Set(selectedCategories.add(category.codename))
            }
          })
        }
      >
        {category.name}
      </button>
    </li>
  ))

  categoriesComponents.unshift(
    <li key="#ALL">
      <button
        onClick={() => setSelectedCategories(new Set())}
        className={`button${selectedCategories.size === 0
          ? ' disabled toggle'
          : ' icon fa-times-circle'
          }`}
      >
        {selectedCategories.size === 0 ? 'ALL' : 'CLEAR'}
      </button>
    </li>
  )

  return (
    <Layout>
      <BannerLanding
        title={pageData.elements.primary_text.value}
        content={pageData.elements.secondary_text.value}
        heroImage={
          pageData.elements.hero_image.value.length > 0
            ? pageData.elements.hero_image.value[0]
            : undefined
        }
      />
      <div className="content">
        {categories.length > 0 && (
          <div className="inner">
            <header className="major">
              <h2>Categories</h2>
              <ul className="categories">{categoriesComponents}</ul>
            </header>
          </div>
        )}
        <section className="tiles">{listingOverview}</section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query listingQuery(
    $language: String!
    $codename: String!
    $listTypes: [String]!
  ) {
    kontentItemListingPage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      elements {
        primary_text {
          value
        }
        secondary_text {
          value
        }
        hero_image {
          value {
            name
            url
            width
            height
            description
          }
        }
        listing_page_options__list_types {
          value
        }
      }
    }
    allKontentItem(filter: { system: { type: { in: $listTypes } } }) {
      nodes {
        __typename
        system {
          id
          codename
        }
        ... on kontent_item_gotcha {
          elements {
            title {
              value
            }
            url_slug {
              value
            }
            image {
              value {
                url
              }
            }
            summary {
              value
            }
            post_date {
              value
            }
            channel_purpose {
              value {
                codename
              }
            }
            listing_category {
              value {
                name
                codename
              }
            }
          }
        }
        ... on kontent_item_project {
          elements {
            title {
              value
            }
            url_slug {
              value
            }
            release_date {
              value
            }
            image {
              value {
                url
              }
            }
            summary {
              value
            }
            channel_purpose {
              value {
                codename
              }
            }
            listing_category {
              value {
                name
                codename
              }
            }
          }
        }
      }
    }
  }
`

export default ListingPage
