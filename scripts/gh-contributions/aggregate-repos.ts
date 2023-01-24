import { __dirname } from "./env";
import type { FetchViewerPullRequestsResult } from "./fetch-prs";
import { readJson, writeJson } from "./fs-utils";

const MIN_STARGAZERS = 5;
const IGNORED_REPOS_SUBSTRINGS: string[] = [];

async function aggregateRepositoriesContributedTo() {
  const json = await readJson(`${__dirname}/out/prs.json`);
  if (!json) throw new Error("");

  const pullRequests = json as FetchViewerPullRequestsResult;

  const pullRequestsByRepo = new Map<string, number>();
  const repositoriesWithMergedPRs = Object.values(
    pullRequests.pullRequestsByYear
  )
    .flat(2)
    .filter((pr) => {
      const {
        merged,
        repository: { nameWithOwner, stargazerCount },
      } = pr;

      if (!merged || stargazerCount < MIN_STARGAZERS) return false;

      const [owner, repo] = nameWithOwner.split("/");
      if (!owner || !repo) {
        throw new Error("nameWithOwner must look like `:owner/:name`");
      }

      const count = pullRequestsByRepo.get(nameWithOwner) || 0;
      pullRequestsByRepo.set(nameWithOwner, count + 1);

      return count === 0; // we only want unique repos
    })
    .map((pr) => ({
      ...pr.repository,
      pullRequestsMerged:
        pullRequestsByRepo.get(pr.repository.nameWithOwner) || 0,
    }))
    .sort((a, b) => b.pullRequestsMerged - a.pullRequestsMerged)
    .filter(
      (repo) =>
        !IGNORED_REPOS_SUBSTRINGS.some((ignoredSubstring) =>
          repo.nameWithOwner.includes(ignoredSubstring)
        )
    );

  await writeJson(
    `${__dirname}/out/repositories.json`,
    repositoriesWithMergedPRs
  );
}

await aggregateRepositoriesContributedTo();
