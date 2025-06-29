import React from 'react'

const Footer = (props) => {
  const icons = props.data.elements.social_media_accounts.value.map(
    (social_media_account) => {
      const handle = social_media_account.elements.account_handle.value
      const mediaType = social_media_account.elements.social_media_type.value[0]
      const url = mediaType.elements.account_pattern.value.replace('%s', handle)
      return (
        <li key={url}>
          <a
            href={url}
            className={`icon alt ${mediaType.elements.account_icon_code.value}`}
          >
            <span className="label">{mediaType.elements.label.value}</span>
          </a>
        </li>
      )
    }
  )

  return (
    <footer id="footer" data-kontent-item-id={props.footerItemId}>
      <div className="inner">
        <ul
          className="icons"
          data-kontent-element-codename="social_media_accounts"
          data-kontent-add-button
          data-kontent-render-position="right"
          data-kontent-insert-position="end"
        >
          {icons}
        </ul>
        <ul
          className="copyright"
          dangerouslySetInnerHTML={{
            __html: props.data.elements.footer_text.value,
          }}
          data-kontent-element-codename="footer_text"
        ></ul>
      </div>
    </footer>
  )
}

export default Footer
