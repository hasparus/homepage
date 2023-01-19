import { readFile, writeFile } from "fs/promises";

const MIN_STARGAZERS = 5;
const FETCHED_PRS_HUNDREDS = 2;

const VERBOSE = (import.meta.env.DEBUG || "").includes("github-contributions");

// I already mention I contribute to Theme UI
const IGNORED_REPOS = ["theme-ui", "dethcrypto"];
// my own orgs, work and friends
const IGNORED_OWNERS = ["zagrajmy", "Flick-Tech", "ChopChopOrg", "Zolwiastyl"];

export async function getGitHubContributions() {
  const infoRes = (await gqlRequest(
    contributionsInfoQuery
  )) as ContributionsInfo;

  panicOnErrors(infoRes);

  const pullRequests = await getMergedPullRequests();

  if (VERBOSE) console.debug({ pullRequests });

  const repositoriesSet = new Set();

  const repositoriesWithMergedPRs = pullRequests.filter((repo) => {
    if (repositoriesSet.has(repo.nameWithOwner)) {
      return false;
    }
    repositoriesSet.add(repo.nameWithOwner);
    return true;
  });

  const contributions = {
    timestamp: Date.now(),
    info: infoRes.data.viewer.contributionsCollection,
    repositoriesWithMergedPRs,
  };

  return contributions;
}

type ContributionsInfo = GitHub.Response<
  GitHub.Viewer<GitHub.ContributionsCollectionInfo>
>;
const contributionsInfoQuery = `
  query GetGitHubContributionsInfo {
    viewer {
      contributionsCollection {
        totalPullRequestContributions
        totalCommitContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        popularPullRequestContribution {
          pullRequest {
            title
            repository {
              stargazerCount
              nameWithOwner
            }
          }
        }
      }
    }
  }
`;

type Cursor = string;

type PullRequests = GitHub.Response<
  GitHub.Viewer<GitHub.contributionsCollectionPullRequests>
>;
const pullRequestsQuery = (after?: Cursor) => `
  query GetGitHubContributions {
    viewer {
      contributionsCollection {
        pullRequestContributions(
          ${after ? `, after: "${after}",` : ""}
          first: 100,
          excludePopular: true,
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

async function gqlRequest(query: string) {
  if (!process.env.GITHUB_TOKEN) {
    console.error("🔥 process.env.GITHUB_TOKEN is missing!");
  }

  return (await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((res) => res.json())) as unknown;
}

function panicOnErrors<T>(
  res: GitHub.Response<T>,
  ctx: object = {}
): asserts res is GitHub.Response.Success<T> {
  if ("errors" in res || "message" in res) {
    console.dir(
      {
        ...res,
        ...ctx,
      },
      { depth: Infinity }
    );

    const message = "message" in res ? res.message : res.errors[0]?.message;
    throw new Error(message);
  }
}

async function getMergedPullRequests() {
  const getEdges = async (...args: Parameters<typeof pullRequestsQuery>) => {
    const query = pullRequestsQuery(...args);
    const res = (await gqlRequest(query)) as PullRequests;

    panicOnErrors(res, { query });

    if (VERBOSE) {
      console.debug(">> getMergedPullRequests res", res);
    }

    return res.data.viewer.contributionsCollection.pullRequestContributions
      .edges;
  };

  let pullRequests = await getEdges();

  for (let i = 0; i < FETCHED_PRS_HUNDREDS; ++i) {
    const last = pullRequests[pullRequests.length - 1];
    if (last) {
      pullRequests = pullRequests.concat(await getEdges(last.cursor));
    }
  }

  return pullRequests
    .filter((pr) => {
      const { merged, repository } = pr.node.pullRequest;
      if (!merged || repository.stargazerCount < MIN_STARGAZERS) {
        return false;
      }

      const [owner, repo] = repository.nameWithOwner.split("/");

      if (!owner || !repo) {
        throw new Error("nameWithOwner must look like `:owner/:name`");
      }

      return !IGNORED_OWNERS.includes(owner) && !IGNORED_REPOS.includes(repo);
    })
    .map((pr) => pr.node.pullRequest.repository);
}

const cachePath = `${__dirname}/__contributions-cache.json`;

const fsCache = {
  write: async (data: object) => {
    await writeJson(cachePath, data);
  },
  read: async () => {
    try {
      const content = await readJson(cachePath);
      return content;
    } catch (_err) {
      return null;
    }
  },
};

async function writeJson(path: string, data: unknown) {
  await writeFile(path, JSON.stringify(data, null, 2), "utf8");
}

async function readJson(path: string) {
  const content = await readFile(path, "utf8");
  return JSON.parse(content) as unknown;
}

export interface Contributions {
  timestamp: number;
  info: GitHub.ContributionsCollectionInfo;
  repositoriesWithMergedPRs: GitHub.Repository[];
}

declare namespace GitHub {
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
