import React from 'react'
import { Link } from 'gatsby'
import { itemPath } from '../utils/paths'

// Listing highlights (Landing page type), the home page sections from the
// Kontent "Listing highlight" items: one band per highlight with a photo, the
// title, a short summary, the newest items as a list with thumbnails and an
// optional "See all" link. Props come from `highlightsFrom()` in
// src/utils/highlights.js: { key, title, summary, photo, photoAlt, items,
// link: { label, path } | null }. Nothing renders without highlights.
// Styles: `.listing-highlights` in _tiles.scss; the accent follows the
// position (`listing-highlight-accent-1` to `-6`).

const ACCENTS = 6

const itemDate = (item) =>
  (item.elements.release_date || item.elements.post_date || {}).value

const formatDate = (value) => (value ? new Date(value).toDateString() : '')

const Photo = ({ highlight }) => {
  const img = <img src={highlight.photo} alt={highlight.photoAlt} />
  return highlight.link ? (
    <Link to={highlight.link.path} className="image">
      {img}
    </Link>
  ) : (
    <div className="image">{img}</div>
  )
}

const ListingHighlights = ({ highlights }) =>
  highlights && highlights.length > 0 ? (
    <div id="main" className="listing-highlights">
      {highlights.map((highlight, index) => (
        <section
          key={highlight.key}
          className={`spotlights listing-highlight-accent-${
            (index % ACCENTS) + 1
          }`}
        >
          {highlight.photo && <Photo highlight={highlight} />}
          <div className="content">
            <div className="inner">
              <header className="major">
                <h2>{highlight.title}</h2>
              </header>
              {highlight.summary && <p>{highlight.summary}</p>}
              {highlight.items.length > 0 && (
                <ul className="alt listing-highlight-items">
                  {highlight.items.map((item) => (
                    <li key={item.system.codename}>
                      <Link
                        to={itemPath(item)}
                        className="listing-highlight-thumb"
                        tabIndex={-1}
                      >
                        {item.elements.image.value[0] && (
                          <img
                            src={`${item.elements.image.value[0].url}?w=192&h=120&fit=crop`}
                            alt=""
                          />
                        )}
                      </Link>
                      <span>
                        <Link to={itemPath(item)}>
                          {item.elements.title.value}
                        </Link>
                        <br />
                        <small>{formatDate(itemDate(item))}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {highlight.link && (
                <p className="listing-highlight-see-all">
                  <Link to={highlight.link.path}>{highlight.link.label} →</Link>
                </p>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  ) : null

export default ListingHighlights
