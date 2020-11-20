import { GatsbyNode } from "gatsby";
import { resolve } from "path";

import { collectGraphQLFragments } from "../../../lib/build-time/collectGraphQLFragments";
import { parseOptions } from "./parseOptions";
import { shouldHandleFile } from "./shouldHandleFile";

export interface NoteFieldsOnMdx
  extends GatsbyTypes.TweetDiscussEditLinksDataOnMdxFragment,
    GatsbyTypes.GatsbyGardenReferencesOnMdxFragment {
  fields: {
    title: string;
    route: string;
  };
  frontmatter: {
    isHidden: boolean;
  };
}

export interface NotePagePathContext
  extends Omit<NoteFieldsOnMdx, "fields" | "frontmatter"> {
  title: string;
}

type NoteFieldsOnFile = {
  id: string;
  absolutePath: string;
  sourceInstanceName: string;
  ext: string;
  internal: {
    mediaType: string;
  };
  childMdx: NoteFieldsOnMdx;
};

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
        nodes: Array<NoteFieldsOnFile>;
      };
    };
  };

  const fragments = await collectGraphQLFragments(
    resolve(__dirname, "../.."),
    ["GatsbyGardenReferencesOnMdx", "TweetDiscussEditLinksDataOnMdx"]
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
                title
                route
              }
              frontmatter {
                isHidden
              }
              ...GatsbyGardenReferencesOnMdx
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

  const localFiles = result
    .data!.allFile.nodes.filter((node) =>
      shouldHandleFile(node, parsedOptions)
    )
    .filter((x) => !x.childMdx?.frontmatter.isHidden);

  localFiles.forEach((node) => {
    const {
      inboundReferences,
      outboundReferences,
      fields: { title },
      socialLinks,
    } = node.childMdx;

    const context: NotePagePathContext = {
      title,
      socialLinks,
      inboundReferences,
      outboundReferences,
    };

    createPage({
      path: node.childMdx.fields!.route,
      component: node.absolutePath,
      context,
    });
  });
};
