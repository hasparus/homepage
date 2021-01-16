// @ts-check

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
