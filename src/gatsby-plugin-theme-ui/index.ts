// @ts-check
/* eslint-disable sonarjs/no-duplicate-string */

import { omit } from "lodash";

import { randomElement } from "../utils";

export const fontSize = {
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
    return [...xs.slice(0, -1), "Comic Sans MS", xs[xs.length - 1]].join(",");
  }
  return fonts;
};

export const colorModes = {
  light: {
    text: "#020202",
    gray: "#2B2C28",
    background: "#fff",
    primary: "#002FF4",
    secondary: "#FED766",
    highlight: "#FEE9AB",
    muted: "#edf1ff",
  },
  dark: {
    text: "#f0f0f0",
    gray: "#db7",
    background: "#02030f",
    primary: "#80a9ff",
    secondary: "#ffd680",
    highlight: "#ADDB67",
    muted: "#191F26",
  },
};

// stolen from https://www.getpapercss.com/docs/utilities/borders/
const sketchyBorders = [
  {
    borderBottomLeftRadius: "15px 255px",
    borderBottomRightRadius: "225px 15px",
    borderTopLeftRadius: "255px 15px",
    borderTopRightRadius: "15px 225px",
  },
  {
    borderBottomLeftRadius: "185px 25px",
    borderBottomRightRadius: "20px 205px",
    borderTopLeftRadius: "125px 25px",
    borderTopRightRadius: "10px 205px",
  },
  {
    borderBottomLeftRadius: "225px 15px",
    borderBottomRightRadius: "15px 255px",
    borderTopLeftRadius: "15px 225px",
    borderTopRightRadius: "255px 15px",
  },
  {
    borderBottomLeftRadius: "25px 115px",
    borderBottomRightRadius: "155px 25px",
    borderTopLeftRadius: "15px 225px",
    borderTopRightRadius: "25px 150px",
  },
  {
    borderBottomLeftRadius: "20px 115px",
    borderBottomRightRadius: "15px 105px",
    borderTopLeftRadius: "250px 15px",
    borderTopRightRadius: "25px 80px",
  },
  {
    borderBottomLeftRadius: "15px 225px",
    borderBottomRightRadius: "20px 205px",
    borderTopLeftRadius: "28px 125px",
    borderTopRightRadius: "100px 30px",
  },
];

const code = {
  fontFamily: "monospace",
  fontSize: fontSize.small,
  bg: "muted",
  borderRadius: 1,
  padding: ".1em .15em .05em",
};

const headingStyles = {
  fontFamily: "heading",
  fontWeight: "heading",
  lineHeight: "1.2",

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

// https://github.com/system-ui/theme-specification
// /**
//  * @type {import("theme-ui").Theme}
//  */
export const theme = {
  fonts: {
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    monospace: font(
      "'Fira Code', 'Hack', 'Hasklig', 'Dank Mono', 'Inconsolata', 'Menlo', 'Consolas', monospace"
    ),
    body: font("'Open Sans', sans-serif"),
    heading: font("'Passion One', sans-serif"),
    system:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans, ' +
      'Droid Sans", "Helvetica Neue", sans-serif',
  },
  fontSizes: [14, 16, 18, 23, 27, 36, 54, 72, 81, 108],
  fontWeights: {
    body: 400,
    heading: 400,
    bold: 600,
  },
  lineHeights: {
    body: 1.75,
    heading: 1.25,
  },
  initialColorMode: "light",
  useCustomProperties: true,
  useColorSchemeMediaQuery: true,
  colors: {
    ...colorModes.light,
    modes: omit(colorModes, "light"),
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      fontSize: fontSize.normal,
      ".anchor": {
        p: ["2px", "4px"],
        verticalAlign: "text-top",
        height: "1em",
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
      fontSize: [6, 7, 8],
      textAlign: ["center", "left", "left"],
      py: [5, 0, 0],
      margin: "0.5em 0",
      wordBreak: "break-word",
      lineHeight: 1.1,
    },
    h2: {
      ...headingStyles,
      color: "text",
      fontSize: [5, 6],
      margin: "0.5em 0",
      wordBreak: "break-word",
    },
    h3: {
      ...headingStyles,
      color: "gray",
      fontSize: [4, 5],
      wordBreak: "break-word",
    },
    h4: {
      ...headingStyles,
      color: "gray",
      fontSize: [3, 4],
      margin: "0.5em 0",
    },
    h5: {
      ...headingStyles,
      color: "text",
      fontSize: [2, 3],
      margin: "0.5em 0",
    },
    h6: {
      ...headingStyles,
      color: "text",
      fontFamily: "text",
      fontSize: [1, 2],
      margin: "0.5em 0",
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      width: "80ch",
      maxWidth: "100%",
      code,
    },
    a: {
      color: "primary",
      textDecoration: "none",
      ":focus, :hover": {
        textDecoration: "underline",
      },
    },
    code,
    pre: () => ({
      fontFamily: "monospace",
      overflowX: "auto",
      padding: "1em",
      code: {
        color: "inherit !important", // 😭
        bg: "inherit !important",
      },
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
      code,
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
  },
};

// eslint-disable-next-line import/no-default-export
export default theme;
