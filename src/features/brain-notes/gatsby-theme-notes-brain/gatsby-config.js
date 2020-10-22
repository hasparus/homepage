// @ts-check

/**
 * @type {import("../gatsby-transformer-markdown-references/src/options").PluginOptions}
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
        resolve: require.resolve(
          "../gatsby-transformer-markdown-references"
        ),
        options: markdownReferencesOptions,
      },
    ],
  };
};
