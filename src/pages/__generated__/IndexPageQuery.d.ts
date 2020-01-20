/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IndexPageQuery
// ====================================================

export interface IndexPageQuery_recent_nodes_frontmatter {
  __typename: "MdxFrontmatter";
  title: string;
}

export interface IndexPageQuery_recent_nodes_fields {
  __typename: "MdxFields";
  route: string;
}

export interface IndexPageQuery_recent_nodes {
  __typename: "Mdx";
  frontmatter: IndexPageQuery_recent_nodes_frontmatter | null;
  fields: IndexPageQuery_recent_nodes_fields | null;
}

export interface IndexPageQuery_recent {
  __typename: "MdxConnection";
  nodes: IndexPageQuery_recent_nodes[];
}

export interface IndexPageQuery_favorites_nodes_frontmatter {
  __typename: "MdxFrontmatter";
  title: string;
}

export interface IndexPageQuery_favorites_nodes_fields {
  __typename: "MdxFields";
  route: string;
}

export interface IndexPageQuery_favorites_nodes {
  __typename: "Mdx";
  frontmatter: IndexPageQuery_favorites_nodes_frontmatter | null;
  fields: IndexPageQuery_favorites_nodes_fields | null;
}

export interface IndexPageQuery_favorites {
  __typename: "MdxConnection";
  nodes: IndexPageQuery_favorites_nodes[];
}

export interface IndexPageQuery {
  recent: IndexPageQuery_recent;
  favorites: IndexPageQuery_favorites;
}
