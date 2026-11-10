import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Banner from '../components/Banner'
import LatestItems from '../components/LatestItems'
import { pageDescription, pageTitle } from '../utils/seo'
import { sectionPath } from '../utils/paths'
import { latestReleased } from '../utils/latest'

const LATEST_COUNT = 2

const Home = ({ data, location }) => {
  // Upcoming talks (released after the build) are not "latest" yet. The build
  // time keeps the static HTML and the hydrated page on the same selection.
  const latestTalks = latestReleased(
    data.latestTalks.nodes,
    (talk) => talk.elements.release_date.value,
    data.site.buildTime,
    LATEST_COUNT
  )
  const latestProjects = latestReleased(
    data.latestProjects.nodes,
    (project) => project.elements.release_date.value,
    data.site.buildTime,
    LATEST_COUNT
  )
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
          listingPath={sectionPath('talk')}
          listingLabel="All talks"
        />
        <LatestItems
          title="Latest projects"
          items={latestProjects}
          listingPath={sectionPath('project')}
          listingLabel="All projects"
        />
        <LatestItems
          title="Latest from the journal"
          items={latestJournal}
          listingPath={sectionPath('gotcha')}
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
    site {
      buildTime
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
    latestProjects: allKontentItemProject(
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
      limit: 2
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
