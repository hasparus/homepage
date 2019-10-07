const WebpackNotifierPlugin = require("webpack-notifier");
const path = require("path");
const { toLower } = require("lodash");
const { createFilePath } = require("gatsby-source-filesystem");

/**
 * Intercept and modify the GraphQL schema
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
  if (node.internal.type === "Mdx") {
    const route = toLower(
      createFilePath({
        node,
        getNode,
        trailingSlash: false,
      })
    );

    actions.createNodeField({
      node,
      name: "route",
      value: route,
    });
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
