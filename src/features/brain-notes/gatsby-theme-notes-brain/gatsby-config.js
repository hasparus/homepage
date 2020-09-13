module.exports = {
  plugins: [
    {
      resolve: "gatsby-transformer-markdown-references",
      options: {
        types: ["Mdx"],
      },
    },
    // {
    //   resolve: `gatsby-plugin-compile-es6-packages`,
    //   options: {
    //     modules: [`gatsby-theme-garden`],
    //   },
    // },
    {
      resolve: require.resolve("../gatsby-remark-double-brackets-link.ts"),
      options: {
        stripBrackets: true,
        titleToURL: {
          prefix: "notes",
        },
      },
    },
  ],
};
