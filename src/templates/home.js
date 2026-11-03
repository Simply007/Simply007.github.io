import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Banner from '../components/Banner'
import LatestItems from '../components/LatestItems'
import { pageDescription, pageTitle } from '../utils/seo'

const LATEST_COUNT = 3

// Upcoming talks (release date after the build) are not "latest" yet
const notInFuture = (date) => !date || new Date(date) <= new Date()

const Home = ({ data, location }) => {
  const latestTalks = data.latestTalks.nodes
    .filter((talk) => notInFuture(talk.elements.release_date.value))
    .slice(0, LATEST_COUNT)
  const latestJournal = data.latestJournal.nodes.slice(0, LATEST_COUNT)

  return (
    <Layout
      seo={{
        path: location.pathname,
        fullTitle: pageTitle(location.pathname),
        description: pageDescription(location.pathname),
      }}
    >
      <Banner data={data.kontentItemHomePage} />
      <div className="latest">
        <LatestItems
          title="Latest talks"
          items={latestTalks}
          listingPath="/talks/"
          listingLabel="All talks"
        />
        <LatestItems
          title="Latest from the journal"
          items={latestJournal}
          listingPath="/journal/"
          listingLabel="All journal posts"
        />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query HomePageQuery($language: String!, $codename: String!) {
    kontentItemHomePage(
      preferred_language: { eq: $language }
      system: { codename: { eq: $codename } }
    ) {
      system {
        id
      }
      elements {
        profile_photo {
          value {
            name
            url
            width
            height
            description
          }
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
        primary_text {
          value
        }
        secondary_text {
          value
        }
        cta {
          value {
            ... on kontent_item_button {
              elements {
                icon {
                  value
                }
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
                      }
                    }
                    ... on kontent_item_project {
                      elements {
                        url_slug {
                          value
                        }
                      }
                    }
                    ... on kontent_item_gotcha {
                      elements {
                        url_slug {
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
      }
    }
    latestTalks: allKontentItemTalk(
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
      limit: 6
    ) {
      nodes {
        __typename
        system {
          id
          codename
        }
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
          release_date {
            value
          }
        }
      }
    }
    latestJournal: allKontentItemGotcha(
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
      limit: 3
    ) {
      nodes {
        __typename
        system {
          id
          codename
        }
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
        }
      }
    }
  }
`

export default Home
