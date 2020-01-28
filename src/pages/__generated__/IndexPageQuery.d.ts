/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IndexPageQuery
// ====================================================

export interface IndexPageQuery_recent_nodes_frontmatter {
  title: string;
}

export interface IndexPageQuery_recent_nodes_fields {
  route: string;
}

export interface IndexPageQuery_recent_nodes {
  frontmatter: IndexPageQuery_recent_nodes_frontmatter | null;
  fields: IndexPageQuery_recent_nodes_fields | null;
}

export interface IndexPageQuery_recent {
  nodes: IndexPageQuery_recent_nodes[];
}

export interface IndexPageQuery_favorites_nodes_frontmatter {
  title: string;
}

export interface IndexPageQuery_favorites_nodes_fields {
  route: string;
}

export interface IndexPageQuery_favorites_nodes {
  frontmatter: IndexPageQuery_favorites_nodes_frontmatter | null;
  fields: IndexPageQuery_favorites_nodes_fields | null;
}

export interface IndexPageQuery_favorites {
  nodes: IndexPageQuery_favorites_nodes[];
}

export interface IndexPageQuery {
  recent: IndexPageQuery_recent;
  favorites: IndexPageQuery_favorites;
}
