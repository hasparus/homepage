/* eslint-disable @typescript-eslint/require-await */
import { CreateSchemaCustomizationArgs, GatsbyNode } from "gatsby";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = async ({
  actions,
}: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type GHRepository {
      stargazerCount: Int!
      nameWithOwner: String!
    }

    type GHContributionsInfoPopularPullRequestContribution {
      pullRequest: GHContributionsInfoPopularPullRequestContributionPullRequest!
    }

    type GHContributionsInfoPopularPullRequestContributionPullRequest {
      title: String!
      repository: GHRepository!
    }

    type GHContributionsInfo {
      totalPullRequestContributions: Int!
      totalCommitContributions: Int!
      totalIssueContributions: Int!
      totalPullRequestReviewContributions: Int!
      popularPullRequestContribution: GHContributionsInfoPopularPullRequestContribution!
    }

    type GHContributions implements Node {
      id: ID!
      parent: Node
      children: [Node!]!
      timestamp: Float!
      info: GHContributionsInfo!
      repositoriesWithMergedPRs: [GHRepository!]!
    }
  `);
};
