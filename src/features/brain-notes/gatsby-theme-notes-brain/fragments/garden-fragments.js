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
        excerpt(pruneLength: 200)
      }
    }
    inboundReferences {
      node {
        ... on Mdx {
          fields {
            title
            route
          }
        }
      }
      paragraph
    }
  }
`;
