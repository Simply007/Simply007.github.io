import { Link } from 'gatsby'
import React from 'react'

const ListingItem = ({ item }) => (
  <article
    key={item.elements.url_slug.value}
    data-kontent-item-id={item.system.id}
  >
    <header className="major">
      <h3 data-kontent-element-codename="title">{item.elements.title.value}</h3>
      <p
        dangerouslySetInnerHTML={{ __html: item.elements.summary.value }}
        data-kontent-element-codename="title"
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

export default ListingItem
