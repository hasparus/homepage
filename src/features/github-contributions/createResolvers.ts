import { CreateResolversArgs } from "gatsby";

import { NODE_TYPE } from "./common";
import type { Contributions } from "./sourceNodes";

export const createResolvers = (args: CreateResolversArgs) => {
  args.createResolvers({
    [NODE_TYPE]: {
      mergedRepositories: {
        args: { first: "Int!", sortByStars: "Boolean" },
        type: "[GHRepository!]!",
        resolve(
          source: Contributions,
          args: { first: number; sortByStars?: boolean }
        ) {
          const repos = source.repositoriesWithMergedPRs.slice(
            0,
            args.first
          );

          if (args.sortByStars) {
            repos.sort((a, b) => b.stargazerCount - a.stargazerCount);
          }

          return repos;
        },
      },
    },
  });
};
