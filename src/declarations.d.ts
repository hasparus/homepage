declare module "gatsby-plugin-mdx";
declare module "gatsby-source-filesystem/create-file-node";
declare module "@mdx-js/react";
declare module "remark-slug";

declare module "@babel/core" {
  // It seems I have incorrect version of babel-plugin-macros?
  export type PluginPass = any;
  // I hope it works at runtime 🙈
  export type NodePath = any;
  export type PluginObj = any;
}

// file-parser.js is written in Flow
/**
 * @see https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/query/file-parser.js
 */
declare module "gatsby/dist/query/file-parser" {
  import { DocumentNode } from "graphql";

  export default class FileParser {
    parseFiles(
      files: string[],
      addError?: unknown
    ): Promise<{ doc: DocumentNode }[]>;
  }
}
