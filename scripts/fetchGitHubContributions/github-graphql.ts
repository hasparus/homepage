export type ContributionsInfoQueryResult = GitHub.Response<
  GitHub.Viewer<GitHub.ContributionsCollectionInfo>
>;
export const contributionsInfoQuery = `
query GetGitHubContributionsInfo {
  viewer {
    contributionsCollection {
      totalPullRequestContributions
    }
  }
}
`;

type Cursor = string;

// We're using contributoinsCollection.pullRequestContributions instead of
// repositoriesContributedTo because the latter doesn't contain older PRs,
// and we can't filter by merged status.
export type PullRequests = GitHub.Response<
  GitHub.Viewer<GitHub.contributionsCollectionPullRequests>
>;
export const pullRequestsQuery = (after?: Cursor) => `
query GetGitHubPullRequests {
  viewer {
    contributionsCollection {
      pullRequestContributions(
        ${after ? `, after: "${after}",` : ""}
        first: 100,
        orderBy: {direction: DESC}
      ) {
        edges {
          cursor
          node {
            pullRequest {
              repository {
                stargazerCount
                nameWithOwner
              }
              merged
              mergedAt
              title
            }
          }
        }
      }
    }
  }
}
`;

export declare namespace GitHub {
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
    // Edge for a private repo will be null if the access token doesn't have
    // the required scope.
    edges: Array<null | {
      cursor: string;
      node: Node;
    }>;
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

// TODO: I'll have to use `from` and `to` by years.

// contributionsCollection
// The collection of contributions this user has made to different repositories.

// ContributionsCollection!
// from: DateTime
// Only contributions made at this time or later will be counted. If omitted, defaults to a year ago.

// organizationID: ID
// The ID of the organization used to filter contributions.

// to: DateTime
// Only contributions made before and up to (including) this time will be counted. If omitted, defaults to the current time or one year from the provided from argument.
