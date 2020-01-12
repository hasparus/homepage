/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  GatsbyNode,
  CreateSchemaCustomizationArgs,
  PluginOptions,
  Actions,
  Node,
  ParentSpanPluginArgs,
} from "gatsby";
import WebpackNotifierPlugin from "webpack-notifier";
import { toLower } from "lodash";
import { createFilePath } from "gatsby-source-filesystem";
import readingTime from "reading-time";
import puppeteer, { Browser } from "puppeteer";
import fs from "fs-extra";
import path from "path";
import slash from "slash";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { createFileNode as baseCreateFileNode } from "gatsby-source-filesystem/create-file-node";

import { getGitLogJsonForFile } from "./scripts/getGitLogJsonForFile";
import * as generated from "./__generated__/global";
import { assert } from "./src/lib";
import { makeSocialCard } from "./scripts/makeSocialCard";

/**
 * Intercept and modify the GraphQL schema
 */
export const onCreateNode: GatsbyNode["onCreateNode"] = async args => {
  const {
    node,
    getNode,
    actions: { createNodeField },
  } = args;

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

    const mdxArgs = { ...args, node: mdxNode };
    createBlogpostHistoryNodeField(mdxArgs, route);
    await createSocialImageNodeField(mdxArgs);
  }
};

/**
 * Update default Webpack configuration
 */
export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    plugins: [
      new WebpackNotifierPlugin({
        skipFirstNotification: true,
      }),
    ],
  });
};

export const createPages: GatsbyNode["createPages"] = ({
  graphql,
  actions,
}) => {
  return new Promise((resolve, reject) => {
    resolve(
      graphql<{ allMdx: generated.MdxConnection }>(`
        query CreatePagesQuery {
          allMdx {
            nodes {
              id
              fileAbsolutePath
              frontmatter {
                historySource
              }
              fields {
                route
                readingTime
                history {
                  subject
                  authorDate
                  abbreviatedCommit
                }
                socialImage {
                  childImageSharp {
                    original {
                      width
                      height
                      src
                    }
                  }
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          console.error(result.errors);
          reject(result.errors);
          return;
        }

        // eslint-disable-next-line no-unused-expressions
        result.data?.allMdx?.nodes.forEach(node => {
          assert(node && node.fields && node.fields.route);

          actions.createPage({
            path: node.fields.route,
            component: node.fileAbsolutePath,
            context: node.fields,
          });
        });
      })
    );
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async (
  { actions: { createTypes } }: CreateSchemaCustomizationArgs,
  _: PluginOptions
) => {
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

    type Venue {
      name: String!
      link: String
    }

    type MdxFrontmatter @dontInfer {
      title: String!
      spoiler: String!
      date: Date!
      history: BlogpostHistoryType
      historySource: String
      venues: [Venue!] 
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

async function createFileNode(
  filePath: string,
  createNode: Actions["createNode"],
  createNodeId: unknown,
  parentNodeId: unknown
) {
  const fileNode = await baseCreateFileNode(filePath, createNodeId);
  fileNode.parent = parentNodeId;
  createNode(fileNode, {
    name: `gatsby-source-filesystem`,
  });
  return fileNode;
}

let browser: Browser;

export async function onPreInit() {
  browser = await puppeteer.launch({
    // Toggle to preview generated images
    headless: true,
  });
}

export async function onPostBuild() {
  await browser.close();
}

interface CreateMdxNodeArgs extends ParentSpanPluginArgs {
  node: generated.Mdx;
}

function createBlogpostHistoryNodeField(
  { node, actions: { createNodeField } }: CreateMdxNodeArgs,
  route: string
) {
  const blogpostHistoryType = node.frontmatter?.history;
  if (blogpostHistoryType) {
    const filePath = node.frontmatter!.historySource
      ? slash(path.join(__dirname, node.frontmatter!.historySource))
      : node.fileAbsolutePath;

    getGitLogJsonForFile(filePath, [
      "abbreviatedCommit",
      "authorDate",
      "subject",
      "body",
    ])
      .then(history => {
        switch (blogpostHistoryType) {
          case "Verbose":
            createNodeField({
              node: (node as unknown) as Node,
              name: "history",
              value: history,
            });
            break;
          case "DatesOnly":
            createNodeField({
              node: (node as unknown) as Node,
              name: "history",
              value: history.map(entry => ({
                authorDate: entry.authorDate,
              })),
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

async function createSocialImageNodeField({
  node,
  store,
  createNodeId,
  actions: { createNodeField, createNode },
}: CreateMdxNodeArgs) {
  const { program } = store.getState();

  const cacheDir = path.resolve(`${program.directory}/.cache/social/`);
  await fs.ensureDir(cacheDir);

  try {
    const ogImage = await makeSocialCard(
      cacheDir,
      browser,
      (node as unknown) as generated.Mdx
    );

    const ogImageNode = await createFileNode(
      ogImage,
      createNode,
      createNodeId,
      node.id
    );

    createNodeField({
      name: "socialImage___NODE",
      node: (node as unknown) as Node,
      value: ogImageNode.id,
    });
  } catch (e) {
    console.error(e);
  }
}
