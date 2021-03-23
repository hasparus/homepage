import { last } from "lodash";
import type * as unist from "unist";
// eslint-disable-next-line import/no-extraneous-dependencies
import visit from "unist-util-visit";

import { slugifyTitle } from "../../../../lib/build-time/slugifyTitle";

const isParent = (node: unist.Node): node is unist.Parent => {
  return "children" in node && Array.isArray(node.children);
};

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
): Promise<string> {
  if (mdxNode.paragraphWithWikiLink) {
    // TODO: Is this still needed?
    return Promise.resolve(mdxNode.paragraphWithWikiLink) as Promise<
      string
    >;
  }

  const { mdast } = await processMDX(mdxNode);

  const children: unist.Parent[] = mdast.children;

  // find a paragraph containing our link

  let linkReference: unist.Node | undefined;
  // file name should be unique, directories serve only for editor convenience
  const expectedLabelSlug = last(linkedRoute.split("/"));

  // just for debugging
  let linkReferences: unist.Node[] = [];

  const lookForLinkReference = (
    node: unist.Parent
  ): unist.Node | undefined => {
    if (node.type === "paragraph") {
      return node.children.find((paragraphChild) => {
        if (paragraphChild.type === "linkReference") {
          linkReferences.push(paragraphChild);

          const slug = slugifyTitle(paragraphChild.label as string);
          const res = slug === expectedLabelSlug;

          if (res) {
            linkReference = paragraphChild;
            return true;
          }

          return false;
        }

        return false;
      });
    }
    if (isParent(node)) {
      return node.children.find(
        (child) => isParent(child) && lookForLinkReference(child)
      );
    }
  };

  const paragraph = children.find(lookForLinkReference);

  if (!paragraph) {
    // eslint-disable-next-line no-console
    console.dir(
      {
        linkedRoute,
        expectedLabelSlug,
        paragraph,
        linkReferences,
        children,
      },
      { depth: 20 }
    );
    throw new Error("[brain-notes] createResolvers paragraph not found");
  } else {
    linkReferences = [];
  }

  // turn the paragraph into a string

  const nodes: string[] = [];
  visit(paragraph, ["text", "inlineCode"], (node, _, parent) => {
    assertTextNodeHasValue(node);

    if (parent === linkReference) {
      return nodes.push(`<strong>${node.value}</strong>`);
    }

    return nodes.push(node.value);
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
