/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostTitleAndRoute
// ====================================================

export interface PostTitleAndRoute_nodes_childMdx_parent_ImageSharp {}

export interface PostTitleAndRoute_nodes_childMdx_parent_File {
  sourceInstanceName: string;
}

export type PostTitleAndRoute_nodes_childMdx_parent = PostTitleAndRoute_nodes_childMdx_parent_ImageSharp | PostTitleAndRoute_nodes_childMdx_parent_File;

export interface PostTitleAndRoute_nodes_childMdx_frontmatter {
  title: string | null;
  date: any | null;
}

export interface PostTitleAndRoute_nodes_childMdx_fields {
  route: string;
}

export interface PostTitleAndRoute_nodes_childMdx {
  parent: PostTitleAndRoute_nodes_childMdx_parent | null;
  frontmatter: PostTitleAndRoute_nodes_childMdx_frontmatter | null;
  fields: PostTitleAndRoute_nodes_childMdx_fields | null;
}

export interface PostTitleAndRoute_nodes {
  childMdx: PostTitleAndRoute_nodes_childMdx | null;
}

export interface PostTitleAndRoute {
  nodes: PostTitleAndRoute_nodes[];
}
