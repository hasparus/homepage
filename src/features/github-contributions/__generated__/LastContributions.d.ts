/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LastContributions
// ====================================================

export interface LastContributions_allGhContributions_nodes_mergedRepositories {
  nameWithOwner: string;
}

export interface LastContributions_allGhContributions_nodes {
  mergedRepositories: LastContributions_allGhContributions_nodes_mergedRepositories[];
}

export interface LastContributions_allGhContributions {
  nodes: LastContributions_allGhContributions_nodes[];
}

export interface LastContributions {
  allGhContributions: LastContributions_allGhContributions;
}
