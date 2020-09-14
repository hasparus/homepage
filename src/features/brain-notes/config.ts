import { PluginOptions } from "./gatsby-remark-double-brackets-link";
import { NotesBrainThemeOptions } from "./gatsby-theme-notes-brain/parseOptions";

const options: NotesBrainThemeOptions.ValidInput = {
  contentPath: "notes",
  noteTemplatePath: require.resolve("../../layouts/NoteLayout.tsx"),
};

export const brainNotesGatsbyPluginConfig = {
  resolve: require.resolve("./gatsby-theme-notes-brain"),
  options,
};

const doubleBracketsLinkOptions: PluginOptions = {
  stripBrackets: true,
  titleToURL: {
    prefix: "notes",
  },
};

export const brainNotesGatsbyRemarkPluginConfig = {
  resolve: require.resolve("./gatsby-remark-double-brackets-link.ts"),
  options: doubleBracketsLinkOptions,
};
