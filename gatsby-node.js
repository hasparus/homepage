const WebpackNotifierPlugin = require("webpack-notifier");
const { toLower } = require("lodash");
const { createFilePath } = require("gatsby-source-filesystem");

const { getGitLogJsonForFile } = require("./scripts/getGitLogJsonForFile");

/**
 * Intercept and modify the GraphQL schema
 */
exports.onCreateNode = ({ node, getNode, actions: { createNodeField } }) => {
  if (node.internal.type === "Mdx") {
    /** @type {import("./__generated__/global").Mdx} */
    const mdxNode = node;

    const route = toLower(
      createFilePath({
        node,
        getNode,
        trailingSlash: false,
      })
    );

    createNodeField({
      node,
      name: "route",
      value: route,
    });

    createNodeField({
      node,
      name: "isHidden",
      value: route.endsWith(".hidden"),
    });

    const blogpostHistoryType = mdxNode.frontmatter.history;
    if (blogpostHistoryType) {
      getGitLogJsonForFile("content/posts/refinement-types.mdx", [
        "abbreviatedCommit",
        "authorDate",
        "subject",
        "body",
      ])
        .then(history => {
          switch (blogpostHistoryType) {
            case "Verbose":
              createNodeField({
                node,
                name: "history",
                value: history,
              });
              break;
            case "DatesOnly":
              createNodeField({
                node,
                name: "history",
                value: history.map(entry => ({ authorDate: entry.authorDate })),
              });
              break;
          }
        })
        .catch(err => {
          console.error("Failed to build blogpost history for", route);
        });
    }
  }
};

/**
 * Update default Webpack configuration
 */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new WebpackNotifierPlugin({
        skipFirstNotification: true,
      }),
    ],
  });
};

exports.createPages = ({ graphql, actions }) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        query CreatePagesQuery {
          allMdx {
            nodes {
              id
              timeToRead
              fileAbsolutePath
              fields {
                route
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.error(result.errors);
          return reject(result.errors);
        }

        result.data.allMdx.nodes.forEach(node => {
          actions.createPage({
            path: node.fields.route,
            component: node.fileAbsolutePath,
            context: { timeToRead: node.timeToRead },
          });
        });
      })
    );
  });
};

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = /*graphql*/ `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
      fields: MdxFields
    }

    enum BlogpostHistoryType {
      Verbose
      DatesOnly
    }

    type BlogpostHistoryEntry {
      abbreviatedCommit: String
      authorDate: Date!
      subject: String
      body: String
    }


    type MdxFrontmatter @dontInfer {
      title: String!
      spoiler: String!
      date: Date!
      history: BlogpostHistoryType
    }

    type MdxFields {
      route: String!
      isHidden: Boolean!
      history: [BlogpostHistoryEntry!]
    }
  `;
  createTypes(typeDefs);
};
