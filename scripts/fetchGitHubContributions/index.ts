// TODO: Use Turbo Remote Caching for this.

import { readFile, writeFile } from "fs/promises";

import nextEnv from "@next/env";

import {
  type GitHub,
  type GitHubPullRequestsQueryResponse,
  GitHubPullRequestsQuery,
  GitHubPullRequestsQueryVariables,
} from "./github-graphql";

const __dirname = new URL(".", import.meta.url).pathname;
nextEnv.loadEnvConfig(`${__dirname}../..`);

const DEBUG = process.env.DEBUG || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const IGNORE_CACHE =
  process.env.IGNORE_CACHE === "true" || process.env.IGNORE_CACHE === "1";

const MIN_STARGAZERS = 5;
const CACHE_DURATION = 1000 * 3600 * 48;

const VERBOSE = DEBUG.includes("contributions");

// I already mention I contribute to Theme UI
const IGNORED_REPOS: string | string[] = [];
// my own orgs, work and friends
const IGNORED_OWNERS = ["zagrajmy", "Flick-Tech", "ChopChopOrg", "Zolwiastyl"];

export async function fetchGitHubContributions(): Promise<Contributions> {
  const fsCache = createFsCache(`${__dirname}/.cache/contributions.json`);

  console.log("Fetching GitHub contributions...");

  const fromCache = (await fsCache.read()) as Contributions | null;

  if (
    !IGNORE_CACHE &&
    fromCache &&
    fromCache.timestamp - Date.now() < CACHE_DURATION
  ) {
    return fromCache;
  }

  const pullRequests = await getMergedPullRequests();

  if (VERBOSE) console.debug({ pullRequests });

  const repositoriesSet = new Set();
  const repositoriesWithMergedPRs = Object.values(pullRequests)
    .flat(2)
    .filter((pr) => {
      const {
        merged,
        repository: { nameWithOwner, stargazerCount },
      } = pr;

      if (repositoriesSet.has(nameWithOwner)) return false;
      repositoriesSet.add(nameWithOwner);

      if (!merged || stargazerCount < MIN_STARGAZERS) return false;

      const [owner, repo] = nameWithOwner.split("/");
      if (!owner || !repo) {
        throw new Error("nameWithOwner must look like `:owner/:name`");
      }

      return !(IGNORED_REPOS.includes(repo) || IGNORED_OWNERS.includes(owner));
    })
    .map((pr) => pr.repository);

  const contributions: Contributions = {
    timestamp: Date.now(),
    pullRequestsByYear: pullRequests,
    repositoriesWithMergedPRs,
  };

  await fsCache.write(contributions);

  return contributions;
}

await fetchGitHubContributions();

// ---

async function fetchPRs(query: string, variables: object = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error("🔥 process.env.GITHUB_TOKEN is missing!");
  }

  return (await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  }).then((res) => res.json())) as unknown;
}

function panicOnErrors<T>(
  res: GitHub.Response<T>,
  ctx: object = {}
): asserts res is GitHub.Response.Success<T> {
  if ("errors" in res || "message" in res) {
    console.dir({ ...res, ...ctx }, { depth: Infinity });

    const message = "message" in res ? res.message : res.errors[0]?.message;
    throw new Error(message);
  }
}

async function getMergedPullRequests() {
  const getEdges = async (variables: GitHubPullRequestsQueryVariables) => {
    const response = await fetchPRs(GitHubPullRequestsQuery, variables);

    const res = response as GitHubPullRequestsQueryResponse;

    panicOnErrors(res, { variables });

    if (VERBOSE) {
      console.dir(res, { depth: 99 });
    }

    const { pullRequestContributions, totalPullRequestContributions } =
      res.data.viewer.contributionsCollection;

    const edges = pullRequestContributions.edges.filter(
      (edge): edge is Exclude<typeof edge, null> => !!edge
    );

    return {
      totalPullRequestContributions,
      pullRequests: edges.map((edge) => edge.node.pullRequest),
      cursor: edges[edges.length - 1]?.cursor,
    };
  };

  let year = new Date().getFullYear();
  const prsByYear: Contributions["pullRequestsByYear"] = {};
  let response: Awaited<ReturnType<typeof getEdges>>;

  do {
    const yearVars: Pick<GitHubPullRequestsQueryVariables, "from" | "to"> = {
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`,
    };
    response = await getEdges(yearVars);

    prsByYear[year] = [response.pullRequests];

    let { cursor } = response;
    while (cursor) {
      response = await getEdges({ ...yearVars, after: cursor });
      prsByYear[year]!.push(response.pullRequests);
      cursor = response.cursor;
    }

    year -= 1;
  } while (response.pullRequests.length > 0);

  return prsByYear;
}

function createFsCache(cachePath: string) {
  return {
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
}

async function writeJson(path: string, data: unknown) {
  await writeFile(path, JSON.stringify(data, null, 2), "utf8");
}

async function readJson(path: string) {
  const content = await readFile(path, "utf8");
  return JSON.parse(content) as unknown;
}

export interface Contributions {
  timestamp: number;
  pullRequestsByYear: Record<number, GitHub.PullRequest[][]>;
  repositoriesWithMergedPRs: GitHub.Repository[];
}
