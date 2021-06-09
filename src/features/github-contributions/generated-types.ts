/* eslint-disable @typescript-eslint/no-namespace */
export declare namespace GitHubGenerated {
  export namespace Response {
    export type Success<T> = { data: T };
    export type Errors =
      | {
          errors: { message: string }[];
        }
      | {
          message: string;
          documentation_url: string;
        };
  }

  export type Response<T> = Response.Success<T> | Response.Errors;

  export interface Viewer<ContributionsCollection extends object> {
    viewer: {
      contributionsCollection: ContributionsCollection;
    };
  }

  export interface ContributionsCollectionInfo {
    totalPullRequestContributions: number;
    totalCommitContributions: number;
    totalIssueContributions: number;
    totalPullRequestReviewContributions: number;
    popularPullRequestContribution: PopularPullRequestContribution;
  }

  export interface contributionsCollectionPullRequests {
    pullRequestContributions: PullRequestContributions;
  }

  export interface PopularPullRequestContribution {
    pullRequest: PopularPullRequest;
  }

  export interface PopularPullRequest {
    title: string;
    repository: {
      nameWithOwner: string;
    };
  }

  export interface PullRequestContributions {
    edges: {
      cursor: string;
      node: Node;
    }[];
  }

  export interface Node {
    pullRequest: PullRequest;
  }

  export interface PullRequest {
    repository: Repository;
    merged: boolean;
    // title: string;
    // mergedAt: string | Date | null;
  }

  export interface Repository {
    stargazerCount: number;
    nameWithOwner: string;
  }
}
