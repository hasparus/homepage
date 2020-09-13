import { GatsbyNode } from "gatsby";

import { parseOptions } from "./parseOptions";
import { MdxFile } from "./types";

type TODO = any;

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }, options) => {
  const { createPage } = actions;

  const { noteTemplatePath, basePath, rootNote } = parseOptions(options);

  // TODO: Add generated type or annotate it here?
  const result = await graphql(
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
              frontmatter {
                private
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    console.error(result.errors);
    throw new Error('Could not query notes');
  }

  const localFileTemplate = require.resolve(noteTemplatePath);

  const localFiles: MdxFile[] = (result.data as any).allFile.nodes
    .filter(shouldHandleFile)
    .filter((x: any) => x.childMdx.frontmatter.private !== true);

  localFiles.forEach(node => {
    createPage({
      path: node.fields!.route,
      component: localFileTemplate,
      context: {
        id: node.id,
      },
    });
  });

  if (rootNote) {
    const root = localFiles.find(node => (node.fields as TODO).slug === rootNote);
    if (root) {
      createPage({
        path: basePath,
        component: localFileTemplate,
        context: {
          id: root.id,
        },
      });
    }
  }
};
