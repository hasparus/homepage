import { GatsbyNode } from "gatsby";

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
          };
        }>;
      };
    };
  };
  const result: Result = await graphql(
    `
      {
        allFile {
          nodes {
            id
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

  const localFileTemplate = require.resolve(parsedOptions.noteTemplatePath);

  const localFiles = result
    .data!.allFile.nodes.filter((node: any) =>
      shouldHandleFile(node, parsedOptions)
    )
    .filter((x) => !x.childMdx.frontmatter.isHidden);

  localFiles.forEach((node) => {
    createPage({
      path: node.childMdx.fields!.route,
      component: localFileTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
