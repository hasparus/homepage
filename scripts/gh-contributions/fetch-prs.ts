import { __dirname, VERBOSE } from "./env";
import { createFsCache } from "./fs-utils";
import {
  type GitHub,
  type GitHubPullRequestsQueryResponse,
  GitHubPullRequestsQuery,
  GitHubPullRequestsQueryVariables,
} from "./github-graphql";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const IGNORE_CACHE =
  process.env.IGNORE_CACHE === "true" || process.env.IGNORE_CACHE === "1";

const CACHE_DURATION = 1000 * 3600 * 48;

export async function fetchViewerPullRequests(): Promise<FetchViewerPullRequestsResult> {
  const fsCache = createFsCache(`${__dirname}/out/prs.json`);

  console.log("Fetching GitHub contributions...");

  const fromCache =
    (await fsCache.read()) as FetchViewerPullRequestsResult | null;

  if (
    !IGNORE_CACHE &&
    fromCache &&
    fromCache.timestamp - Date.now() < CACHE_DURATION
  ) {
    return fromCache;
  }

  const pullRequests = await getMergedPullRequests();

  if (VERBOSE) console.debug({ pullRequests });

  const contributions: FetchViewerPullRequestsResult = {
    timestamp: Date.now(),
    pullRequestsByYear: pullRequests,
  };

  await fsCache.write(contributions);

  return contributions;
}

await fetchViewerPullRequests();

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
  const prsByYear: FetchViewerPullRequestsResult["pullRequestsByYear"] = {};
  let response: Awaited<ReturnType<typeof getEdges>>;

  while (true) {
    console.log(`Fetching PRs for ${year}...`);
    const yearVars: Pick<GitHubPullRequestsQueryVariables, "from" | "to"> = {
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`,
    };
    response = await getEdges(yearVars);

    if (response.pullRequests.length === 0) break;

    prsByYear[year] = [response.pullRequests];

    let { cursor } = response;
    while (cursor) {
      console.log(
        `[${year}] after cursor "${cursor}".`,
        `${prsByYear[year]!.flat().length} / ${
          response.totalPullRequestContributions
        }`
      );
      response = await getEdges({ ...yearVars, after: cursor });
      prsByYear[year]!.push(response.pullRequests);
      cursor = response.cursor;
    }

    year -= 1;
  }

  return prsByYear;
}

export interface FetchViewerPullRequestsResult {
  timestamp: number;
  pullRequestsByYear: Record<number, GitHub.PullRequest[][]>;
}
