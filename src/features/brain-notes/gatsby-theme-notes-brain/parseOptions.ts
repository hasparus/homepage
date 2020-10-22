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
    plugins?: PluginOptions["plugins"];
    /**
     * needed for createResolvers, because we transform our mdx and we need
     * these plugins for that
     */
    pluginMdxOptions?: {
      remarkPlugins: (string | object)[];
      gatsbyRemarkPlugins: (string | object)[];
    };
  }

  export interface ValidInput
    extends WithRequired<
      PossibleInput,
      "contentPath" | "pluginMdxOptions"
    > {}
}

function assertIsValid(
  opts: NotesBrainThemeOptions.PossibleInput | undefined
): asserts opts is NotesBrainThemeOptions.ValidInput {
  assert(opts, `[brain-notes] themeOptions are not \`${opts}\``);

  const { contentPath, pluginMdxOptions } = opts;

  assert(contentPath, "[brain-notes] contentPath is missing");
  assert(pluginMdxOptions, "[brain-notes] pluginMdxOptions is missing");
}

export const parseOptions = (
  themeOptions: NotesBrainThemeOptions.PossibleInput | undefined
) => {
  assertIsValid(themeOptions);

  const {
    basePath = "/",
    contentPath,
    pluginMdxOptions,
    extensions = [".md", ".mdx"],
    mediaTypes = ["text/markdown", "text/mdx"],
  } = themeOptions;

  return {
    basePath,
    contentPath,
    pluginMdxOptions,
    extensions,
    mediaTypes,
  };
};

export namespace NotesBrainThemeOptions {
  export interface Parsed extends ReturnType<typeof parseOptions> {}
}
