import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const Header = (props) => (
    <header id="header" className="alt">
        <Link to="/" className="logo"><strong>Ondřej Chrastina</strong></Link>
        <nav>
            <span role="button" tabIndex={0} className="menu-link" onClick={props.onToggleMenu} onKeyDown={props.onToggleMenu}>Menu</span>
        </nav>
    </header>
)

Header.propTypes = {
    onToggleMenu: PropTypes.func
}

export default Header
