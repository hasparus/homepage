/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBlogPostData
// ====================================================

export interface GetBlogPostData_allMdx_nodes_frontmatter {
  title: string | null;
  spoiler: string | null;
  date: any | null;
}

export interface GetBlogPostData_allMdx_nodes_fields {
  route: string;
  readingTime: number;
}

export interface GetBlogPostData_allMdx_nodes {
  frontmatter: GetBlogPostData_allMdx_nodes_frontmatter | null;
  fields: GetBlogPostData_allMdx_nodes_fields | null;
}

export interface GetBlogPostData_allMdx {
  nodes: GetBlogPostData_allMdx_nodes[];
}

export interface GetBlogPostData {
  allMdx: GetBlogPostData_allMdx;
}
