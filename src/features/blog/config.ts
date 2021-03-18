import * as path from "path";

import slugRemarkPlugin from "remark-slug";

import { autolinkHeadingsRemarkPluginConfig } from "../autolink-headings/remark-plugin-config";
import { brainNotesGatsbyRemarkPluginConfig } from "../brain-notes/config";

const rootDir = path.resolve(__dirname, "../../../");
const requirePath = (...args: string[]) =>
  require.resolve(path.resolve(...args));

const extensionsDir = `${rootDir}/__deps__/vscode-extensions`;

export const gatsbyPluginMdxConfig = {
  resolve: "gatsby-plugin-mdx",
  options: {
    extensions: [".mdx", ".md"],
    commonmark: true,
    gatsbyRemarkPlugins: [
      autolinkHeadingsRemarkPluginConfig,
      brainNotesGatsbyRemarkPluginConfig,
      {
        resolve: "gatsby-remark-images",
        options: {
          maxWidth: 1380,
          linkImagesToOriginal: false,
        },
      },
      { resolve: "gatsby-remark-copy-linked-files" },
      { resolve: "gatsby-remark-smartypants" },
      {
        resolve: "gatsby-remark-vscode",
        options: {
          injectStyles: false,
          default: "Night Owl (No Italics)",
          extensions: [
            "night-owl",
            `${extensionsDir}/GraphQL.vscode-graphql-0.3.15.vsix`,
            `${extensionsDir}/BenFradet.vscode-unison-0.3.0.vsix`,
          ],
        },
      },
    ],
    remarkPlugins: [slugRemarkPlugin],
    defaultLayouts: {
      // default: require.resolve("./../../layouts/PageLayout.tsx"),
      posts: requirePath(rootDir, "src/layouts/PostLayout.tsx"),
      speaking: requirePath(rootDir, "src/layouts/TalkNoteLayout.tsx"),
      notes: requirePath(rootDir, "src/layouts/NoteLayout.tsx"),
    },
  },
};
