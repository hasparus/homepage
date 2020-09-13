import { findTopLevelHeading } from "gatsby-transformer-markdown-references";
import * as path from "path";

import { File, Mdx } from "../../../__generated__/global";

interface Node {
  absolutePath?: File["absolutePath"];
  frontmatter?: Mdx["frontmatter"];
  fileAbsolutePath?: Mdx["fileAbsolutePath"];
}

export function getNodeTitle(node: Node, content: string) {
  if (
    typeof node.frontmatter === "object" &&
    node.frontmatter &&
    node.frontmatter.title
  ) {
    return node.frontmatter.title;
  }
  return (
    findTopLevelHeading(content) ||
    (typeof node.fileAbsolutePath === "string"
      ? path.basename(
          node.fileAbsolutePath,
          path.extname(node.fileAbsolutePath)
        )
      : "") ||
    (typeof node.absolutePath === "string"
      ? path.basename(node.absolutePath, path.extname(node.absolutePath))
      : "")
  );
}
