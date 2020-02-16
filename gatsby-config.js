module.exports = {
  siteMetadata: {
    title: 'Ondřej Chrastina',
    author: 'Ondřej Chrastina',
    description: "Ondřej Chrastina's personal site.",
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: "Ondřej Chtastina's personal site.",
        short_name: 'chrastina',
        start_url: '/',
        background_color: '#242943',
        theme_color: '#242943',
        display: 'minimal-ui',
        icon: 'src/assets/images/website-icon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: '@kentico/gatsby-source-kontent',
      options: {
        deliveryClientConfig: {
          projectId: '8943c689-e357-019c-2f0e-083610ce3e6b',
        },
        languageCodenames: [
          'en-US',
        ],
        enableLogging : true,
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
  ],
}
