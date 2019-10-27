/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlogPostsQuery
// ====================================================

export interface BlogPostsQuery_allMdx_nodes_frontmatter {
  __typename: "MdxFrontmatter";
  title: string;
  spoiler: string;
  date: any;
}

export interface BlogPostsQuery_allMdx_nodes_fields {
  __typename: "MdxFields";
  route: string;
}

export interface BlogPostsQuery_allMdx_nodes {
  __typename: "Mdx";
  timeToRead: number | null;
  frontmatter: BlogPostsQuery_allMdx_nodes_frontmatter | null;
  fields: BlogPostsQuery_allMdx_nodes_fields | null;
}

export interface BlogPostsQuery_allMdx {
  __typename: "MdxConnection";
  nodes: BlogPostsQuery_allMdx_nodes[];
}

export interface BlogPostsQuery {
  allMdx: BlogPostsQuery_allMdx;
}
