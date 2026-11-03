import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'
import ListingItem from '../components/ListingItem'
import { pageDescription } from '../utils/seo'
import { parseCategories, buildSearch } from '../utils/category-filter'

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

const getPostItemValue = (item) =>
  (item.__typename === 'kontent_item_project' &&
    item.elements.release_date.value) ||
  (item.__typename === 'kontent_item_talk' &&
    item.elements.release_date.value) ||
  (item.__typename === 'kontent_item_gotcha' && item.elements.post_date.value)

const ListingPage = ({
  data: { kontentItemListingPage: pageData, allKontentItem: listingData },
  location,
}) => {
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false)

  // Read the selection from the URL after hydration (the static HTML has none)
  useEffect(() => {
    const fromUrl = parseCategories(location.search)
    setSelectedCategories(fromUrl)
    if (fromUrl.size > 0) setIsCategoriesExpanded(true)
  }, [location.search])

  // Update the selection and mirror it into the URL, without a navigation or scroll jump
  const updateSelection = (nextCategories) => {
    setSelectedCategories(nextCategories)
    if (typeof window === 'undefined') return
    const search = buildSearch(window.location.search, nextCategories)
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${search}${window.location.hash}`
    )
  }

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

  const talks = listingData.nodes.filter(
    (node) =>
      node.__typename === 'kontent_item_talk' &&
      node.elements.channel_purpose.value
        .map((i) => i.codename)
        .includes('website')
  )

  const items = gotchas.concat(projects).concat(talks)

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
    .sort((a, b) => {
      const left = getPostItemValue(a)
      const right = getPostItemValue(b)

      if (left && right) {
        return new Date(right) - new Date(left)
      } else return 0
    })
    .map((item) => <ListingItem key={item.system.codename} item={item} />)

  const categories = Object.values(allCategories)
  const categoriesComponents = categories.map((category) => (
    <li key={category.codename}>
      <button
        className={`button${
          selectedCategories.has(category.codename) ? ' toggle' : ''
        }`}
        data-category-codename={category.codename}
        onClick={() => {
          const result = new Set(selectedCategories)
          if (result.has(category.codename)) {
            result.delete(category.codename)
          } else {
            result.add(category.codename)
          }
          updateSelection(result)
        }}
      >
        {category.name}
      </button>
    </li>
  ))

  categoriesComponents.unshift(
    <li key="#ALL">
      <button
        onClick={() => updateSelection(new Set())}
        className={`button${
          selectedCategories.size === 0
            ? ' disabled toggle'
            : ' icon fa-times-circle'
        }`}
      >
        {selectedCategories.size === 0 ? 'ALL' : 'CLEAR'}
      </button>
    </li>
  )

  return (
    <Layout
      seo={{
        title: pageData.elements.primary_text.value,
        path: location.pathname,
        description: pageDescription(location.pathname),
      }}
    >
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
          <div className="categories-wrapper">
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              aria-expanded={isCategoriesExpanded}
              aria-controls="categories-list"
              className="button categories-toggle"
            >
              Categories
              {selectedCategories.size > 0 && ` (${selectedCategories.size})`}
              <span
                className={`icon fa-chevron-${isCategoriesExpanded ? 'up' : 'down'}`}
                aria-hidden="true"
              ></span>
            </button>
            <ul
              id="categories-list"
              className={`categories${isCategoriesExpanded ? ' expanded' : ' collapsed'}`}
              aria-hidden={!isCategoriesExpanded}
            >
              {categoriesComponents}
            </ul>
          </div>
        )}
        {listingOverview.length > 0 ? (
          <section className="tiles">{listingOverview}</section>
        ) : (
          <div className="inner categories-empty" role="status">
            <p>No entries match the selected categories.</p>
            <button
              className="button icon fa-times-circle"
              onClick={() => updateSelection(new Set())}
            >
              Show all
            </button>
          </div>
        )}
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
        ... on kontent_item_talk {
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
