import React from 'react'
import profilePhoto from '../assets/images/website-icon.png'

const Banner = (props) => (
  <section id="banner" className="major">
    <div className="inner">
      <img src={profilePhoto} alt="Ondřej Chrastina's profile." width="150px" />
      <header className="major">
        <h1>Hi, my name is Ondřej</h1>
      </header>
      <div className="content">
        <p>
          Traveler, tech enthusiastic, open-source lover, and Developer Advocate
          by position.
        </p>
        <ul className="actions">
          <li>
            <a
              href="https://twitter.com/ChrastinaOndrej"
              className="button next scrolly"
            >
              <span className="icon fa-twitter">Follow me!</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
)

export default Banner
