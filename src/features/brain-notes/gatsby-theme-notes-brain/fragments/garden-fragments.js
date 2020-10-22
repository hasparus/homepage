// @ts-check

import { graphql } from "gatsby";

export const references = graphql`
  fragment GatsbyGardenReferencesOnMdx on Mdx {
    outboundReferences {
      ... on Mdx {
        fields {
          title
          route
        }
      }
    }
    inboundReferences {
      ... on Mdx {
        fields {
          title
          route
        }
      }
    }
  }
`;
