import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import ListingHighlights from '../../components/ListingHighlights'

import pic01 from '../../assets/images/style-guide/pic01.jpg'
import pic02 from '../../assets/images/style-guide/pic02.jpg'
import pic03 from '../../assets/images/style-guide/pic03.jpg'
import pic04 from '../../assets/images/style-guide/pic04.jpg'
import pic05 from '../../assets/images/style-guide/pic05.jpg'
import pic06 from '../../assets/images/style-guide/pic06.jpg'

// Sample items shaped like the Kontent talk, project and gotcha nodes the
// home page queries
const item = (typename, slug, title, date, image) => ({
  __typename: typename,
  system: { codename: `${typename}_${slug}` },
  elements: {
    title: { value: title },
    url_slug: { value: slug },
    [typename === 'kontent_item_gotcha' ? 'post_date' : 'release_date']: {
      value: date,
    },
    image: { value: [{ url: image }] },
  },
})

const highlights = [
  {
    key: 'talks',
    title: 'I speak',
    summary: 'Section summary: one short sentence about the talks.',
    photo: pic01,
    photoAlt: '',
    items: [
      item(
        'kontent_item_talk',
        'talk-one',
        'The newest talk',
        '2026-11-10',
        pic02
      ),
      item(
        'kontent_item_talk',
        'talk-two',
        'A talk with a longer title that wraps to a second line',
        '2026-10-21',
        pic03
      ),
      item(
        'kontent_item_talk',
        'talk-three',
        'The third talk',
        '2026-09-29',
        pic04
      ),
    ],
    link: { label: 'See all talks', path: '/talks/' },
  },
  {
    key: 'projects',
    title: 'I Code',
    summary: 'Section summary: one short sentence about the projects.',
    photo: pic05,
    photoAlt: '',
    items: [
      item(
        'kontent_item_project',
        'project-one',
        'The newest project',
        '2026-11-10',
        pic06
      ),
      item(
        'kontent_item_project',
        'project-two',
        'Another project',
        '2026-11-10',
        pic01
      ),
      item(
        'kontent_item_project',
        'project-three',
        'The third project',
        '2026-09-17',
        pic02
      ),
    ],
    link: { label: 'See all projects', path: '/projects/' },
  },
  {
    key: 'journal',
    title: 'I write',
    summary: 'Section summary: one short sentence about the journal.',
    photo: pic03,
    photoAlt: '',
    items: [
      item(
        'kontent_item_gotcha',
        'post-one',
        'The newest journal post',
        '2025-06-23',
        pic04
      ),
      item(
        'kontent_item_gotcha',
        'post-two',
        'Another journal post',
        '2025-02-18',
        pic05
      ),
      item(
        'kontent_item_gotcha',
        'post-three',
        'The third journal post',
        '2025-02-17',
        pic06
      ),
    ],
    // No link label or target in Kontent: the link is not shown
    link: null,
  },
]

const ListingHighlightsStyleGuide = () => (
  <Layout>
    <Helmet>
      <title>Listing highlights - style guide</title>
      <meta name="description" content="Listing highlights showcase" />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <ListingHighlights highlights={highlights} />
  </Layout>
)

export default ListingHighlightsStyleGuide
