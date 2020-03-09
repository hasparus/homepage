// @ts-check
/* eslint-disable sonarjs/no-duplicate-string */

import { omit } from "lodash";
import { Theme } from "theme-ui";
// eslint-disable-next-line import/no-extraneous-dependencies

import { randomElement } from "../lib";

export const fontSize = {
  base: "22px",
  small: [0, 1],
  normal: [1, 2],
};

const font = (fonts: string) => {
  if (process.env.NODE_ENV === "development") {
    const xs = fonts.split(",");
    /**
     * I'd like to notice when fonts get broken.
     * Comic Sans MS is a great tool for that.
     */
    return [...xs.slice(0, -1), "Comic Sans MS", xs[xs.length - 1]].join(
      ","
    );
  }
  return fonts;
};

const light = {
  text: "#020202",
  text092: "rgba(2, 2, 2, 0.92)",
  gray: "#2B2C28",
  background: "#fff",
  primary: "#002FF4",
  secondary: "#FED766",
  highlight: "#FEE9AB",
  muted: "#edf1ff",
};

export type ColorMode = typeof light;

const dark: ColorMode = {
  text: "#f0f0f0",
  text092: "rgba(240, 240, 240, 0.92)",
  gray: "#db7",
  background: "#02030f",
  primary: "#80a9ff",
  secondary: "#ffd680",
  highlight: "#ADDB67",
  muted: "#191F26",
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

const initialColorModeName: ColorModes = "light";

// stolen from https://www.getpapercss.com/docs/utilities/borders/
// and divided all numbers by 3
const sketchyBorders = [
  {
    borderBottomLeftRadius: "5px 85px",
    borderBottomRightRadius: "75px 5px",
    borderTopLeftRadius: "85px 5px",
    borderTopRightRadius: "5px 75px",
  },
  {
    borderBottomLeftRadius: "61px 8px",
    borderBottomRightRadius: "6px 68px",
    borderTopLeftRadius: "41px 8px",
    borderTopRightRadius: "3px 68px",
  },
  {
    borderBottomLeftRadius: "75px 5px",
    borderBottomRightRadius: "5px 85px",
    borderTopLeftRadius: "5px 75px",
    borderTopRightRadius: "85px 5px",
  },
  {
    borderBottomLeftRadius: "8px 38px",
    borderBottomRightRadius: "51px 8px",
    borderTopLeftRadius: "5px 75px",
    borderTopRightRadius: "8px 50px",
  },
  {
    borderBottomLeftRadius: "6px 38px",
    borderBottomRightRadius: "5px 35px",
    borderTopLeftRadius: "83px 5px",
    borderTopRightRadius: "8px 26px",
  },
  {
    borderBottomLeftRadius: "5px 75px",
    borderBottomRightRadius: "6px 68px",
    borderTopLeftRadius: "9px 41px",
    borderTopRightRadius: "33px 10px",
  },
];

const code = {
  fontFamily: "monospace",
  fontSize: fontSize.small,
  bg: "muted",
  borderRadius: 1,
  padding: ".1em .15em .05em",
  lineHeight: "monospace",
};

const headingStyles = {
  fontFamily: "heading",
  fontWeight: "heading",
  lineHeight: "1.2",

  color: "text092",

  code: {
    fontSize: "0.85em",
    fontWeight: "bold",
  },

  ".anchor": {
    visibility: "hidden",
  },
  ":focus, :hover": {
    ".anchor": {
      visibility: "visible",
    },
  },
};

const commonButtonStyles = {
  display: "inline",
  padding: 0,
  font: "inherit",
  color: "inherit",
  background: "none",
  cursor: "pointer",
  border: "none",
  borderRadius: 0,
} as const;

const buttonStyles: Theme["buttons"] = {
  clear: commonButtonStyles,
  primary: {
    ...commonButtonStyles,
    outline: "none",
    border: "1px solid transparent",
    "&:focus, &:hover": {
      borderColor: "currentColor",
    },
  },
};

// https://github.com/system-ui/theme-specification
// I want to make sure my team is correct (assignable to Theme) but narrow
// the type to the actual value
const makeTheme = <T extends Theme>(t: T): T => {
  return t;
};

export const theme = makeTheme({
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    monospace: font(
      "'Fira Code', 'Hack', 'Hasklig', 'Dank Mono', 'Inconsolata', 'Menlo', 'Consolas', monospace"
    ),
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
      '"Droid Sans", "Helvetica Neue", sans-serif',
    heading:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", ' +
      '"Droid Sans", "Helvetica Neue", sans-serif',
  },
  fontSizes: [
    "0.727rem",
    "0.8rem",
    "1rem",
    "1.25rem",
    "1.563rem",
    "1.953rem",
    "2.441rem",
    "3.052rem",
    "3.815rem",
    "4.768rem",
  ],
  fontWeights: {
    body: 400,
    heading: 800,
    bold: 600,
  },
  lineHeights: {
    body: 1.65,
    heading: 1.25,
    monospace: 1.5,
  },
  initialColorModeName,
  useCustomProperties: true,
  // useColorSchemeMediaQuery: true,
  colors: {
    ...colorModes[initialColorModeName],
    modes: omit(colorModes, initialColorModeName),
  },
  useBodyStyles: true,
  styles: {
    root: {
      // <- used for <body>
      fontSize: fontSize.normal,
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      "*": {
        boxSizing: "border-box",
      },
      ".anchor": {
        p: ["2px", "4px"],
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: ["-16px", "-28px"],
        svg: {
          width: ["12px", "20px"],
          height: ["12px", "20px"],
        },
      },
    },
    h1: {
      ...headingStyles,
      fontSize: 6,
      textAlign: ["center", "left", "left"],
      py: [5, 0, 0],
      margin: "0.5em 0",
      wordBreak: "break-word",
      lineHeight: 1.1,
    },
    h2: {
      ...headingStyles,
      color: "text",
      fontSize: 5,
      margin: "0.5em 0",
      wordBreak: "break-word",
    },
    h3: {
      ...headingStyles,
      color: "gray",
      fontSize: 4,
      wordBreak: "break-word",
    },
    h4: {
      ...headingStyles,
      color: "gray",
      fontSize: 3,
      margin: "0.5em 0",
    },
    h5: {
      ...headingStyles,
      color: "text",
      fontSize: 2,
      margin: "0.5em 0",
    },
    h6: {
      ...headingStyles,
      color: "text",
      fontFamily: "text",
      fontSize: 1,
      margin: "0.5em 0",
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      width: "63ch",
      maxWidth: "100%",
      code,
      sup: {
        fontSize: 0,
      },
    },
    a: {
      overflowWrap: "break-word",
      color: "primary",
      textDecoration: "none",
      ":focus, :hover": {
        textDecoration: "underline",
      },
    },
    code,
    pre: () => ({
      fontFamily: "monospace",
      fontSize: 0,
      lineHeight: "monospace",
      overflowX: "auto",
      padding: "1em",
      code: {
        fontSize: 0,
        color: "inherit !important",
        bg: "inherit !important",
        padding: "0 !important",
      },
      mx: "-1em",
      ...randomElement(sketchyBorders),
    }),
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
    },
    th: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    td: {
      textAlign: "left",
      borderBottomStyle: "solid",
    },
    img: {
      maxWidth: "100%",
    },
    ul: {
      pl: [3, 4],
      ml: [1, 0],
      ul: {
        pl: [3, 3],
        ml: [0, 0],
      },
      code,
    },
    li: {
      width: "63ch",
      maxWidth: "100%",
    },
    blockquote: {
      margin: 0,
      padding: "0 1em",
      borderLeft: ".25em solid",
      borderColor: "highlight",
      "*": {
        color: "mutedText",
        fontSize: fontSize.small,
      },
    },
    hr: {
      border: "none",
      borderBottom: "1px dashed",
      opacity: 0.4,
    },
  },
  buttons: buttonStyles,
});

// eslint-disable-next-line import/no-default-export
export default theme;

export type ExactTheme = typeof theme;
