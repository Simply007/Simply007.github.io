import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import get from 'lodash.get'

const Header = props => {
  const titleLink = get(props.data, 'elements.title_link.value[0]')
  const menuCaption = get(props.data, 'elements.menu_caption.value', 'Menu')

  const titleText = get(titleLink, 'elements.text.value')
  const titleURL = get(titleLink, 'elements.url.value', '/')
  return (
    <header id="header" className="alt" data-kontent-item-id={props.data.system.id}>
      <Link to={titleURL} className="logo">
        <strong>{titleText}</strong>
      </Link>
      <nav>
        <span
          role="button"
          tabIndex={0}
          className="menu-link"
          onClick={props.onToggleMenu}
          onKeyDown={props.onToggleMenu}
          data-kontent-element-codename="menu"

        >
          {menuCaption}
        </span>
      </nav>
    </header>
  )
}

Header.propTypes = {
  onToggleMenu: PropTypes.func,
}

export default Header
