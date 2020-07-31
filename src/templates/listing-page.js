import React from 'react'
import { graphql, Link } from 'gatsby'
import Layout from '../components/layout'
import BannerLanding from '../components/BannerLanding'

const ListingPage = ({
  data: { kontentItemListingPage: pageData, allKontentItem: listingData },
}) => {
  const journalItems = listingData.nodes.filter(
    node =>
      node.__typename === 'kontent_item_journal_item' &&
      node.elements.channel_purpose.value
        .map(i => i.codename)
        .includes('website')
  )

  const journalOverview = journalItems.map(item => (
    <article key={item.elements.url_slug.value}>
      <header class="major">
        <h3>{item.elements.title.value}</h3>
        <p dangerouslySetInnerHTML={{ __html: item.elements.summary.value }} />
        <ul class="actions">
          <li>
            <Link class="button" to={item.elements.url_slug.value}>
              Learn more
            </Link>
          </li>
        </ul>
      </header>
    </article>
  ))

  return (
    <Layout>
      <BannerLanding
        title={pageData.elements.primary_text.value}
        content={pageData.elements.secondary_text.value}
      />
      <div className="content">
        <div class="inner">
          <header class="major">
            <h2>My Gotchas</h2>
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
        list_types {
          value
        }
      }
    }
    allKontentItem(filter: { system: { type: { in: $listTypes } } }) {
      nodes {
        ... on kontent_item_journal_item {
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
          }
        }
      }
    }
  }
`

export default ListingPage
