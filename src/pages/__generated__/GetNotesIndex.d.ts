/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNotesIndex
// ====================================================

export interface GetNotesIndex_allFile_nodes_childMdx_fields_history_entries {
  subject: string | null;
  authorDate: any;
  abbreviatedCommit: string | null;
}

export interface GetNotesIndex_allFile_nodes_childMdx_fields_history {
  entries: GetNotesIndex_allFile_nodes_childMdx_fields_history_entries[];
  url: string;
}

export interface GetNotesIndex_allFile_nodes_childMdx_fields_socialImage_childImageSharp_original {
  width: number | null;
  height: number | null;
  src: string | null;
}

export interface GetNotesIndex_allFile_nodes_childMdx_fields_socialImage_childImageSharp {
  original: GetNotesIndex_allFile_nodes_childMdx_fields_socialImage_childImageSharp_original | null;
}

export interface GetNotesIndex_allFile_nodes_childMdx_fields_socialImage {
  /**
   * Returns the first child node of type ImageSharp or null if there are no children of given type on this node
   */
  childImageSharp: GetNotesIndex_allFile_nodes_childMdx_fields_socialImage_childImageSharp | null;
}

export interface GetNotesIndex_allFile_nodes_childMdx_fields {
  title: string | null;
  route: string;
  history: GetNotesIndex_allFile_nodes_childMdx_fields_history | null;
  socialImage: GetNotesIndex_allFile_nodes_childMdx_fields_socialImage | null;
}

export interface GetNotesIndex_allFile_nodes_childMdx {
  fields: GetNotesIndex_allFile_nodes_childMdx_fields | null;
}

export interface GetNotesIndex_allFile_nodes {
  /**
   * Returns the first child node of type Mdx or null if there are no children of given type on this node
   */
  childMdx: GetNotesIndex_allFile_nodes_childMdx | null;
}

export interface GetNotesIndex_allFile {
  nodes: GetNotesIndex_allFile_nodes[];
}

export interface GetNotesIndex {
  allFile: GetNotesIndex_allFile;
}
