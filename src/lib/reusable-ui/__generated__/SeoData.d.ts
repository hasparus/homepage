/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SeoData
// ====================================================

export interface SeoData_site_siteMetadata_htmlAttributes {
  lang: string | null;
}

export interface SeoData_site_siteMetadata {
  defaultTitle: string | null;
  titleTemplate: string | null;
  defaultDescription: string | null;
  siteUrl: string | null;
  htmlAttributes: SeoData_site_siteMetadata_htmlAttributes | null;
  twitterUsername: string | null;
}

export interface SeoData_site {
  siteMetadata: SeoData_site_siteMetadata | null;
}

export interface SeoData {
  site: SeoData_site | null;
}
