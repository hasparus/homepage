import { omit } from "lodash";
import { ColorMode, Theme, ThemeStyles } from "theme-ui";

export { makeTheme, makeStyles } from "@theme-ui/css/utils";

type ColorModesDict = Record<string, ColorMode>;
type ColorModesScaleForDict<
  D extends ColorModesDict,
  K extends keyof D
> = D[K] & { modes: Pick<D, Exclude<keyof D, K>> };

export const makeColors = <
  TModesDict extends ColorModesDict,
  TInitial extends keyof TModesDict
>(
  colorModes: TModesDict,
  initialColorModeName: TInitial,
  { printColorModeName }: { printColorModeName: keyof TModesDict }
): {
  initialColorModeName: TInitial;
  printColorModeName: keyof TModesDict;
  colors: ColorModesScaleForDict<TModesDict, TInitial>;
} => ({
  initialColorModeName,
  printColorModeName,
  colors: {
    ...colorModes[initialColorModeName],
    modes: omit(colorModes, initialColorModeName),
  },
});
