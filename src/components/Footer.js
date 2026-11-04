import React from 'react'

const Footer = (props) => {
  const icons = props.data.elements.social_media_accounts.value.map(
    (social_media_account) => {
      const handle = social_media_account.elements.account_handle.value
      const mediaType = social_media_account.elements.social_media_type.value[0]
      const url = mediaType.elements.account_pattern.value.replace('%s', handle)
      // Font Awesome 5 has no icon for some profiles (Bluesky, HackerNoon):
      // their social media type carries an Account Icon asset instead
      const iconCode = mediaType.elements.account_icon_code.value
      const iconAsset =
        !iconCode &&
        mediaType.elements.account_icon &&
        mediaType.elements.account_icon.value[0]
      return (
        <li key={url}>
          <a
            href={url}
            className={`icon alt ${iconAsset ? 'icon-asset' : iconCode}`}
            style={
              iconAsset
                ? { '--icon-url': `url("${iconAsset.url}")` }
                : undefined
            }
            aria-label={mediaType.elements.label.value}
          >
            <span className="label">{mediaType.elements.label.value}</span>
          </a>
        </li>
      )
    }
  )

  // Extend the CMS copyright year into a range ending at the build year
  const currentYear = new Date().getFullYear()
  const footerHtml = props.data.elements.footer_text.value.replace(
    /\b(20\d{2})\b/,
    (year) => (Number(year) < currentYear ? `${year}-${currentYear}` : year)
  )

  return (
    <footer id="footer" data-kontent-item-id={props.footerItemId}>
      <div className="inner">
        <ul
          className="icons"
          data-kontent-element-codename="social_media_accounts"
        >
          {icons}
        </ul>
        <div
          className="copyright"
          dangerouslySetInnerHTML={{
            __html: footerHtml,
          }}
          data-kontent-element-codename="footer_text"
        ></div>
      </div>
    </footer>
  )
}

export default Footer
