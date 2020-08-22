import React from 'react'
import Img from 'gatsby-image'

const Banner = props => {
  const actions = props.data.elements.cta.value.map(cta => (
    <li key={cta.elements.external_url.value}>
      <a href={cta.elements.external_url.value} className="button next scrolly">
        <span className={`icon ${cta.elements.icon.value}`}>
          {cta.elements.title.value}
        </span>
      </a>
    </li>
  ))

  return (
    <section id="banner" className="major">
      {props.data.elements.hero_image.value.length > 0 &&
        <Img
          fluid={
            props.data.elements.hero_image.value[0].localFile.childImageSharp
              .fluid
          }
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
      }
      <div className="inner">

        {props.data.elements.profile_photo.value.length > 0 &&
          <Img
            fluid={props.data.elements.profile_photo.value[0].localFile.childImageSharp.fluid
            }
            style={{
              position: 'relative',
              width: '150px', 
              height: '150px'}} />
        }
        <header className="major">
          <h1>{props.data.elements.primary_text.value}</h1>
        </header>
        <div className="content">
          <p>{props.data.elements.secondary_text.value}</p>
          <ul className="actions">{actions}</ul>
        </div>
      </div>
    </section>
  )
}

export default Banner
