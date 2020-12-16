import * as path from "path";

import { Node, ParentSpanPluginArgs } from "gatsby";
import slash from "slash";

import packageJson from "../../../package.json";
import { buildTime } from "../../lib/build-time/gatsby-node-utils";
import { NOTES_DEFAULT_HISTORY_TYPE } from "../brain-notes";

import { getGitLogJsonForFile } from "./getGitLogJsonForFile";

const REPO_URL = packageJson.repository.url;

interface CreateMdxNodeArgs extends ParentSpanPluginArgs {
  node: buildTime.Mdx;
}

interface BlogpostHistoryNodeFieldArgs {
  route: string;
  rootDir: string;
}

export function createBlogpostHistoryNodeField(
  { node, actions: { createNodeField } }: CreateMdxNodeArgs,
  { route, rootDir }: BlogpostHistoryNodeFieldArgs
) {
  let blogpostHistoryType = node.frontmatter?.history;

  if (node.fields?.route.startsWith("/notes")) {
    blogpostHistoryType = NOTES_DEFAULT_HISTORY_TYPE as any;
  }

  if (blogpostHistoryType) {
    const dirname = slash(rootDir);

    const filePath = node.frontmatter!.historySource
      ? slash(path.join(dirname, node.frontmatter!.historySource))
      : node.fileAbsolutePath;

    getGitLogJsonForFile(filePath, [
      "abbreviatedCommit",
      "authorDate",
      "subject",
      "body",
    ])
      .then((entries) => {
        const url = slash(
          path.join(
            `${REPO_URL}/commits/master`,
            filePath.replace(dirname, "")
          )
        );

        switch (blogpostHistoryType) {
          case "Verbose":
            createNodeField({
              node: (node as unknown) as Node,
              name: "history",
              value: { entries, url },
            });
            break;
          case "DatesOnly":
            createNodeField({
              node: (node as unknown) as Node,
              name: "history",
              value: {
                entries: entries.map((entry) => ({
                  authorDate: entry.authorDate,
                })),
                url,
              },
            });
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.error("Failed to build blogpost history for", route, err);
      });
  }
}
