/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostTitleAndRoute
// ====================================================

export interface PostTitleAndRoute_nodes_frontmatter {
  title: string;
}

export interface PostTitleAndRoute_nodes_fields {
  route: string;
}

export interface PostTitleAndRoute_nodes {
  frontmatter: PostTitleAndRoute_nodes_frontmatter | null;
  fields: PostTitleAndRoute_nodes_fields | null;
}

export interface PostTitleAndRoute {
  nodes: PostTitleAndRoute_nodes[];
}
