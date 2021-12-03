/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: GatsbyGardenReferencesOnMdx
// ====================================================

export interface GatsbyGardenReferencesOnMdx_outboundReferences_fields {
  title: string | null;
  route: string;
}

export interface GatsbyGardenReferencesOnMdx_outboundReferences {
  fields: GatsbyGardenReferencesOnMdx_outboundReferences_fields | null;
  excerpt: string;
}

export interface GatsbyGardenReferencesOnMdx_inboundReferences_node_fields {
  title: string | null;
  route: string;
}

export interface GatsbyGardenReferencesOnMdx_inboundReferences_node {
  fields: GatsbyGardenReferencesOnMdx_inboundReferences_node_fields | null;
}

export interface GatsbyGardenReferencesOnMdx_inboundReferences {
  node: GatsbyGardenReferencesOnMdx_inboundReferences_node;
  paragraph: string;
}

export interface GatsbyGardenReferencesOnMdx {
  outboundReferences: GatsbyGardenReferencesOnMdx_outboundReferences[];
  inboundReferences: GatsbyGardenReferencesOnMdx_inboundReferences[];
}
