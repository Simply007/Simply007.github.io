import React from 'react'
import { Link } from 'gatsby'

const BannerLanding = props => (
  <section
    id="banner"
    className={`style${Math.floor(Math.random() * 6) + 1} alt`}
  >
    <div className="inner">
      <header className="major">
        <h1>{props.title}</h1>
      </header>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: props.content }}
      ></div>
      {props.button && (
        <div className="content">
          <Link
            className="button icon fa-angle-double-left"
            to={props.button.to}
          >
            {props.button.title}
          </Link>
        </div>
      )}
    </div>
  </section>
)

export default BannerLanding
