export type Cursor = string & { _brand: "Cursor" };
export type DateISOString =
  `${number}-${number}-${number}T${number}:${number}:${number}Z`;

// We're using contributoinsCollection.pullRequestContributions instead of
// repositoriesContributedTo because the latter doesn't contain older PRs,
// and we can't filter by merged status.
export type GitHubPullRequestsQueryResponse = GitHub.Response<
  GitHub.Viewer<GitHub.contributionsCollectionPullRequests>
>;

export interface GitHubPullRequestsQueryVariables {
  after?: Cursor;
  from: DateISOString;
  to: DateISOString;
}

export const GitHubPullRequestsQuery = `
query GitHubPullRequests(
  $after: String
  $from: DateTime!
  $to: DateTime!
) {
  viewer {
    contributionsCollection(
      from: $from,
      to: $to
    ) {
      totalPullRequestContributions
      pullRequestContributions(
        after: $after,
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

  export interface contributionsCollectionPullRequests {
    pullRequestContributions: PullRequestContributions;
    totalPullRequestContributions: number;
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
      cursor: Cursor;
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
