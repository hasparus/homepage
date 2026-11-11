import { execFileSync } from "node:child_process";
import { basename } from "node:path";
import type { RemarkPlugin } from "@astrojs/markdown-remark";

import type { PostFrontmatter, PostProps } from "../types";

export const derivedTitleAndDatePlugin: RemarkPlugin<
  [{ title: (fileStem: string) => string }]
> = ({ title }) => {
  return (_tree, file) => {
    const data = file.data as { astro: PostProps };
    const frontmatter = data.astro.frontmatter as Partial<PostFrontmatter>;

    // `posts/my-post/index.mdx` is titled after its folder.
    const stem =
      file.stem === "index" ? basename(file.dirname || "") : file.stem;
    frontmatter.title ||= title(stem || "");

    if (!frontmatter.date) {
      let createdAt: string;
      try {
        createdAt =
          execFileSync(
            "git",
            [
              "log",
              "--follow",
              "--diff-filter=A",
              "--find-renames=40%",
              "--format=%ai",
              file.path,
            ],
            { encoding: "utf8" },
          )
            .trim()
            .split("\n")[0] || new Date().toISOString();
      } catch {
        createdAt = new Date().toISOString();
      }

      frontmatter.date = createdAt;
    }
  };
};
