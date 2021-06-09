import { readJson, stat, writeJson } from "fs-extra";
import { GatsbyNode, SourceNodesArgs } from "gatsby";
import fetch from "node-fetch";

import { assert } from "../../lib/util";

import { NODE_TYPE } from "./common";
import type { GitHubGenerated as GitHub } from "./generated-types";

// I already mention I contribute tDo Theme UI
const IGNORED_REPOS = ["theme-ui"];
// my own orgs, work and friends
const IGNORED_OWNERS = [
  "zagrajmy",
  "Flick-Tech",
  "ChopChopOrg",
  "Zolwiastyl",
];

const MIN_STARGAZERS = 5;

const CACHE_DURATION = 1000 * 3600 * 48;

const FETCHED_PRS_HUNDREDS = 2;

const CAN_CACHE = process.env.NO_CACHE !== "true";

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
  const getEdges = async (
    ...args: Parameters<typeof pullRequestsQuery>
  ) => {
    const query = pullRequestsQuery(...args);
    const res = (await gqlRequest(query)) as PullRequests;

    panicOnErrors(res, { query });

    console.debug(">> res", res);

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

      assert(owner && repo, "nameWithOwner must look like `:owner/:name`");

      return (
        !IGNORED_OWNERS.includes(owner) && !IGNORED_REPOS.includes(repo)
      );
    })
    .map((pr) => pr.node.pullRequest.repository);
}

const cachePath = `${__dirname}/__contributions-cache.json`;

const fsCache = {
  write: async (data: object) => {
    await writeJson(cachePath, data, {
      spaces: 2,
    });
  },
  read: async () => {
    try {
      const content = (await readJson(cachePath)) as unknown;
      return content;
    } catch (_err) {
      return null;
    }
  },
};

export interface Contributions {
  timestamp: number;
  info: GitHub.ContributionsCollectionInfo;
  repositoriesWithMergedPRs: GitHub.Repository[];
}

async function fetchContributions(): Promise<Contributions> {
  const infoRes = (await gqlRequest(
    contributionsInfoQuery
  )) as ContributionsInfo;

  panicOnErrors(infoRes);

  const pullRequests = await getMergedPullRequests();

  console.debug({ pullRequests });

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

export const sourceNodes: GatsbyNode["sourceNodes"] = async ({
  actions,
  cache,
  createNodeId,
  createContentDigest,
}: SourceNodesArgs) => {
  const { createNode } = actions;

  let contributions: Contributions | undefined;

  if (CAN_CACHE) {
    const fromCache = (await (process.env.CI
      ? cache.get("haspar.us|contributions")
      : fsCache.read())) as Contributions | null;

    if (fromCache && fromCache.timestamp - Date.now() < CACHE_DURATION) {
      contributions = fromCache;
    }
  }

  if (!contributions) {
    contributions = await fetchContributions();

    if (CAN_CACHE) {
      if (process.env.CI) {
        await cache.set("haspar.us|contributions", contributions);
      } else {
        await fsCache.write(contributions);
      }
    }
  }

  createNode({
    ...contributions,
    id: createNodeId(`${NODE_TYPE}-0`),
    parent: null,
    children: [],
    internal: {
      type: NODE_TYPE,
      content: JSON.stringify(contributions),
      contentDigest: createContentDigest(contributions),
    },
  });
};
