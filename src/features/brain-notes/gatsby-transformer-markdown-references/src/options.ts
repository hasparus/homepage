import { assert } from "../../../../lib/util";

export namespace MarkdownReferencesPluginOptions {
  export interface Input {
    types?: string[];
    /**
     * needed for createResolvers, because we transform our mdx and we need
     * these plugins for that
     */
    contentPath?: string;
    pluginMdxOptions?: {
      remarkPlugins: (string | object)[];
      gatsbyRemarkPlugins: (string | object)[];
    };
  }
}

export const parseOptions = ({
  pluginMdxOptions,
  contentPath,
  types,
}: MarkdownReferencesPluginOptions.Input = {}) => {
  assert(
    pluginMdxOptions,
    "[markdown-references] pluginMdxOptions is missing"
  );
  assert(contentPath, "[markdown-references] contentPath is missing");

  return {
    types: types || ["Mdx"],
    contentPath,
    pluginMdxOptions,
  };
};

export namespace MarkdownReferencesPluginOptions {
  export interface Parsed extends ReturnType<typeof parseOptions> {}
}
