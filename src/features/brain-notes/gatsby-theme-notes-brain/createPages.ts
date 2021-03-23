import { resolve } from "path";

import { GatsbyNode } from "gatsby";

import type {
  GatsbyGardenReferencesOnMdxFragment,
  SocialLinks,
} from "../../../../graphql-types";
import { collectGraphQLFragments } from "../../../lib/build-time/collectGraphQLFragments";
import type { TweetDiscussEditLinksDataOnMdxFragment } from "../../social-sharing/TweetDiscussEditLinks";

import { parseOptions } from "./parseOptions";
import { shouldHandleFile } from "./shouldHandleFile";

export interface NoteFieldsOnMdx
  extends TweetDiscussEditLinksDataOnMdxFragment,
    GatsbyGardenReferencesOnMdxFragment {
  fields: {
    title: string;
    route: string;
  };
  frontmatter: {
    isHidden: boolean;
  };
  socialLinks: SocialLinks;
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
    errors?: Error[];
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

  // I'm beyond caring about this error.
  result.errors = result.errors?.filter(
    (e) =>
      !e.message.includes(
        'The node type "GRVSCCodeBlock" is owned by "gatsby-plugin-mdx".'
      )
  );

  if (result.errors?.length) {
    console.error(result.errors);
    debugger;
    throw new Error("Could not query notes");
  }

  const localFiles = result
    .data!.allFile.nodes.filter((node) =>
      shouldHandleFile(node, parsedOptions)
    )
    .filter((x) => {
      if (!x.childMdx) {
        console.warn("[gatsby-theme-notes-brain] localFile omitted", x);
        return false;
      }

      return true;
    })
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
      path: node.childMdx.fields.route,
      component: node.absolutePath,
      context,
    });
  });
};
