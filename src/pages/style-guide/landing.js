import React from 'react'
import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import BannerLanding from '../../components/BannerLanding'

import pic08 from '../../assets/images/style-guide/pic08.jpg'
import pic09 from '../../assets/images/style-guide/pic09.jpg'
import pic10 from '../../assets/images/style-guide/pic10.jpg'

const Landing = (props) => (
  <Layout>
    <Helmet>
      <title>Landing - Forty by HTML5 UP</title>
      <meta name="description" content="Landing Page" />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    <BannerLanding />

    <div id="main">
      <section id="one">
        <div className="inner">
          <header className="major">
            <h2>Sed amet aliquam</h2>
          </header>
          <p>
            Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
            magna sed nunc rhoncus condimentum sem. In efficitur ligula tate
            urna. Maecenas massa vel lacinia pellentesque lorem ipsum dolor.
            Nullam et orci eu lorem consequat tincidunt. Vivamus et sagittis
            libero. Nullam et orci eu lorem consequat tincidunt vivamus et
            sagittis magna sed nunc rhoncus condimentum sem. In efficitur ligula
            tate urna.
          </p>
        </div>
      </section>
      <section>
        <Link to="/generic" className="image">
          <img src={pic08} alt="" />
        </Link>
        <div className="content">
          <div className="inner">
            <header className="major">
              <h3>Orci maecenas</h3>
            </header>
            <p>
              Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
              magna sed nunc rhoncus condimentum sem. In efficitur ligula tate
              urna. Maecenas massa sed magna lacinia magna pellentesque lorem
              ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus
              et sagittis tempus.
            </p>
            <ul className="actions">
              <li>
                <Link to="/generic" className="button">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <Link to="/generic" className="image">
          <img src={pic09} alt="" />
        </Link>
        <div className="content">
          <div className="inner">
            <header className="major">
              <h3>Rhoncus magna</h3>
            </header>
            <p>
              Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
              magna sed nunc rhoncus condimentum sem. In efficitur ligula tate
              urna. Maecenas massa sed magna lacinia magna pellentesque lorem
              ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus
              et sagittis tempus.
            </p>
            <ul className="actions">
              <li>
                <Link to="/generic" className="button">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <Link to="/generic" className="image">
          <img src={pic10} alt="" />
        </Link>
        <div className="content">
          <div className="inner">
            <header className="major">
              <h3>Sed nunc ligula</h3>
            </header>
            <p>
              Nullam et orci eu lorem consequat tincidunt vivamus et sagittis
              magna sed nunc rhoncus condimentum sem. In efficitur ligula tate
              urna. Maecenas massa sed magna lacinia magna pellentesque lorem
              ipsum dolor. Nullam et orci eu lorem consequat tincidunt. Vivamus
              et sagittis tempus.
            </p>
            <ul className="actions">
              <li>
                <Link to="/generic" className="button">
                  Learn more
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </Layout>
)

export default Landing
