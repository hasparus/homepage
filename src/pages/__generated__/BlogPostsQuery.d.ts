/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlogPostsQuery
// ====================================================

export interface BlogPostsQuery_allMdx_nodes_frontmatter {
  title: string | null;
  spoiler: string | null;
  date: any | null;
}

export interface BlogPostsQuery_allMdx_nodes_fields {
  route: string;
  readingTime: number;
}

export interface BlogPostsQuery_allMdx_nodes {
  frontmatter: BlogPostsQuery_allMdx_nodes_frontmatter | null;
  fields: BlogPostsQuery_allMdx_nodes_fields | null;
}

export interface BlogPostsQuery_allMdx {
  nodes: BlogPostsQuery_allMdx_nodes[];
}

export interface BlogPostsQuery {
  allMdx: BlogPostsQuery_allMdx;
}
