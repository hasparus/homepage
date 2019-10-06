// @ts-check

import { lighten, desaturate } from "polished";
import { omit } from "lodash";

/**
 * @param {string} fonts
 */
const font = fonts => {
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
    text: "#000",
    gray: "#2B2C28",
    background: "#fff",
    primary: "#002FF4", // dark blue
    secondary: "#99FFFC", // ice cold
    highlight: desaturate(0.3, lighten(0.5, "#002FF4")),
    muted: "#f6f6ff",
  },
  dark: {
    text: "#fff",
    gray: "#ccc",
    background: "#000",
    primary: "#0fc",
    secondary: "#0cf",
    highlight: "#f0c",
    muted: "#011",
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
    heading: font("'Passion One', cursive"),
    system:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", ' +
      'Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans, ' +
      'Droid Sans", "Helvetica Neue", sans-serif',
  },
  fontSizes: [16, 18, 23, 27, 36, 54, 72, 81, 108],
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
  // useCustomProperties: true,
  colors: {
    ...colorModes.light,
    modes: omit(colorModes, "light"),
  },
  styles: {
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
      fontSize: 1,
    },
    h1: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 7,
      margin: "0.5em 0",
    },
    h2: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 5,
      margin: "0.5em 0",
    },
    h3: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 4,
    },
    h4: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 3,
      margin: "0.5em 0",
    },
    h5: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 2,
      margin: "0.5em 0",
    },
    h6: {
      color: "text",
      fontFamily: "heading",
      lineHeight: "1.2",
      fontWeight: "heading",
      fontSize: 1,
      margin: "0.5em 0",
    },
    p: {
      color: "text",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
      width: "80ch",
      maxWidth: "100%",
    },
    a: {
      color: "primary",
    },
    pre: {
      fontFamily: "monospace",
      overflowX: "auto",
      code: {
        color: "inherit",
      },
    },
    code: {
      fontFamily: "monospace",
      fontSize: "inherit",
    },
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
    blockquote: {
      margin: 0,
      padding: "0 1em",
      borderLeft: ".25em solid highlight",
      "*": {
        color: "mutedText",
        fontSize: 0,
      },
    },
  },
};

export default theme;
