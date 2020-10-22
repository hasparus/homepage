import { PluginOptions } from "gatsby";

import { assert } from "../../../lib/util";
import type { MarkdownReferencesPluginOptions } from "../gatsby-transformer-markdown-references/src/options";

type WithRequired<T extends object, TRequired extends keyof T> = Required<
  Pick<T, TRequired>
> &
  Pick<T, Exclude<keyof T, TRequired>>;

export namespace NotesBrainThemeOptions {
  export interface PossibleInput {
    basePath?: string;
    contentPath?: string;
    extensions?: string | string[];
    mediaTypes?: string | string[];
    plugins?: PluginOptions["plugins"];
    markdownReferences?: MarkdownReferencesPluginOptions.Input;
  }

  export interface ValidInput
    extends WithRequired<
      PossibleInput,
      "contentPath" | "markdownReferences"
    > {}
}

function assertIsValid(
  opts: NotesBrainThemeOptions.PossibleInput | undefined
): asserts opts is NotesBrainThemeOptions.ValidInput {
  assert(opts, `[brain-notes] themeOptions are not \`${opts}\``);

  const { contentPath } = opts;

  assert(contentPath, "[brain-notes] contentPath is missing");
}

export const parseOptions = (
  themeOptions: NotesBrainThemeOptions.PossibleInput | undefined
) => {
  assertIsValid(themeOptions);

  const {
    basePath = "/",
    contentPath,
    extensions = [".md", ".mdx"],
    mediaTypes = ["text/markdown", "text/mdx"],
    markdownReferences = {},
  } = themeOptions;

  return {
    basePath,
    contentPath,
    extensions,
    mediaTypes,
    markdownReferences,
  };
};

export namespace NotesBrainThemeOptions {
  export interface Parsed extends ReturnType<typeof parseOptions> {}
}
