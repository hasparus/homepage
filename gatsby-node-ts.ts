import { GatsbyNode, CreateSchemaCustomizationArgs, PluginOptions } from "gatsby";
import WebpackNotifierPlugin from "webpack-notifier";
import { toLower } from "lodash";
import { createFilePath } from "gatsby-source-filesystem";
import readingTime from "reading-time";
import { AssertionError } from "assert";

import { getGitLogJsonForFile } from "./scripts/getGitLogJsonForFile";
import * as generated from "./__generated__/global";

function assert(condition: any, message?: string): asserts condition {
	if (!condition) {
			throw new AssertionError({ message })
	}
}

/**
 * Intercept and modify the GraphQL schema
 */
export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  getNode,
  actions: { createNodeField },
}) => {
  if (node.internal.type === "Mdx") {
    const mdxNode = (node as unknown) as generated.Mdx;

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

    createNodeField({
      node,
      name: "readingTime",
      value: Math.ceil(readingTime(mdxNode.rawBody).minutes),
    });
    
    const blogpostHistoryType = mdxNode?.frontmatter?.history;
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
            default:
              break;
          }
        })
        .catch(err => {
          console.error("Failed to build blogpost history for", route, err);
        });
    }
  }
};

/**
 * Update default Webpack configuration
 */
export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new WebpackNotifierPlugin({
        skipFirstNotification: true,
      }),
    ],
  });
};

export const createPages: GatsbyNode['createPages'] = ({ graphql, actions }) => {
  return new Promise((resolve, reject) => { 
    resolve(
      graphql<{ allMdx: generated.MdxConnection }>(`
        query CreatePagesQuery {
          allMdx {
            nodes {
              id
              fileAbsolutePath
              fields {
                route
                readingTime
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.error(result.errors);
          return reject(result.errors);
        }

        result.data?.allMdx?.nodes.forEach(node => {
          assert(node && node.fields && node.fields.route);
          
          actions.createPage({
            path: node.fields.route,
            component: node.fileAbsolutePath,
            context: { readingTime: node.fields.readingTime },
          });
        });
      })
    );
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async ({
  actions: { createTypes } 
}: CreateSchemaCustomizationArgs, _: PluginOptions) => {
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
      readingTime: Int!
    }
  `;
  createTypes(typeDefs);
};
