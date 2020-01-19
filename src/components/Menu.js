import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

const Menu = (props) => (
    <nav id="menu">
        <div className="inner">
            <ul className="links">
                <li><Link onClick={props.onToggleMenu} to="/">Home</Link></li>
                <li><Link onClick={props.onToggleMenu} to="/pwas">PWA series</Link></li>
                {/* <li><Link onClick={props.onToggleMenu} to="/generic">Generic</Link></li>
                <li><Link onClick={props.onToggleMenu} to="/elements">Elements</Link></li> */}
            </ul>
            <ul className="actions vertical">
                <li><a href="https://github.com/Simply007" className="button special fit">GitHub</a></li>
            </ul>
        </div>
        <span role="button" tabIndex={0} className="close" onClick={props.onToggleMenu} onKeyDown={props.onToggleMenu}>Close</span>
    </nav>
)

Menu.propTypes = {
    onToggleMenu: PropTypes.func
}

export default Menu
