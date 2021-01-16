import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Themed as th } from "theme-ui";

import type { LastContributionsQuery } from "../../../graphql-types";

const separator = (index: number, items: unknown[]) => {
  switch (index) {
    case items.length - 1:
      return "";
    case items.length - 2:
      return " and ";
    default:
      return ", ";
  }
};

export function LastContributions() {
  const { allGhContributions } = useStaticQuery<
    LastContributionsQuery
  >(graphql`
    query LastContributions {
      allGhContributions {
        nodes {
          mergedRepositories(first: 6) {
            nameWithOwner
          }
        }
      }
    }
  `);

  return allGhContributions.nodes[0]!.mergedRepositories.map(
    ({ nameWithOwner }, i, repos) => {
      const name = nameWithOwner.split("/")[1];

      return (
        <>
          <th.a
            href={`https://github.com/${nameWithOwner}`}
            target="_blank"
            rel="noopener"
          >
            {name}
          </th.a>
          {separator(i, repos)}
        </>
      );
    }
  );
}
