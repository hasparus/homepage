/* eslint-disable import/no-default-export */

import { merge } from "lodash";

import { headingLinksBodyStyles } from "../features/autolink-headings/body-styles";
import { preset } from "../lib/theme-ui-preset-hasparus-homepage";

export const theme = {
  ...preset,
  styles: {
    ...preset.styles,
    root: merge(preset.styles.root, headingLinksBodyStyles),
  } as typeof preset.styles,
};

export default theme;

export type ExactTheme = typeof theme;

declare module "theme-ui" {
  export interface UserTheme extends ExactTheme {}
}
