/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSpeakingRaports
// ====================================================

export interface GetSpeakingRaports_allMdx_nodes_frontmatter_venues {
  name: string;
  link: string | null;
}

export interface GetSpeakingRaports_allMdx_nodes_frontmatter {
  title: string | null;
  spoiler: string | null;
  date: any | null;
  venues: GetSpeakingRaports_allMdx_nodes_frontmatter_venues[] | null;
}

export interface GetSpeakingRaports_allMdx_nodes_fields {
  route: string;
}

export interface GetSpeakingRaports_allMdx_nodes {
  frontmatter: GetSpeakingRaports_allMdx_nodes_frontmatter | null;
  fields: GetSpeakingRaports_allMdx_nodes_fields | null;
}

export interface GetSpeakingRaports_allMdx {
  nodes: GetSpeakingRaports_allMdx_nodes[];
}

export interface GetSpeakingRaports {
  allMdx: GetSpeakingRaports_allMdx;
}
