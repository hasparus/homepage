import { PluginOptions } from "gatsby";

import { assert } from "../../../lib/util";

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
    noteTemplatePath?: string;
    plugins?: PluginOptions["plugins"];
  }

  export interface ValidInput
    extends WithRequired<
      PossibleInput,
      "noteTemplatePath" | "contentPath"
    > {}
}

function assertIsValid(
  opts: NotesBrainThemeOptions.PossibleInput | undefined
): asserts opts is NotesBrainThemeOptions.ValidInput {
  assert(opts, `[notes-brain-theme] themeOptions are not \`${opts}\``);

  const { noteTemplatePath, contentPath } = opts;

  assert(
    noteTemplatePath,
    "[notes-brain-theme] noteTemplatePath is missing"
  );
  assert(contentPath, "[notes-brain-theme] contentPath is missing");
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
    noteTemplatePath,
  } = themeOptions;

  return {
    basePath,
    contentPath,
    extensions,
    mediaTypes,
    noteTemplatePath,
  };
};

export namespace NotesBrainThemeOptions {
  export interface Parsed extends ReturnType<typeof parseOptions> {}
}
