// @ts-check

/**
 * @type {import("gatsby-transformer-markdown-references/lib/options").PluginOptions}
 */
const markdownReferencesOptions = {
  types: ["Mdx"],
};

/**
 * @param {import("./parseOptions").NotesBrainThemeOptions.PossibleInput} _options
 */
module.exports = (_options) => {
  return {
    plugins: [
      {
        resolve: "gatsby-transformer-markdown-references",
        options: markdownReferencesOptions,
      },
      // {
      //   resolve: `gatsby-plugin-compile-es6-packages`,
      //   options: {
      //     modules: [`gatsby-theme-garden`],
      //   },
      // },
    ],
  };
};
