import React from 'react'
import { Link } from 'gatsby'
import ListingItem from './ListingItem'

// A home page block (a div: the template styles every <section> as a flex row): heading, tiles of the newest items, link to the full listing
const LatestItems = ({ title, items, listingPath, listingLabel }) =>
  items.length > 0 ? (
    <div className="latest-items">
      <div className="inner">
        <header className="major">
          <h2>{title}</h2>
        </header>
      </div>
      <section className="tiles">
        {items.map((item) => (
          <ListingItem key={item.system.codename} item={item} />
        ))}
      </section>
      <div className="inner">
        <ul className="actions">
          <li>
            <Link className="button next" to={listingPath}>
              {listingLabel}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  ) : null

export default LatestItems
