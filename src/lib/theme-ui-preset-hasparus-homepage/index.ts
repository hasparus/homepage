import { buttons } from "./buttons";
import { colorModes } from "./colorModes";
import { styles } from "./styles";
import { makeColors, makeTheme } from "./theme-ui-utils";
import { typography } from "./typography";

export type { ColorMode, ColorModes } from "./colorModes";

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

export const preset = makeTheme({
  space,
  sizes: space,

  ...typography,
  ...makeColors(colorModes, "soft", { printColorModeName: "light" }),

  useColorSchemeMediaQuery: true,
  useCustomProperties: true,
  useBodyStyles: true,

  styles,
  buttons,
});

export { makeTheme };
