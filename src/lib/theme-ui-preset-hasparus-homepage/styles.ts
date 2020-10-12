import { ThemeUICSSObject } from "theme-ui";

import { randomElement } from "../util";
import { sketchyBorders } from "./sketchyBorders";
import { makeStyles } from "./theme-ui-utils";
import { fontSize } from "./typography";

const code: ThemeUICSSObject = {
  fontFamily: "monospace",
  fontSize: fontSize.small,
  bg: "muted",
  borderRadius: 1,
  padding: ".1em .15em .05em",
  lineHeight: "monospace",
};

const headingStyles: ThemeUICSSObject = {
  fontFamily: "heading",
  fontWeight: "heading",
  lineHeight: "1.2",

  display: "inline-flex",
  alignItems: "center",

  color: "text092",

  p: 2,
  my: 0,
  mx: -2,

  code: {
    fontSize: "0.85em",
    fontWeight: "bold",
  },
};

export const styles = makeStyles({
  // used for <body>
  root: {
    fontSize: fontSize.normal,
    fontFamily: "body",
    lineHeight: "body",
    fontWeight: "body",
    "*": {
      boxSizing: "border-box",
    },
  },
  h1: {
    ...headingStyles,
    fontSize: [5, 6],
    textAlign: ["center", "left", "left"],
    py: [5, 0, 0],
    lineHeight: 1.1,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    wordBreak: "break-word",
  },
  h2: {
    ...headingStyles,
    color: "text",
    fontSize: 5,
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
  },
  h5: {
    ...headingStyles,
    color: "text",
    fontSize: 2,
  },
  h6: {
    ...headingStyles,
    color: "text",
    fontFamily: "text",
    fontSize: 1,
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
    cursor: "pointer",
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
      fontSize: [-1, 0],
      color: "inherit !important",
      bg: "inherit !important",
      padding: "0 !important",
    },
    mx: [-3, -3, -5],
    "--scrollbar-color": "255, 255, 255",
    "@media (min-width: 745px)": randomElement(sketchyBorders),
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
    borderBottom: "2px dashed",
    opacity: 0.4,
  },
});
