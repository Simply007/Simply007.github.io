import React from 'react'

const Banner = props => {
  const actions = props.data.elements.cta.value.map(cta => (
    <li key={cta.elements.external_url.value}>
      <a
        href={cta.elements.external_url.value}
        className="button next scrolly"
      >
        <span className={`icon ${cta.elements.icon.value}`}>{cta.elements.title.value}</span>
      </a>
    </li>
  ));

  return (
    <section id="banner" className="major">
      <div className="inner">
        <img src={props.data.elements.profile_photo.value[0].url} alt={props.data.elements.profile_photo.value[0].description} width="150px" />
        <header className="major">
          <h1>{props.data.elements.primary_text.value}</h1>
        </header>
        <div className="content">
          <p>
            {props.data.elements.secondary_text.value}
          </p>
          <ul className="actions">
            {actions}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Banner
