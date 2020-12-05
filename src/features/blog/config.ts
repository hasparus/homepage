import * as path from "path";
import slugRemarkPlugin from "remark-slug";

import { autolinkHeadingsRemarkPluginConfig } from "../autolink-headings/remark-plugin-config";
import { brainNotesGatsbyRemarkPluginConfig } from "../brain-notes/config";

const rootDir = path.resolve(__dirname, "../../../");
const requirePath = (...args: string[]) =>
  require.resolve(path.resolve(...args));

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
          extensionDataDirectory: path.resolve(
            rootDir,
            "__deps__/vscode-extensions"
          ),
          injectStyles: false,
          colorTheme: ({ parsedOptions }: any) =>
            parsedOptions.theme || "Night Owl (No Italics)",
          extensions: [
            { identifier: "hackwaly.ocaml", version: "0.6.43" },
            { identifier: "sdras.night-owl", version: "1.1.3" },
            { identifier: "2gua.rainbow-brackets", version: "0.0.6" },
            { identifier: "fwcd.kotlin", version: "0.2.10" },
            { identifier: "prisma.vscode-graphql", version: "0.2.2" },
            { identifier: "benfradet.vscode-unison", version: "0.3.0" },
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
