import { GatsbyNode } from "gatsby";
import { urlResolve } from "gatsby-core-utils";
import * as path from "path";

import { buildTime } from "../../../lib/build-time/gatsby-node-utils";
import { getNodeTitle } from "../../../lib/build-time/getNodeTitle";
import { parseOptions } from "./parseOptions";
import { shouldHandleFile } from "./shouldHandleFile";

function isFile(node: buildTime.Node): node is buildTime.File {
  return node.internal.type === "File";
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async (
  { node, actions, getNode, loadNodeContent },
  options
) => {
  const { createNodeField } = actions;
  const opts = parseOptions(options);

  if (isFile(node) && shouldHandleFile(node, opts)) {
    const mdx = getNode(node.children[0]!);

    const content = await loadNodeContent(node);

    createNodeField({
      node: mdx,
      name: "title",
      value: getNodeTitle(node, content),
    });
  }
};
