import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const Menu = props => {
  let menuItems =
    props.data &&
    props.data.map(menuItem => (
      <li key={menuItem.url}>
        {/* TODO - do not use Link for external URLs */}
        <Link
          onClick={props.onToggleMenu}
          to={menuItem.elements.external_url.value || menuItem.url}
          className={
            menuItem.elements.external_url.value ? 'button special' : ''
          }
        >
          {menuItem.elements.title.value}
        </Link>
      </li>
    ))

  if (!props.data) {
    menuItems = (
      <>
        <li>
          <Link onClick={props.onToggleMenu} to="/">
            Home
          </Link>
        </li>
        <li>
          <Link onClick={props.onToggleMenu} to="/pwas">
            PWA series
          </Link>
        </li>
      </>
    )
  }

  return (
    <nav id="menu">
      <div className="inner">
        <ul className="links">
          {menuItems}
          {/* <li><Link onClick={props.onToggleMenu} to="/generic">Generic</Link></li>
                <li><Link onClick={props.onToggleMenu} to="/elements">Elements</Link></li> */}
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