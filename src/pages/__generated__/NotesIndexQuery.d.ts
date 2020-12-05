/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NotesIndexQuery
// ====================================================

export interface NotesIndexQuery_allFile_nodes_childMdx_fields_history_entries {
  subject: string | null;
  authorDate: any;
  abbreviatedCommit: string | null;
}

export interface NotesIndexQuery_allFile_nodes_childMdx_fields_history {
  entries: NotesIndexQuery_allFile_nodes_childMdx_fields_history_entries[];
  url: string;
}

export interface NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage_childImageSharp_original {
  width: number | null;
  height: number | null;
  src: string | null;
}

export interface NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage_childImageSharp {
  original: NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage_childImageSharp_original | null;
}

export interface NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage {
  childImageSharp: NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage_childImageSharp | null;
}

export interface NotesIndexQuery_allFile_nodes_childMdx_fields {
  title: string | null;
  route: string;
  history: NotesIndexQuery_allFile_nodes_childMdx_fields_history | null;
  socialImage: NotesIndexQuery_allFile_nodes_childMdx_fields_socialImage | null;
}

export interface NotesIndexQuery_allFile_nodes_childMdx {
  fields: NotesIndexQuery_allFile_nodes_childMdx_fields | null;
}

export interface NotesIndexQuery_allFile_nodes {
  childMdx: NotesIndexQuery_allFile_nodes_childMdx | null;
}

export interface NotesIndexQuery_allFile {
  nodes: NotesIndexQuery_allFile_nodes[];
}

export interface NotesIndexQuery {
  allFile: NotesIndexQuery_allFile;
}
