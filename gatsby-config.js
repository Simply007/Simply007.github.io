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
        projectId: '75653ec1-36a2-01e0-0d25-a64799947697',
        languageCodenames: ['en-US'],
        authorizationKey: "ew0KICAiYWxnIjogIkhTMjU2IiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAianRpIjogIjgzNWNmN2UyNWNiYjRiYTI5N2VlZjY3N2IwOGY0YTQ2IiwNCiAgImlhdCI6ICIxNTk0MDU0NTI4IiwNCiAgImV4cCI6ICIxOTM5NjU0NTI4IiwNCiAgInByb2plY3RfaWQiOiAiNzU2NTNlYzEzNmEyMDFlMDBkMjVhNjQ3OTk5NDc2OTciLA0KICAidmVyIjogIjEuMC4wIiwNCiAgImF1ZCI6ICJwcmV2aWV3LmRlbGl2ZXIua2VudGljb2Nsb3VkLmNvbSINCn0.SlieCrPlUWqI67Bn5UdxZlYXO21zQ0QXjK1JaQH0n3g",
        usePreviewUrl: true
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-offline',
  ],
}
