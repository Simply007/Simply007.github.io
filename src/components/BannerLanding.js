import React from 'react'
import { Link } from 'gatsby'
import { ImageElement } from '@kontent-ai/gatsby-components'

const BannerLanding = (props) => (
  <section
    id="banner"
    data-kontent-item-id={props.itemId}
    className={`style${Math.floor(Math.random() * 6) + 1}`}
  >
    {props.heroImage && (
      <ImageElement
        image={props.heroImage}
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
        <h1 data-kontent-element-codename={props.titleCodename}>
          {props.title}
        </h1>
      </header>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: props.content }}
        data-kontent-element-codename={props.contentCodename}
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
