import visit from "unist-util-visit";
import type * as unist from "unist";
import { slugifyTitle } from "../../../../lib/build-time/slugifyTitle";

export async function findReferenceLinkParagraph(
  mdxNode: any,
  { linkedRoute }: { linkedRoute: string },
  {
    processMDX,
  }: {
    processMDX: (
      node: any
    ) => Promise<{ mdast: { children: unist.Parent[] } }>;
  }
) {
  if (mdxNode.paragraphWithWikiLink) {
    return Promise.resolve(mdxNode.paragraphWithWikiLink);
  }

  const { mdast } = await processMDX(mdxNode);

  const children: unist.Parent[] = mdast.children;

  // find a paragraph containing our link

  let linkReference: unist.Node | undefined;
  const paragraph = children.find(
    (node) =>
      node.type === "paragraph" &&
      node.children.find((paragraphChild) => {
        if (paragraphChild.type === "linkReference") {
          const slug = slugifyTitle(paragraphChild.label as string);

          const res = slug === linkedRoute;

          if (res) {
            linkReference = paragraphChild;
            return true;
          }

          return false;
        }

        return false;
      })
  );

  if (!paragraph) {
    console.dir({ linkedRoute, children }, { depth: 20 });
    throw new Error("[brain-notes] createResolvers paragraph not found");
  }

  // turn the paragraph into a string

  const nodes: string[] = [];
  visit(paragraph, ["text", "inlineCode"], (node, _, parent) => {
    assertTextNodeHasValue(node);

    if (parent === linkReference) {
      return nodes.push(`<strong>${node.value}</strong>`);
    } else {
      nodes.push(node.value);
    }
  });
  return nodes.join("");
}

function assertTextNodeHasValue(
  node: unist.Node
): asserts node is unist.Node & { value: string } {
  if ((node as any).value == null && typeof node.value !== "string") {
    throw new Error(
      "[brain-notes] invalid assumption about unist text node"
    );
  }
}
