const WebpackNotifierPlugin = require("webpack-notifier");
const { toLower } = require("lodash");
const { createFilePath } = require("gatsby-source-filesystem");
const { exec } = require("child_process");

const makeGitLogCommand = (params, filepath = "") =>
  `git log --pretty=format:"
    ${params.join(makeGitLogCommand.format.param)}
    ${makeGitLogCommand.format.line}" ${filepath}`;

const random = 451436388.16325235; //Math.random()*10e8;
makeGitLogCommand.format = {
  line: random.toString(36),
  param: `-- ${random} --`,
};

/**
 * @author https://gist.github.com/sergey-shpak
 * @see https://gist.github.com/sergey-shpak/40fe8d2534c5e5941b9db9e28132ca0b
 *
 * @param {string} filepath
 * @param {Record<string, string>} schema
 */
const getGitLogJsonForFile = (
  filepath,
  schema = {
    commit: "%H",
    abbreviatedCommit: "%h",
    tree: "%T",
    abbreviatedTree: "%t",
    parent: "%P",
    abbreviatedParent: "%p",
    refs: "%D",
    encoding: "%e",
    subject: "%s",
    sanitizedSubjectLine: "%f",
    body: "%b",
    commitNotes: "%N",
    verificationFlag: "%G?",
    signer: "%GS",
    signerKey: "%GK",
    authorName: "%aN",
    authorEmail: "%aE",
    authorDate: "%aD",
    committerName: "%cN",
    committerEmail: "%cE",
    committerDate: "%cD",
  }
) => {
  console.log({ filepath });
  return new Promise((resolve, reject) => {
    const keys = Object.keys(schema);
    const params = keys.map(key => schema[key]);

    const command = makeGitLogCommand(params, filepath);
    console.log({ command });
    exec(command, (err, stdout) => {
      console.log({ stdout });
      if (err) {
        reject(err);
      } else {
        resolve(
          stdout
            .split(makeGitLogCommand.format.line)
            .filter(line => line.length)
            .map(line =>
              line
                .split(makeGitLogCommand.format.param)
                .reduce((obj, value, idx) => {
                  obj[keys[idx]] = value;
                  return obj;
                }, {})
            )
        );
      }
    });
  });
};

/**
 * Intercept and modify the GraphQL schema
 */
exports.onCreateNode = ({ node, getNode, actions }) => {
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

    actions.createNodeField({
      node,
      name: "route",
      value: route,
    });

    if (route.endsWith(".hidden")) {
      actions.createNodeField({
        node,
        name: "isHidden",
        value: true,
      });
    }

    if (mdxNode.frontmatter.history) {
      // TODO
      console.log("Build blogpost history");
      getGitLogJsonForFile("content/posts/refinement-types.mdx").then(
        console.log
      );
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
    }

    enum BlogpostHistory {
      Verbose
      DatesOnly
    }

    type MdxFrontmatter @dontInfer {
      title: String!
      spoiler: String!
      date: Date!
      history: BlogpostHistory
    }
  `;
  createTypes(typeDefs);
};
