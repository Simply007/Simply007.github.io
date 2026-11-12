import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Banner from '../components/Banner'
import ListingHighlights from '../components/ListingHighlights'
import { pageDescription, pageTitle } from '../utils/seo'
import { highlightsFrom } from '../utils/highlights'

const Home = ({ data, location }) => {
  // Listing highlights come from the home page `sections` linked items in
  // Kontent. Their items are the newest of the chosen types; upcoming ones
  // (released after the build) are left out, and the build time keeps the
  // static HTML and the hydrated page on the same selection.
  const highlights = highlightsFrom(
    data.kontentItemHomePage.elements.sections.value,
    {
      talk: data.allTalks.nodes,
      project: data.allProjects.nodes,
      gotcha: data.allJournal.nodes,
    },
    data.site.buildTime
  )

  return (
    <Layout
      seo={{
        path: location.pathname,
        fullTitle: pageTitle(location.pathname),
        description: pageDescription(location.pathname),
      }}
    >
      <Banner data={data.kontentItemHomePage} />
      <ListingHighlights highlights={highlights} />
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
        sections {
          value {
            __typename
            ... on kontent_item_listing_highlight {
              system {
                codename
              }
              elements {
                title {
                  value
                }
                summary {
                  value
                }
                image {
                  value {
                    url
                    description
                  }
                }
                item_types {
                  value
                }
                item_count {
                  value
                }
                link_label {
                  value
                }
                link_target {
                  value {
                    ... on kontent_item_navigation_item {
                      elements {
                        slug {
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
    allTalks: allKontentItemTalk(
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
    allProjects: allKontentItemProject(
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
    allJournal: allKontentItemGotcha(
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
