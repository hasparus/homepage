/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNote
// ====================================================

export interface GetNote_file_childMdx_outboundReferences_fields {
  route: string;
}

export interface GetNote_file_childMdx_outboundReferences_parent_ImageSharp {
  id: string;
}

export interface GetNote_file_childMdx_outboundReferences_parent_File_fields {
  title: string | null;
}

export interface GetNote_file_childMdx_outboundReferences_parent_File {
  id: string;
  fields: GetNote_file_childMdx_outboundReferences_parent_File_fields | null;
}

export type GetNote_file_childMdx_outboundReferences_parent = GetNote_file_childMdx_outboundReferences_parent_ImageSharp | GetNote_file_childMdx_outboundReferences_parent_File;

export interface GetNote_file_childMdx_outboundReferences {
  body: string;
  fields: GetNote_file_childMdx_outboundReferences_fields | null;
  parent: GetNote_file_childMdx_outboundReferences_parent | null;
}

export interface GetNote_file_childMdx_inboundReferences_parent_ImageSharp {
  id: string;
}

export interface GetNote_file_childMdx_inboundReferences_parent_File_fields {
  title: string | null;
}

export interface GetNote_file_childMdx_inboundReferences_parent_File {
  id: string;
  fields: GetNote_file_childMdx_inboundReferences_parent_File_fields | null;
}

export type GetNote_file_childMdx_inboundReferences_parent = GetNote_file_childMdx_inboundReferences_parent_ImageSharp | GetNote_file_childMdx_inboundReferences_parent_File;

export interface GetNote_file_childMdx_inboundReferences {
  body: string;
  parent: GetNote_file_childMdx_inboundReferences_parent | null;
}

export interface GetNote_file_childMdx {
  body: string;
  outboundReferences: GetNote_file_childMdx_outboundReferences[];
  inboundReferences: GetNote_file_childMdx_inboundReferences[];
}

export interface GetNote_file_fields {
  title: string | null;
}

export interface GetNote_file {
  childMdx: GetNote_file_childMdx | null;
  fields: GetNote_file_fields | null;
}

export interface GetNote {
  file: GetNote_file | null;
}

export interface GetNoteVariables {
  id: string;
}
