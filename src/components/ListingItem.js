import { Link } from 'gatsby'
import React from 'react'
import { itemPath } from '../utils/paths'

// Tiles are at most about half the content width: request a resized, modern format
// image from the Kontent.ai image API instead of the full-size original
const tileImageUrl = (url) => `${url}?w=600&q=60&auto=format`

// "Learn more" alone is not descriptive for screen readers and search engines.
// Rendered only when the item has a detail page (an item without a slug is
// still listed, but must not pass an undefined destination to Link).
const LearnMore = ({ to, title }) =>
  to ? (
    <ul className="actions">
      <li>
        <Link className="button next" to={to}>
          Learn more<span className="visually-hidden"> about {title}</span>
        </Link>
      </li>
    </ul>
  ) : null

// Tile title: a link to the detail page, or plain text when there is none
const TileTitle = ({ to, title }) => (
  <h3 data-kontent-element-codename="title">
    {to ? <a href={to}>{title}</a> : title}
  </h3>
)

const ListingItem = ({ item }) => {
  const itemType = item.__typename

  switch (itemType) {
    case 'kontent_item_gotcha':
      return (
        <article
          key={item.elements.url_slug.value}
          data-kontent-item-id={item.system.id}
          style={{
            backgroundImage:
              item.elements.image && item.elements.image.value.length > 0
                ? `url("${tileImageUrl(item.elements.image.value[0].url)}")`
                : 'initial',
          }}
        >
          <header className="major">
            <TileTitle to={itemPath(item)} title={item.elements.title.value} />
            <i className="" data-kontent-element-codename="post_date">
              {new Date(item.elements.post_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <LearnMore to={itemPath(item)} title={item.elements.title.value} />
          </header>
        </article>
      )

    case 'kontent_item_project': {
      return (
        <article
          key={item.elements.url_slug.value}
          data-kontent-item-id={item.system.id}
          style={{
            backgroundImage:
              item.elements.image && item.elements.image.value.length > 0
                ? `url("${tileImageUrl(item.elements.image.value[0].url)}")`
                : 'initial',
            backgroundOpacity: '0.2',
          }}
        >
          <header className="major">
            <TileTitle to={itemPath(item)} title={item.elements.title.value} />
            <i className="" data-kontent-element-codename="release_date">
              {new Date(item.elements.release_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <LearnMore to={itemPath(item)} title={item.elements.title.value} />
          </header>
        </article>
      )
    }
    case 'kontent_item_talk': {
      return (
        <article
          key={item.elements.url_slug.value}
          data-kontent-item-id={item.system.id}
          style={{
            backgroundImage:
              item.elements.image && item.elements.image.value.length > 0
                ? `url("${tileImageUrl(item.elements.image.value[0].url)}")`
                : 'initial',
            backgroundOpacity: '0.2',
          }}
        >
          <header className="major">
            <TileTitle to={itemPath(item)} title={item.elements.title.value} />
            <i className="" data-kontent-element-codename="release_date">
              {new Date(item.elements.release_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <LearnMore to={itemPath(item)} title={item.elements.title.value} />
          </header>
        </article>
      )
    }
    default:
      break
  }
}

export default ListingItem
