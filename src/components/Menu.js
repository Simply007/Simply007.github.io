import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const Menu = props => {
  let menuItems =
    props.data &&
    props.data.map(menuItem => (
      <li key={menuItem.url}>
        {menuItem.elements.external_url.value ? (
          <a
            onClick={props.onToggleMenu}
            href={menuItem.elements.external_url.value || menuItem.url}
            className="button special"
          >
            {menuItem.elements.title.value}
          </a>
        ) : (
            <Link onClick={props.onToggleMenu} to={menuItem.url}>
              {menuItem.elements.title.value}
            </Link>
          )}
      </li>
    ))

  return (
    <nav id="menu" data-kontent-item-id={props["data-kontent-item-id"]} >
      <div className="inner" data-kontent-element-codename="menu">
        <ul className="links">
          {menuItems}
        </ul>
      </div>
      <span
        role="button"
        tabIndex={0}
        className="close"
        onClick={props.onToggleMenu}
        onKeyDown={props.onToggleMenu}
      >
        Close
      </span>
    </nav>
  )
}

Menu.propTypes = {
  onToggleMenu: PropTypes.func,
}

export default Menu
