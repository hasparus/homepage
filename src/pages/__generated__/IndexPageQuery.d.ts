/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IndexPageQuery
// ====================================================

export interface IndexPageQuery_recent_nodes_childMdx_parent_ImageSharp {}

export interface IndexPageQuery_recent_nodes_childMdx_parent_File {
  sourceInstanceName: string;
}

export type IndexPageQuery_recent_nodes_childMdx_parent = IndexPageQuery_recent_nodes_childMdx_parent_ImageSharp | IndexPageQuery_recent_nodes_childMdx_parent_File;

export interface IndexPageQuery_recent_nodes_childMdx_frontmatter {
  title: string | null;
  date: any | null;
}

export interface IndexPageQuery_recent_nodes_childMdx_fields {
  route: string;
}

export interface IndexPageQuery_recent_nodes_childMdx {
  parent: IndexPageQuery_recent_nodes_childMdx_parent | null;
  frontmatter: IndexPageQuery_recent_nodes_childMdx_frontmatter | null;
  fields: IndexPageQuery_recent_nodes_childMdx_fields | null;
}

export interface IndexPageQuery_recent_nodes {
  childMdx: IndexPageQuery_recent_nodes_childMdx | null;
}

export interface IndexPageQuery_recent {
  nodes: IndexPageQuery_recent_nodes[];
}

export interface IndexPageQuery_favorites_nodes_childMdx_parent_ImageSharp {}

export interface IndexPageQuery_favorites_nodes_childMdx_parent_File {
  sourceInstanceName: string;
}

export type IndexPageQuery_favorites_nodes_childMdx_parent = IndexPageQuery_favorites_nodes_childMdx_parent_ImageSharp | IndexPageQuery_favorites_nodes_childMdx_parent_File;

export interface IndexPageQuery_favorites_nodes_childMdx_frontmatter {
  title: string | null;
  date: any | null;
}

export interface IndexPageQuery_favorites_nodes_childMdx_fields {
  route: string;
}

export interface IndexPageQuery_favorites_nodes_childMdx {
  parent: IndexPageQuery_favorites_nodes_childMdx_parent | null;
  frontmatter: IndexPageQuery_favorites_nodes_childMdx_frontmatter | null;
  fields: IndexPageQuery_favorites_nodes_childMdx_fields | null;
}

export interface IndexPageQuery_favorites_nodes {
  childMdx: IndexPageQuery_favorites_nodes_childMdx | null;
}

export interface IndexPageQuery_favorites {
  nodes: IndexPageQuery_favorites_nodes[];
}

export interface IndexPageQuery {
  recent: IndexPageQuery_recent;
  favorites: IndexPageQuery_favorites;
}
