import { PluginOptions } from "./gatsby-remark-double-brackets-link";
import { NotesBrainThemeOptions } from "./gatsby-theme-notes-brain/parseOptions";

const PREFIX_PATH = "notes";

const makeOptions = (
  markdownReferencesOptions: NotesBrainThemeOptions.ValidInput["markdownReferences"]
): NotesBrainThemeOptions.ValidInput => ({
  contentPath: PREFIX_PATH,
  markdownReferences: {
    contentPath: PREFIX_PATH,
    ...markdownReferencesOptions,
  },
});

export const makeBrainNotesGatsbyPluginConfig = (
  ...args: Parameters<typeof makeOptions>
) => ({
  resolve: require.resolve("./gatsby-theme-notes-brain"),
  options: makeOptions(...args),
});

const doubleBracketsLinkOptions: PluginOptions = {
  stripBrackets: true,
  titleToURL: {
    prefix: PREFIX_PATH,
  },
};

export const brainNotesGatsbyRemarkPluginConfig = {
  resolve: require.resolve("./gatsby-remark-double-brackets-link.ts"),
  options: doubleBracketsLinkOptions,
};
