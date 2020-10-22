import { PluginOptions } from "./gatsby-remark-double-brackets-link";
import { NotesBrainThemeOptions } from "./gatsby-theme-notes-brain/parseOptions";

const makeOptions = ({
  pluginMdxOptions,
}: Pick<
  NotesBrainThemeOptions.ValidInput,
  "pluginMdxOptions"
>): NotesBrainThemeOptions.ValidInput => ({
  contentPath: "notes",
  pluginMdxOptions,
});

export const makeBrainNotesGatsbyPluginConfig = (
  givenOptions: Pick<NotesBrainThemeOptions.ValidInput, "pluginMdxOptions">
) => ({
  resolve: require.resolve("./gatsby-theme-notes-brain"),
  options: makeOptions(givenOptions),
});

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
