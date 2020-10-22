import {
  cleanupMarkdown,
  findInMarkdown,
} from "../../../../lib/build-time/markdown-utils";

export type References = { blocks: string[]; pages: string[] };

export function rxWikiLink(): RegExp {
  const pattern = "\\[\\[([^\\]]+)\\]\\]"; // [[wiki-link-regex]]
  return new RegExp(pattern, "ig");
}

export function rxBlockLink(): RegExp {
  const pattern = "\\(\\(([^\\]]+)\\)\\)"; // ((block-link-regex))
  return new RegExp(pattern, "ig");
}

const cleanTitle = (s: string) => s.replace(/\s+/g, " ");

export const getReferences = (s: string) => {
  const md = cleanupMarkdown(s);

  const references: References = {
    blocks: findInMarkdown(md, rxBlockLink()).map(cleanTitle),
    pages: findInMarkdown(md, rxWikiLink()).map(cleanTitle),
  };

  return references;
};
