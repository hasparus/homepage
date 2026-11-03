import type { RehypePlugin } from "@astrojs/markdown-remark";
import type { RootContent } from "hast";
import type { MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";

export const FLEX_CONTAINER_CLASS = "zaduma-aside";

export type AsidesPluginOptions = {};

/**
 * Wraps `aside` elements with previous sibling in a flex container.
 *
 * Read posts/features/asides.mdx for more information.
 */
export const asidesPlugin: RehypePlugin<[AsidesPluginOptions]> = (_options) => {
  return (root) => {
    let children = [...root.children];

    const childrenToRemove = new Set<RootContent>();

    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (!node) continue;
      if (node.type === "mdxJsxFlowElement" && node.name === "aside") {
        let lastAsideIndex = 0;
        for (let j = i - 1; j >= lastAsideIndex; j--) {
          const prev = children[j];
          if (!prev) continue;
          if (prev.type === "element" || prev.type === "mdxJsxFlowElement") {
            childrenToRemove.add(node);
            lastAsideIndex = i;

            children[j] = {
              type: "mdxJsxFlowElement",
              name: "div",
              position: prev.position,
              data: prev.data,
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "className",
                  value: FLEX_CONTAINER_CLASS,
                },
              ],
              children: [
                {
                  type: "mdxJsxFlowElement",
                  name: "div",
                  attributes:
                    prev.type === "element"
                      ? []
                      : [
                          {
                            type: "mdxJsxAttribute",
                            name: "className",
                            value: "jsx",
                          },
                        ],
                  children: [prev],
                },
                node,
              ],
            } satisfies MdxJsxFlowElementHast;

            break;
          }
        }
      }
    }

    children = children.filter((node) => !childrenToRemove.has(node));

    return { ...root, children };
  };
};
