import { omit } from "lodash";
import { ColorMode, ThemeStyles } from "theme-ui";

export { makeTheme } from "@theme-ui/css";

// Use this when using styles.
export const makeStyles = (s: ThemeStyles) =>
  s as Record<
    string,
    Record<string, number | false | string | undefined | null> | undefined
  >;
// Uncomment this when writing styles:
// export const makeStyles = <T extends ThemeStyles>(s: T): {} => s;

type ColorModesDict = Record<string, ColorMode>;
type ColorModesScaleForDict<D extends object, K extends keyof D> = D[K] & {
  modes: Pick<D, Exclude<keyof D, K>>;
};

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
