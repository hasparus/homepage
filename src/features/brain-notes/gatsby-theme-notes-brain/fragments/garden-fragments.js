// @ts-check

import { graphql } from "gatsby";

export const references = graphql`
  fragment GatsbyGardenReferences on Mdx {
    outboundReferences {
      ... on Mdx {
        fields {
          route
        }
        parent {
          ... on File {
            fields {
              title
            }
          }
        }
      }
    }
    inboundReferences {
      ... on Mdx {
        fields {
          route
        }
        parent {
          ... on File {
            fields {
              title
            }
          }
        }
      }
    }
  }
`;
