import { CreateNodeArgs, Node } from "gatsby";
import { isObject } from "lodash";

import { findTopLevelHeading } from "../../../../lib/build-time/markdown-utils";
import { getNodeTitle } from "../../../../lib/build-time/getNodeTitle";

import { getReferences } from "./getReferences";
import { PluginOptions, resolveOptions } from "./options";
import { clearInboundReferences, setCachedNode } from "./cache";
import { assert } from "../../../../lib/util";

type AliasesFrontmatter = { aliases: string[] };
const isAliasesFrontmatter = (x: unknown): x is AliasesFrontmatter =>
  isObject(x) && "aliases" in x && Array.isArray(x);

function getAliases(node: Node) {
  if (isAliasesFrontmatter(node.frontmatter)) {
    return node.frontmatter.aliases as string[];
  }
  return [];
}

function assertIsMdxNode(
  node: object
): asserts node is {
  fileAbsolutePath: string;
  frontmatter: { title?: string };
} {
  assert(
    typeof (node as Record<string, unknown>).fileAbsolutePath ===
      "string" &&
      typeof (node as Record<string, unknown>).frontmatter === "object",
    "node should have fileAbsolutePath and frontmatter"
  );
}

export const onCreateNode = async (
  { cache, node, loadNodeContent }: CreateNodeArgs,
  _options?: PluginOptions
) => {
  const options = resolveOptions(_options);

  // if we shouldn't process this node, then return
  if (!options.types.includes(node.internal.type)) {
    return;
  }

  const content = await loadNodeContent(node);

  const outboundReferences = getReferences(content);

  if (content.includes("Overengineering a personal")) {
    debugger;
  }

  assertIsMdxNode(node);

  const title = getNodeTitle(node, content);
  const aliases = getAliases(node);

  await clearInboundReferences(cache);
  await setCachedNode(cache, node.id, {
    node,
    outboundReferences,
    title,
    aliases,
  });
};
