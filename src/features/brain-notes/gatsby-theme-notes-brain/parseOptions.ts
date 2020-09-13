import { PluginOptions } from "gatsby";

import { assert } from "../../../lib/util";

export const parseOptions = (themeOptions: PluginOptions | undefined) => {
  assert(themeOptions)
  
  const { 
    basePath = '/',
    contentPath,
    rootNote,
    extensions = ['.md' || '.mdx'],
    mediaTypes = ["text/markdown","text/x-markdown"],
    noteTemplatePath
  } = themeOptions as Record<string, any>;

  return {
    basePath,
    contentPath,
    rootNote,
    extensions,
    mediaTypes,
    noteTemplatePath,
  }
}

export type NotesBrainThemeOptions = ReturnType<typeof parseOptions>; 
