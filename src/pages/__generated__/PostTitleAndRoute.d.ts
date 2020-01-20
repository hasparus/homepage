/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PostTitleAndRoute
// ====================================================

export interface PostTitleAndRoute_nodes_frontmatter {
  __typename: "MdxFrontmatter";
  title: string;
}

export interface PostTitleAndRoute_nodes_fields {
  __typename: "MdxFields";
  route: string;
}

export interface PostTitleAndRoute_nodes {
  __typename: "Mdx";
  frontmatter: PostTitleAndRoute_nodes_frontmatter | null;
  fields: PostTitleAndRoute_nodes_fields | null;
}

export interface PostTitleAndRoute {
  __typename: "MdxConnection";
  nodes: PostTitleAndRoute_nodes[];
}
