import { omit } from "lodash";
import { ColorMode, Theme, ThemeStyles } from "theme-ui";

// https://github.com/system-ui/theme-specification
// I want to make sure my theme is correct (assignable to Theme) but narrow
// the type to the actual value
export const makeTheme = <T extends Theme>(t: T): T => t;
export const makeStyles = <T extends ThemeStyles>(s: T): T => s;

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
