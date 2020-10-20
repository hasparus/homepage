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
  text: "hsl(165, 20%, 12%)",
  text092: "hsla(165, 20%, 12%, 0.92)",
  background: "#fdf8e4",
  primary: "#ca3030",
  secondary: "#02734A",
  highlight: "#5da88c",
  muted: "#ebe0d2",
  gray: "#474341",
};

export const colorModes = { light, dark, soft };

export type ColorModes = keyof typeof colorModes;
