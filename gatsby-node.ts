/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  CreateSchemaCustomizationArgs,
  GatsbyNode,
  PluginOptions,
} from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import puppeteer, { Browser } from "puppeteer";
import readingTime from "reading-time";
import WebpackNotifierPlugin from "webpack-notifier";
import { resolve } from "path";

import * as g from "./__generated__/global";
import { createBlogpostHistoryNodeField } from "./src/features/post-history/createBlogpostHistoryNodeField";
import { createSocialImageNodeField } from "./src/features/social-cards/createSocialImageNodeField";
import * as socialSharing from "./src/features/social-sharing/gatsby-node";
import { buildTime, isMdx } from "./src/lib/build-time/gatsby-node-utils";
import { assert } from "./src/lib/util";
import { collectGraphQLFragments } from "./src/lib/build-time/collectGraphQLFragments";
import { slugifyTitle } from "./src/lib/build-time/slugifyTitle";

export interface MdxPostPageContext extends g.MdxFields {
  frontmatter: g.Mdx["frontmatter"];
  readingTime: number;
  socialLinks: g.Mdx["socialLinks"];
  tableOfContents: g.Mdx["tableOfContents"];
  parentId?: string | null;
}

/**
 * Intercept and modify the GraphQL schema
 */
export const onCreateNode: GatsbyNode["onCreateNode"] = async (args) => {
  const {
    node,
    getNode,
    actions: { createNodeField },
  } = args;

  // console.log("onCreateNode", node.id, node.parent, node.internal.type);

  // It makes sense, but I don't need it yet. Moderately useful for debugging.
  // // eslint-disable-next-line sonarjs/no-collapsible-if
  // if (node.internal.type === "SitePage") {
  //   const sitePage = node as generated.SitePage;
  //   if (sitePage.context) {
  //     const parent: Node = getNode(sitePage.context.parentId);
  //     if (parent) {
  //       createParentChildLink({
  //         parent,
  //         child: node,
  //       });
  //       // https://www.gatsbyjs.org/docs/node-creation/#explicitly-recording-a-parentchild-relationship
  //       node.parent = parent.id;
  //     }
  //   }
  //   return;
  // }

  if (isMdx(node)) {
    const parent = (getNode(node.parent) as unknown) as buildTime.File;

    const prefix =
      parent.sourceInstanceName === "posts"
        ? ""
        : `/${parent.sourceInstanceName}`;

    const route =
      prefix +
      slugifyTitle(
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
      value: route.endsWith(".hidden") || /[\w//]*\/_\w+/.test(route),
    });

    createNodeField({
      node,
      name: "readingTime",
      value: Math.ceil(readingTime(node.rawBody).minutes),
    });

    const mdxArgs = { ...args, node };
    createBlogpostHistoryNodeField(mdxArgs, { route, rootDir: __dirname });
    await createSocialImageNodeField(mdxArgs, browser);
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

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
}) => {
  const fragments = await collectGraphQLFragments(
    resolve(__dirname, "src/features"),
    ["TweetDiscussEditLinksDataOnMdx"]
  );

  return new Promise((resolve, reject) => {
    resolve(
      graphql<{ allMdx: g.MdxConnection }>(/* graphql */ `
        ${fragments}
        query CreatePagesQuery {
          allMdx {
            nodes {
              id
              fileAbsolutePath
              parent {
                ... on File {
                  sourceInstanceName
                }
              }
              frontmatter {
                historySource
              }
              fields {
                route
                readingTime
                history {
                  entries {
                    subject
                    authorDate
                    abbreviatedCommit
                  }
                  url
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
              ...TweetDiscussEditLinksDataOnMdx
              tableOfContents {
                items {
                  url
                  title
                  items {
                    url
                    title
                    items {
                      url
                      title
                    }
                  }
                }
              }
            }
          }
        }
      `).then((result) => {
        if (result.errors) {
          console.error(result.errors);
          reject(result.errors);
          return;
        }

        // eslint-disable-next-line no-unused-expressions
        result.data?.allMdx?.nodes.forEach((node) => {
          assert(node && node.fields && node.fields.route);

          // is this an HMR error?
          if (!node.parent) {
            console.error("node.parent is missing");
            return;
          }

          const { sourceInstanceName } = node.parent as g.File;

          if (!["posts", "speaking"].includes(sourceInstanceName)) {
            return;
          }

          const context: Omit<MdxPostPageContext, "frontmatter"> = {
            ...node.fields,
            socialLinks: node.socialLinks,
            tableOfContents: node.tableOfContents,
            parentId: node.id,
          };

          actions.createPage({
            path: node.fields.route,
            component: node.fileAbsolutePath,
            context,
          });
        });
      })
    );
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async (
  args: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions
) => {
  socialSharing.createSchemaCustomization(args, pluginOptions);

  const {
    actions: { createTypes },
  } = args;

  createTypes(/*graphql*/ `
      type Mdx implements Node {
        frontmatter: MdxFrontmatter
        fields: MdxFields
        socialLinks: SocialLinks! @socialLinks
        tableOfContents: TableOfContents!
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

      type PostImage {
        url: String!
        author: String!
      }

      type MdxFrontmatter @dontInfer {
        title: String
        spoiler: String
        date: Date
        history: BlogpostHistoryType
        historySource: String
        venues: [Venue!]
        image: PostImage
      }

      type BlogpostHistory {
        entries: [BlogpostHistoryEntry!]!
        url: String!
      }

      type MdxFields {
        route: String!
        isHidden: Boolean!
        history: BlogpostHistory
        readingTime: Int!
        socialImage: File
      }

      type SocialLinks {
        edit: String!
        tweet: String!
        discuss: String!
      }

      type SitePage {
        socialLinks: SocialLinks! @socialLinks
      }


      type TableOfContents @dontInfer {
        items: [TableOfContentsItem!]
      }

      type TableOfContentsItem @dontInfer {
        url: String
        title: String
        items: [TableOfContentsItem!]
      }
  `);
};

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
