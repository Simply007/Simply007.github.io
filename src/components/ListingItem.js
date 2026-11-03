import { Link } from 'gatsby'
import React from 'react'
import { itemPath } from '../utils/paths'

// Tiles are at most about half the content width: request a resized, modern format
// image from the Kontent.ai image API instead of the full-size original
const tileImageUrl = (url) => `${url}?w=600&q=60&auto=format`

// "Learn more" alone is not descriptive for screen readers and search engines
const LearnMore = ({ to, title }) => (
  <Link className="button next" to={to}>
    Learn more<span className="visually-hidden"> about {title}</span>
  </Link>
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
            <h3 data-kontent-element-codename="title">
              <a href={itemPath(item)}>{item.elements.title.value}</a>
            </h3>
            <i className="" data-kontent-element-codename="post_date">
              {new Date(item.elements.post_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <ul className="actions">
              <li>
                <LearnMore
                  to={itemPath(item)}
                  title={item.elements.title.value}
                />
              </li>
            </ul>
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
            <h3 data-kontent-element-codename="title">
              <a href={itemPath(item)}>{item.elements.title.value}</a>
            </h3>
            <i className="" data-kontent-element-codename="release_date">
              {new Date(item.elements.release_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <ul className="actions">
              <li>
                <LearnMore
                  to={itemPath(item)}
                  title={item.elements.title.value}
                />
              </li>
            </ul>
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
            <h3 data-kontent-element-codename="title">
              <a href={itemPath(item)}>{item.elements.title.value}</a>
            </h3>
            <i className="" data-kontent-element-codename="release_date">
              {new Date(item.elements.release_date.value).toDateString()}
            </i>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <ul className="actions">
              <li>
                <LearnMore
                  to={itemPath(item)}
                  title={item.elements.title.value}
                />
              </li>
            </ul>
          </header>
        </article>
      )
    }
    default:
      break
  }
}

export default ListingItem
