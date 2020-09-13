import { buttons } from './buttons';
import { colorModes } from "./colorModes";
import { styles } from "./styles";
import { makeColors, makeTheme } from "./theme-ui-utils";
import { typography } from "./typography";

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

export const preset = makeTheme({
  space,
  sizes: space,

  ...typography,
  ...makeColors(colorModes, "light"),

  useCustomProperties: true,
  useBodyStyles: true,

  styles,
  buttons,
});

export { makeTheme };
