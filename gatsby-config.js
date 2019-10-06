/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: `hasparus homepage`,
    author: `Piotr Monwid-Olechnowicz`,
    description: `Description placeholder`,
    social: [
      {
        name: `Twitter`,
        url: `https://twitter.com/hasparus`,
      },
      {
        name: `GitHub`,
        url: `https://github.com/hasparus`,
      },
    ],
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [".mdx"],
        commonmark: true,
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1380,
              linkImagesToOriginal: false,
            },
          },
          { resolve: `gatsby-remark-copy-linked-files` },
          { resolve: `gatsby-remark-smartypants` },
        ],
        remarkPlugins: [require(`remark-slug`)],
        defaultLayouts: {
          default: require.resolve("./src/layouts/post.tsx"),
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `content/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `content/assets`,
        name: `assets`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        allowNamespaces: true,
      },
    },
    "gatsby-plugin-codegen",
  ],
};
