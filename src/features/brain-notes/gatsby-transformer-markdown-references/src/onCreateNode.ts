import { CreateNodeArgs, Node } from "gatsby";
import { isObject } from "lodash";

import { getNodeTitle } from "../../../../lib/build-time/getNodeTitle";
import { assert } from "../../../../lib/util";
import { clearInboundReferences, setCachedNode } from "./cache";
import { getReferences } from "./getReferences";
import { MarkdownReferencesPluginOptions, parseOptions } from "./options";

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
  opts?: MarkdownReferencesPluginOptions.Input
) => {
  const options = parseOptions(opts);

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
