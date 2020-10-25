import { alpha, mix } from "@theme-ui/color";
import { map } from "fp-ts/lib/Record";

const light = {
  text: "#020202",
  gray: "#2B2C28",
  background: "#fff",
  primary: "#0633f0",
  secondary: "#FED766",
  highlight: "#FEE9AB",
  muted: "#edf1ff",
};

type BaseColorMode = typeof light;

const dark: BaseColorMode = {
  text: "#f0f0f0",
  gray: "#db7",
  background: "#031420",
  primary: "#80a9ff",
  secondary: "#ffd680",
  highlight: "#ADDB67",
  muted: "#1f262e",
};

const soft: BaseColorMode = {
  text: "#182522",
  background: "#f9f3ea",
  primary: "#ca3030",
  secondary: "#02734A",
  highlight: "#5da88c",
  muted: "#ebe0d2",
  gray: "#474341",
};

// TODO: Interesting idea: Could I compute this at buildtime?
//   Ideas:
//     - custom babel macro or TS transformer — i don't want to lose types with template literal
//     - Closure Compiler?
//     - prepack.io?
// TODO:
//   it seems that `getColor` from @theme-ui/color doesn't work with `hsl(165, 20%, 12%)`
//   it strips trailing parenthesis
const deriveAdditionalColors = (colors: BaseColorMode) => {
  return {
    ...colors,
    text092: alpha("text", 0.92)({ colors }),
    mutedPrimary09: mix("muted", "primary", 0.9)({ colors }),
  };
};

export type ColorMode = ReturnType<typeof deriveAdditionalColors>;

export const colorModes = map(deriveAdditionalColors)({
  light,
  dark,
  soft,
});

export type ColorModes = keyof typeof colorModes;
