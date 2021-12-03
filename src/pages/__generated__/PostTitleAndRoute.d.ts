/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostTitleAndRoute
// ====================================================

export interface PostTitleAndRoute_nodes_childMdx_parent_Mdx {}

export interface PostTitleAndRoute_nodes_childMdx_parent_File {
  sourceInstanceName: string;
}

export type PostTitleAndRoute_nodes_childMdx_parent = PostTitleAndRoute_nodes_childMdx_parent_Mdx | PostTitleAndRoute_nodes_childMdx_parent_File;

export interface PostTitleAndRoute_nodes_childMdx_frontmatter {
  date: any | null;
  title: string | null;
}

export interface PostTitleAndRoute_nodes_childMdx_fields {
  route: string;
  title: string | null;
}

export interface PostTitleAndRoute_nodes_childMdx {
  parent: PostTitleAndRoute_nodes_childMdx_parent | null;
  frontmatter: PostTitleAndRoute_nodes_childMdx_frontmatter | null;
  fields: PostTitleAndRoute_nodes_childMdx_fields | null;
}

export interface PostTitleAndRoute_nodes {
  /**
   * Returns the first child node of type Mdx or null if there are no children of given type on this node
   */
  childMdx: PostTitleAndRoute_nodes_childMdx | null;
}

export interface PostTitleAndRoute {
  nodes: PostTitleAndRoute_nodes[];
}
