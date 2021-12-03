/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IndexPageQuery
// ====================================================

export interface IndexPageQuery_favorites_nodes_childMdx_parent_Mdx {}

export interface IndexPageQuery_favorites_nodes_childMdx_parent_File {
  sourceInstanceName: string;
}

export type IndexPageQuery_favorites_nodes_childMdx_parent = IndexPageQuery_favorites_nodes_childMdx_parent_Mdx | IndexPageQuery_favorites_nodes_childMdx_parent_File;

export interface IndexPageQuery_favorites_nodes_childMdx_frontmatter {
  date: any | null;
  title: string | null;
}

export interface IndexPageQuery_favorites_nodes_childMdx_fields {
  route: string;
  title: string | null;
}

export interface IndexPageQuery_favorites_nodes_childMdx {
  parent: IndexPageQuery_favorites_nodes_childMdx_parent | null;
  frontmatter: IndexPageQuery_favorites_nodes_childMdx_frontmatter | null;
  fields: IndexPageQuery_favorites_nodes_childMdx_fields | null;
}

export interface IndexPageQuery_favorites_nodes {
  /**
   * Returns the first child node of type Mdx or null if there are no children of given type on this node
   */
  childMdx: IndexPageQuery_favorites_nodes_childMdx | null;
}

export interface IndexPageQuery_favorites {
  nodes: IndexPageQuery_favorites_nodes[];
}

export interface IndexPageQuery {
  favorites: IndexPageQuery_favorites;
}
