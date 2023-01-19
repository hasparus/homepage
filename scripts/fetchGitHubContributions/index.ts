// TODO: Use Turbo Remote Caching for this.

import { readFile, writeFile } from "fs/promises";

import nextEnv from "@next/env";

import {
  contributionsInfoQuery,
  ContributionsInfoQueryResult,
  GitHub,
  PullRequests,
  pullRequestsQuery,
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
const IGNORED_REPOS = ["theme-ui", "dethcrypto"];
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

  const infoRes = (await gqlRequest(
    contributionsInfoQuery
  )) as ContributionsInfoQueryResult;

  panicOnErrors(infoRes);

  const pullRequests = await getMergedPullRequests(
    infoRes.data.viewer.contributionsCollection.totalPullRequestContributions
  );

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

  await fsCache.write(contributions);

  return contributions;
}

await fetchGitHubContributions();

// ---

async function gqlRequest(query: string) {
  if (!GITHUB_TOKEN) {
    throw new Error("🔥 process.env.GITHUB_TOKEN is missing!");
  }

  return (await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
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

async function getMergedPullRequests(totalPullRequestContributions: number) {
  const getEdges = async (...args: Parameters<typeof pullRequestsQuery>) => {
    const query = pullRequestsQuery(...args);
    const res = (await gqlRequest(query)) as PullRequests;

    panicOnErrors(res, { query });

    if (VERBOSE) {
      console.dir(res, { depth: 99 });
    }

    return res.data.viewer.contributionsCollection.pullRequestContributions
      .edges;
  };

  let pullRequests = await getEdges();

  for (let i = 0; i < totalPullRequestContributions / 100; ++i) {
    const last = pullRequests[pullRequests.length - 1];
    if (last) {
      pullRequests = pullRequests.concat(await getEdges(last.cursor));
    }
  }

  return pullRequests
    .filter((pr): pr is Exclude<typeof pr, null> => !!pr)
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
  info: GitHub.ContributionsCollectionInfo;
  repositoriesWithMergedPRs: GitHub.Repository[];
}
