import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'

/**
 * Check if there is an intersect in the following Set and array
 * @param {Set<String>} selectedCategories - selected categories
 * @param {Array<String>} itemCategories - categories you want to verify against
 */
const categorySuits = (selectedCategories, itemCategories) => {
  return (
    [...selectedCategories].filter(category =>
      itemCategories.includes(category)
    ).length > 0
  )
}

const ListingPage = ({
  data: {
    kontentItemListingPage: pageData,
    allKontentItem: listingData,
    categories,
  },
}) => {
  const [selectedCategories, setSelectedCategories] = useState(new Set())

  const gotchas = listingData.nodes.filter(
    node =>
      node.__typename === 'kontent_item_gotcha' &&
      node.elements.channel_purpose.value
        .map(i => i.codename)
        .includes('website')
  )

  const journalOverview = gotchas
    .filter(gotcha =>
      selectedCategories.size === 0
        ? true
        : categorySuits(
            selectedCategories,
            gotcha.elements.listing_category.value.map(c => c.codename)
          )
    )
    .map(item => (
      <article
        key={item.elements.url_slug.value}
        data-kontent-item-id={item.system.id}
      >
        <header className="major">
          <h3 data-kontent-element-codename="title">
            {item.elements.title.value}
          </h3>
          <p
            dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
            data-kontent-element-codename="title"
          />
          <ul className="actions">
            <li>
              <Link className="button" to={item.elements.url_slug.value}>
                Learn more
              </Link>
            </li>
          </ul>
        </header>
      </article>
    ))

  const categoriesComponents = categories.terms.map(category => (
    <li key={category.codename}>
      <button
        className={`button${
          selectedCategories.has(category.codename) ? ' toggle' : ''
        }`}
        data-category-codename={category.codename}
        onClick={() =>
          setSelectedCategories(selectedCategories => {
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
    <Layout>
      <BannerLanding
        title={pageData.elements.primary_text.value}
        content={pageData.elements.secondary_text.value}
        heroImage={
          pageData.elements.hero_image.value.length > 0
            ? pageData.elements.hero_image.value[0].localFile.childImageSharp
                .fluid
            : undefined
        }
      />
      <div className="content">
        <div className="inner">
          <header className="major">
            <h2>My Gotchas</h2>
            {categories.terms.length > 0 && (
              <ul className="categories">{categoriesComponents}</ul>
            )}
          </header>
        </div>
        <section className="tiles">{journalOverview}</section>
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
            localFile {
              childImageSharp {
                fluid(quality: 90, maxHeight: 1920) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
        listing_page_options__list_types {
          value
        }
      }
    }
    allKontentItem(filter: { system: { type: { in: $listTypes } } }) {
      nodes {
        system {
          id
        }
        ... on kontent_item_gotcha {
          elements {
            title {
              value
            }
            url_slug {
              value
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
                codename
              }
            }
          }
        }
      }
    }
    categories: kontentTaxonomy(
      system: { codename: { eq: "listing_category" } }
    ) {
      terms {
        name
        codename
      }
    }
  }
`

export default ListingPage
