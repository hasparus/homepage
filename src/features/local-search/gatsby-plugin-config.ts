/**
 * @see https://www.gatsbyjs.com/plugins/gatsby-plugin-lunr/
 */
export const gatsbyPluginLocalSearchConfig = {
  resolve: `gatsby-plugin-lunr`,
  options: {
    languages: [
      {
        // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
        name: "en",
        // A function for filtering nodes. () => true by default
        // filterNodes: (_node: Node) => true,
        // Add to index custom entries, that are not actually extracted from gatsby nodes
        customEntries: [
          {
            title: "Pictures",
            content: "awesome pictures",
            url: "/pictures",
          },
        ],
      },
    ],
    // Fields to index. If store === true value will be stored in index file.
    // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
    fields: [
      { name: "title", store: true, attributes: { boost: 20 } },
      { name: "content" },
      { name: "url", store: true },
    ],
    // How to resolve each field's value for a supported node type
    resolvers: {
      // For any node of type MarkdownRemark, list how to resolve the fields' values
      // MarkdownRemark: {
      //   title: (node) => node.frontmatter.title,
      //   content: (node) => node.rawMarkdownBody,
      //   url: (node) => node.fields.url,
      // },
      // TODO: Mdx
    },
    //custom index file name, default is search_index.json
    filename: "search_index.json",
    //custom options on fetch api call for search_ındex.json
    fetchOptions: {
      credentials: "same-origin",
    },
  },
};
