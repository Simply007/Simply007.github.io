import { Link } from 'gatsby'
import React from 'react'

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
                ? `url("${item.elements.image.value[0].url}")`
                : 'initial',
          }}
        >
          <header className="major">
            <h3 data-kontent-element-codename="title">
              {item.elements.title.value}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <ul className="actions">
              <li>
                <Link className="button next" to={item.elements.url_slug.value}>
                  Learn more
                </Link>
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
                ? `url("${item.elements.image.value[0].url}")`
                : 'initial',
            backgroundOpacity: '0.2',
          }}
        >
          <header className="major">
            <h3 data-kontent-element-codename="title">
              {item.elements.title.value}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
              data-kontent-element-codename="summary"
              className="summary"
            />
            <ul className="actions">
              <li>
                <Link className="button next" to={item.elements.url_slug.value}>
                  Learn more
                </Link>
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
