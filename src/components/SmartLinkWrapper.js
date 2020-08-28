import React, { useEffect } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import KontentSmartLink from '@kentico/kontent-smart-link'
import '@kentico/kontent-smart-link/dist/kontent-smart-link.styles.css'

const SmartLinkWrapper = ({ children }) => {
  useEffect(() => {
    const kontentSmartLink = KontentSmartLink.initialize({
      queryParam: 'preview-mode',
    })
    return () => {
      kontentSmartLink.destroy()
    }
  })

  return (
    <StaticQuery
      query={graphql`
        {
          sitePlugin(name: { eq: "@kentico/gatsby-source-kontent" }) {
            pluginOptions {
              projectId
              languageCodenames
            }
          }
        }
      `}
      render={data => (
        <div
          className="kontent-smart-link-sdk-wrapper"
          data-kontent-project-id={data.sitePlugin.pluginOptions.projectId}
          data-kontent-language-codename={
            data.sitePlugin.pluginOptions.languageCodenames[0]
          }
        >
          {children}
        </div>
      )}
    ></StaticQuery>
  )
}

export default SmartLinkWrapper
