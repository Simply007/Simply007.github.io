import { Link } from 'gatsby'
import React from 'react'

const ListingItem = ({ item }) => {
  debugger;
  const itemType = item.__typename;

  debugger;
  switch (itemType) {
    case "kontent_item_gotcha":
      return (
        <article
          key={item.elements.url_slug.value}
          data-kontent-item-id={item.system.id}
        >
          <header className="major">
            <h3 data-kontent-element-codename="title">{item.elements.title.value}</h3>
            <div
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
      );

    case "kontent_item_project": {
      return (<h1>TODO</h1>
      );
    }
    default:
      break;
  }


}

export default ListingItem
