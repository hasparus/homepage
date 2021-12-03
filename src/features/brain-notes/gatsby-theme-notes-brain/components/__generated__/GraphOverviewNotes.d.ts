/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GraphOverviewNotes
// ====================================================

export interface GraphOverviewNotes_allFile_nodes_childMdx_fields {
  title: string | null;
  route: string;
}

export interface GraphOverviewNotes_allFile_nodes_childMdx_outboundReferences_fields {
  route: string;
}

export interface GraphOverviewNotes_allFile_nodes_childMdx_outboundReferences {
  fields: GraphOverviewNotes_allFile_nodes_childMdx_outboundReferences_fields | null;
}

export interface GraphOverviewNotes_allFile_nodes_childMdx {
  fields: GraphOverviewNotes_allFile_nodes_childMdx_fields | null;
  outboundReferences: GraphOverviewNotes_allFile_nodes_childMdx_outboundReferences[];
}

export interface GraphOverviewNotes_allFile_nodes {
  /**
   * Returns the first child node of type Mdx or null if there are no children of given type on this node
   */
  childMdx: GraphOverviewNotes_allFile_nodes_childMdx | null;
}

export interface GraphOverviewNotes_allFile {
  nodes: GraphOverviewNotes_allFile_nodes[];
}

export interface GraphOverviewNotes {
  allFile: GraphOverviewNotes_allFile;
}
