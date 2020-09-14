declare module "gatsby-plugin-mdx";
declare module "gatsby-source-filesystem/create-file-node";
declare module "@mdx-js/react";
declare module "remark-slug";

declare module "gatsby-transformer-markdown-references" {
  export * from "gatsby-transformer-markdown-references/lib/markdown-utils";
}

declare module "@babel/core" {
  // It seems I have incorrect version of babel-plugin-macros?
  export type PluginPass = any;
  // I hope it works at runtime 🙈
  export type NodePath = any;
  // I'll be really surprised if it works at runtime.
  export type PluginObj = any;
}
