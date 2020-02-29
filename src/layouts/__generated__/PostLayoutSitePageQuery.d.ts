/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PostLayoutSitePageQuery
// ====================================================

export interface PostLayoutSitePageQuery_sitePage_socialLinks {
  edit: string;
  tweet: string;
}

export interface PostLayoutSitePageQuery_sitePage {
  socialLinks: PostLayoutSitePageQuery_sitePage_socialLinks | null;
}

export interface PostLayoutSitePageQuery {
  sitePage: PostLayoutSitePageQuery_sitePage | null;
}

export interface PostLayoutSitePageQueryVariables {
  id: string;
}
