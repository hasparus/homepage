import { GatsbyNode } from "gatsby";
import { resolve } from "path";

import { collectGraphQLFragments } from "../../../lib/build-time/collectGraphQLFragments";
import { TweetDiscussEditLinksDataOnMdx } from "../../social-sharing/TweetDiscussEditLinks";

import { parseOptions } from "./parseOptions";
import { shouldHandleFile } from "./shouldHandleFile";

export const createPages: GatsbyNode["createPages"] = async (
  { graphql, actions },
  options
) => {
  const { createPage } = actions;

  const parsedOptions = parseOptions(options);

  type Result = {
    errors?: unknown;
    data?: {
      allFile: {
        nodes: Array<{
          id: string;
          absolutePath: string;
          sourceInstanceName: string;
          ext: string;
          internal: {
            mediaType: string;
          };
          childMdx: {
            fields: {
              route: string;
            };
            frontmatter: {
              isHidden: boolean;
            };
          } & TweetDiscussEditLinksDataOnMdx;
        }>;
      };
    };
  };

  const fragments = await collectGraphQLFragments(
    resolve(__dirname, "../.."),
    ["GatsbyGardenReferences", "TweetDiscussEditLinksDataOnMdx"]
  );
  const result: Result = await graphql(
    `
      ${fragments}
      {
        allFile(filter: {
          sourceInstanceName: { eq: "${parsedOptions.contentPath}" }
        }) {
          nodes {
            id
            absolutePath
            sourceInstanceName
            ext
            internal {
              mediaType
            }
            childMdx {
              fields {
                route
              }
              frontmatter {
                isHidden
              }
              ...GatsbyGardenReferences
              ...TweetDiscussEditLinksDataOnMdx
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    console.error(result.errors);
    throw new Error("Could not query notes");
  }

  // const localFileTemplate = require.resolve(parsedOptions.noteTemplatePath);

  const localFiles = result
    .data!.allFile.nodes.filter((node: any) =>
      shouldHandleFile(node, parsedOptions)
    )
    .filter((x) => !x.childMdx.frontmatter.isHidden);

  localFiles.forEach((node) => {
    console.log(">>", node.childMdx);

    const {
      inboundReferences,
      outboundReferences,
    } = node.childMdx as any; /* TODO */

    createPage({
      path: node.childMdx.fields!.route,
      component: node.absolutePath,
      context: {
        id: node.id,
        inboundReferences,
      },
    });
  });
};
