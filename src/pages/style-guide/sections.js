import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../../components/layout'
import BannerLanding from '../../components/BannerLanding'

import angularHeadless from '../../assets/images/pwas/PWA-Angular+headless-cms.png'
import lighthouseAudit from '../../assets/images/pwas/PWA-Lighthouse-audit.png'
import lighthouseInCI from '../../assets/images/pwas/PWA-Lighthouse-in-CI.png'

const Landing = () => (
  <Layout>
    <Helmet>
      <title>PWA series</title>
      <meta
        name="description"
        content="Progressive web apps series by Ondřej Chrastina"
      />
    </Helmet>

    <BannerLanding
      title="Progressive Web Apps series"
      content="Progressive Web Apps are user experiences that have the reach of the web, 
 and are Reliable, Fast, and Engaging - Feel like a natural app on the device, with an immersive user experience.
This new level of quality allows Progressive Web Apps to earn a place on the user's home screen."
    />

    <div id="main">
      <section id="one">
        <div className="inner">
          <header className="major">
            <h2>My findings</h2>
          </header>
          <p>
            During my investigation what the PWAs are and which capabilities
            they provide I found out that there is a couple of approaches that
            could be beneficial for broader audience.
          </p>
        </div>
      </section>
      <section id="two" className="spotlights">
        <section>
          <a
            href="https://medium.com/free-code-camp/how-to-create-a-progressive-web-app-featuring-angular-and-headless-cms-b8ee4f7a5ea3"
            className="image"
          >
            <img src={angularHeadless} alt="" />
          </a>
          <div className="content">
            <div className="inner">
              <header className="major">
                <h3>
                  How to create a progressive web app featuring Angular and
                  headless CMS
                </h3>
              </header>
              <p>
                Have you ever wondered how a headless Content Management System
                fits in with Progressive Web Apps?
              </p>
              <ul className="actions">
                <li>
                  <a
                    href="https://medium.com/free-code-camp/how-to-create-a-progressive-web-app-featuring-angular-and-headless-cms-b8ee4f7a5ea3"
                    className="button"
                  >
                    Learn more
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <a
            href="https://medium.com/free-code-camp/how-to-tune-up-your-progressive-web-app-to-get-a-perfect-audit-score-a1779d063eb7"
            className="image"
          >
            <img src={lighthouseAudit} alt="" />
          </a>
          <div className="content">
            <div className="inner">
              <header className="major">
                <h3>
                  How to tune up your Progressive Web App to get a perfect audit
                  score
                </h3>
              </header>
              <p>
                Progressive Web Apps (PWAs) quickly became the hottest
                development platform during the last year. Let’s take a look at
                what you need to do to adhere to the PWA standards.
              </p>
              <ul className="actions">
                <li>
                  <a
                    href="https://medium.com/free-code-camp/how-to-tune-up-your-progressive-web-app-to-get-a-perfect-audit-score-a1779d063eb7"
                    className="button"
                  >
                    Learn more
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section>
          <a
            href="https://medium.com/free-code-camp/how-to-make-sure-your-progressive-web-app-keeps-its-lighthouse-audit-score-4c11cf514e1a"
            className="image"
          >
            <img src={lighthouseInCI} alt="" />
          </a>
          <div className="content">
            <div className="inner">
              <header className="major">
                <h3>
                  How to make sure your Progressive Web App keeps its Lighthouse
                  audit
                </h3>
              </header>
              <p>
                The hint how to check the PWA compliance automatically by
                embedding the Lighthouse PWA audit into your continuous
                integration pipeline.
              </p>
              <ul className="actions">
                <li>
                  <a
                    href="https://medium.com/free-code-camp/how-to-make-sure-your-progressive-web-app-keeps-its-lighthouse-audit-score-4c11cf514e1a"
                    className="button"
                  >
                    Learn more
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </div>
  </Layout>
)

export default Landing
