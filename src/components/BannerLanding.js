import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

const BannerLanding = props => (
  <section id="banner" className={`style${Math.floor(Math.random() * 6) + 1}`}>
    {props.heroImage && (
      <Img
        fluid={props.heroImage}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        imgStyle={{
          objectPosition: '75% 25%',
        }}
      />
    )}

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
