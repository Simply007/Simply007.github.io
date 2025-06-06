import React from 'react'
import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'

import pic01 from '../../assets/images/style-guide/pic01.jpg'
import pic02 from '../../assets/images/style-guide/pic02.jpg'
import pic03 from '../../assets/images/style-guide/pic03.jpg'
import pic04 from '../../assets/images/style-guide/pic04.jpg'
import pic05 from '../../assets/images/style-guide/pic05.jpg'
import pic06 from '../../assets/images/style-guide/pic06.jpg'
import profilePhoto from '../../assets/images/website-icon.png'

class HomeIndex extends React.Component {
  render() {
    return (
      <Layout>
        <Helmet
          title="Ondřej Chrastina"
          meta={[
            {
              name: 'description',
              content: "Ondřej Chrastina's personal site",
            },
            { name: 'keywords', content: 'personal site, Ondřej Chrastina' },
          ]}
        >
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <section id="banner" className="major">
          <div className="inner">
            <img
              src={profilePhoto}
              alt="Ondřej Chrastina's profile."
              width="150px"
            />
            <header className="major">
              <h1>Hi, my name is Ondřej</h1>
            </header>
            <div className="content">
              <p>
                Traveler, tech enthusiastic, open-source lover, and Developer
                Advocate by position.
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
        <div id="main">
          <section id="one" className="tiles">
            <article style={{ backgroundImage: `url(${pic01})` }}>
              <header className="major">
                <h3>Aliquam</h3>
                <p>Ipsum dolor sit amet</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
            <article style={{ backgroundImage: `url(${pic02})` }}>
              <header className="major">
                <h3>Tempus</h3>
                <p>feugiat amet tempus</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
            <article style={{ backgroundImage: `url(${pic03})` }}>
              <header className="major">
                <h3>Magna</h3>
                <p>Lorem etiam nullam</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
            <article style={{ backgroundImage: `url(${pic04})` }}>
              <header className="major">
                <h3>Ipsum</h3>
                <p>Nisl sed aliquam</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
            <article style={{ backgroundImage: `url(${pic05})` }}>
              <header className="major">
                <h3>Consequat</h3>
                <p>Ipsum dolor sit amet</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
            <article style={{ backgroundImage: `url(${pic06})` }}>
              <header className="major">
                <h3>Etiam</h3>
                <p>Feugiat amet tempus</p>
              </header>
              <Link to="/style-guide/section" className="link primary"></Link>
            </article>
          </section>
          <section id="two">
            <div className="inner">
              <header className="major">
                <h2>Massa libero</h2>
              </header>
              <p>
                Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
                libero. Mauris aliquet magna magna sed nunc rhoncus pharetra.
                Pellentesque condimentum sem. In efficitur ligula tate urna.
                Maecenas laoreet massa vel lacinia pellentesque lorem ipsum
                dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus et
                sagittis libero. Mauris aliquet magna magna sed nunc rhoncus
                amet pharetra et feugiat tempus.
              </p>
              <ul className="actions">
                <li>
                  <Link to="/style-guide/section" className="button next">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </Layout>
    )
  }
}

export default HomeIndex
