import React from 'react'
import { ImageElement } from '@kontent-ai/gatsby-components'

const Banner = (props) => {
  const actions = props.data.elements.cta.value.map((cta) => (
    <li key={cta.elements.external_url.value}>
      <a href={cta.elements.external_url.value} className="button next scrolly">
        <span className={`icon ${cta.elements.icon.value}`}>
          {cta.elements.title.value}
        </span>
      </a>
    </li>
  ))

  return (
    <section
      id="banner"
      className="major"
      data-kontent-item-id={props.data.system.id}
    >
      {props.data.elements.hero_image.value.length > 0 && (
        <ImageElement
          image={props.data.elements.hero_image.value[0]}
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
        {props.data.elements.profile_photo.value.length > 0 && (
          <div
            data-kontent-element-codename="profile_photo"
            style={{ display: 'inline-block' }}
          >
            <ImageElement
              image={props.data.elements.profile_photo.value[0]}
              style={{
                position: 'relative',
                width: '150px',
                height: '150px',
              }}
              data-kontent-element-codename="profile_photo"
            />
          </div>
        )}
        <header className="major">
          <h1 data-kontent-element-codename="primary_text">
            {props.data.elements.primary_text.value}
          </h1>
        </header>
        <div className="content">
          <p data-kontent-element-codename="secondary_text">
            {props.data.elements.secondary_text.value}
          </p>
          <ul className="actions" data-kontent-element-codename="cta">
            {actions}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Banner
