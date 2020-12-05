// @ts-check

/**
 * @type {import("../gatsby-transformer-markdown-references/src/options").MarkdownReferencesPluginOptions.Input}
 */
const markdownReferencesOptions = {
  types: ["Mdx"],
};

/**
 * @param {import("./parseOptions").NotesBrainThemeOptions.PossibleInput} options
 */
module.exports = (options) => {
  return {
    plugins: [
      {
        resolve: require.resolve(
          "../gatsby-transformer-markdown-references"
        ),
        options: options.markdownReferences,
      },
    ],
  };
};
