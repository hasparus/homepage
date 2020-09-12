/* eslint-disable no-param-reassign */

/**
 * based on https://github.com/mathieudutour/gatsby-digital-garden/blob/master/packages/gatsby-remark-double-brackets-link/src/index.ts
 *
 * remember to clean .cache (`gatsby clean`) after changing this file
 */

import visit from "unist-util-visit";
import { Node } from "unist";
import slugify from "slugify";

import { assert } from "../src/lib";

const slugifyTitle = (title: string) =>
  `/${slugify(title, { lower: true })}`;

type TitleToURLOptions =
  | ((title: string) => string)
  | { prefix: string }
  | undefined;
function makeTitleToURL(options: TitleToURLOptions) {
  if (options === undefined) {
    return slugifyTitle;
  }
  if (typeof options === "function") {
    return options;
  }
  return (title: string) => {
    return `${options.prefix}${slugifyTitle(title)}`;
  };
}

const addDoubleBracketsLinks = (
  { markdownAST }: { markdownAST: Node },
  options?: {
    titleToURL?: (title: string) => string;
    stripBrackets?: boolean;
  }
) => {
  const titleToURL = makeTitleToURL(options?.titleToURL);

  const definitions: { [identifier: string]: boolean } = {};

  visit(markdownAST, `definition`, node => {
    if (!node.identifier || typeof node.identifier !== "string") {
      return;
    }
    definitions[node.identifier] = true;
  });

  visit(markdownAST, `linkReference`, (node, index, parent) => {
    if (
      node.referenceType !== "shortcut" ||
      (typeof node.identifier === "string" && definitions[node.identifier])
    ) {
      return;
    }
    const siblings = parent?.children;
    if (!siblings || !Array.isArray(siblings)) {
      return;
    }
    const previous = siblings[index - 1];
    const next = siblings[index + 1];

    if (!previous || !next) {
      return;
    }

    if (
      previous.type !== "text" ||
      (Array.isArray(previous.value) &&
        previous.value[previous.value.length - 1] !== "[") ||
      next.type !== "text" ||
      (Array.isArray(next.value) && next.value[0] !== "]")
    ) {
      return;
    }

    assert(typeof previous.value === "string");
    assert(typeof next.value === "string");

    previous.value = previous.value.replace(/\[$/, "");
    next.value = next.value.replace(/^\]/, "");

    node.type = "link";
    node.url = titleToURL(node.label as string);
    node.title = node.label;
    if (!options?.stripBrackets && Array.isArray(node.children)) {
      node.children[0].value = `[[${node.children[0].value}]]`;
    }
    delete node.label;
    delete node.referenceType;
    delete node.identifier;
  });
};

module.exports = addDoubleBracketsLinks;
