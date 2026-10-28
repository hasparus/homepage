import type { RemarkPlugin } from "@astrojs/markdown-remark";

import type { PostProps } from "../types";

import { postPath } from "./postPath";

export const urlOutsideOfPagesDirPlugin: RemarkPlugin<
  [{ absoluteDirPath: string }]
> = ({ absoluteDirPath }) => {
  return (_tree, file) => {
    const props = (file.data as { astro: PostProps }).astro;

    // We can't assign to `props.url` so we take `frontmatter.path`
    props.frontmatter.path = postPath(absoluteDirPath, file.path);
  };
};
