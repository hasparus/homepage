const light = {
  text: "#020202",
  text092: "rgba(2, 2, 2, 0.92)",
  gray: "#2B2C28",
  background: "#fff",
  primary: "#0633f0",
  secondary: "#FED766",
  highlight: "#FEE9AB",
  muted: "#edf1ff",
};

export type ColorMode = typeof light;

const dark: ColorMode = {
  text: "#f0f0f0",
  text092: "rgba(240, 240, 240, 0.92)",
  gray: "#db7",
  background: "#031420",
  primary: "#80a9ff",
  secondary: "#ffd680",
  highlight: "#ADDB67",
  muted: "#1a2027",
};

const soft: ColorMode = {
  text: "hsl(210, 12%, 7%)",
  text092: "hsla(210, 12%, 7%, 92%)",
  background: "#FFEFD5", // papayawhip -- hsl(37, 100%, 92%)
  primary: "#005EB7",
  secondary: "#FFA81C",
  highlight: "#E6C083",
  muted: "#EBDBC0",
  gray: "#3B3121",
};

export const colorModes = { light, dark, soft };

export type ColorModes = keyof typeof colorModes;
