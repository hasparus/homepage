/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SpeakingRaportsQuery
// ====================================================

export interface SpeakingRaportsQuery_allMdx_nodes_frontmatter_venues {
  name: string;
}

export interface SpeakingRaportsQuery_allMdx_nodes_frontmatter {
  title: string;
  spoiler: string;
  date: any;
  venues: SpeakingRaportsQuery_allMdx_nodes_frontmatter_venues[] | null;
}

export interface SpeakingRaportsQuery_allMdx_nodes_fields {
  route: string;
}

export interface SpeakingRaportsQuery_allMdx_nodes {
  frontmatter: SpeakingRaportsQuery_allMdx_nodes_frontmatter | null;
  fields: SpeakingRaportsQuery_allMdx_nodes_fields | null;
}

export interface SpeakingRaportsQuery_allMdx {
  nodes: SpeakingRaportsQuery_allMdx_nodes[];
}

export interface SpeakingRaportsQuery {
  allMdx: SpeakingRaportsQuery_allMdx;
}
