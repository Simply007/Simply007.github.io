import React from 'react'

const Section = ({ section, isFirst }) => {
  const image =
    section.elements.image.value.length > 0 ? (
      <a
        href={section.elements.cta.value[0].elements.external_url.value}
        className="image"
      >
        <img
          src={section.elements.image.value[0].url}
          alt={
            section.elements.image.value[0].description ||
            section.elements.image.value[0].name
          }
          data-kontent-element-codename="image"
        />
      </a>
    ) : null
  const actions =
    section.elements.cta.value.length > 0
      ? section.elements.cta.value.map(cta => (
          <li key={cta.elements.external_url.value}>
            <a href={cta.elements.external_url.value} className="button">
              <span
                className={
                  cta.elements.icon.value
                    ? `icon ${cta.elements.icon.value}`
                    : undefined
                }
              >
                {cta.elements.title.value}
              </span>
            </a>
          </li>
        ))
      : null

  const header = isFirst ? (
    <h2>{section.elements.header.value}</h2>
  ) : (
    <h3>{section.elements.header.value}</h3>
  )

  return (
    <section
      className={image && 'spotlights'}
      data-kontent-item-id={section.system.id}
    >
      {image}
      <div className="content">
        <div className="inner">
          <header className="major" data-kontent-element-codename="header">
            {header}
          </header>
          <div
            dangerouslySetInnerHTML={{
              __html: section.elements.content.value,
            }}
            data-kontent-element-codename="content"
          />
          <ul
            className="actions"
            style={{ display: 'inline-block' }}
            data-kontent-element-codename="cta"
          >
            {actions}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Section
