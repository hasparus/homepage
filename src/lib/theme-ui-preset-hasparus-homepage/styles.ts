import { alpha } from "@theme-ui/color";
import { Theme, ThemeUICSSObject } from "theme-ui";

import { makeStyles } from "./theme-ui-utils";
import { fontSize } from "./typography";

export const linkTextDecorationColor = {
  name: "--link-text-decoration-color",
  value: "var(--link-text-decoration-color)",
};

// hack
const getPrimary = (t: Theme) => t.colors!.primary;

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

  display: "flex",
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

type MinusOne = [null, 0, 1, 2, 3, 4, 5, 6];
type FontSize = ThemeUICSSObject["fontSize"];
type HomogenicTuple<T, N> = N extends 0
  ? []
  : N extends keyof MinusOne
  ? [T, ...HomogenicTuple<T, MinusOne[N]>]
  : never;

export const headingFontSizes: HomogenicTuple<FontSize, 6> = [
  [4, 6], // h1
  [4, 5],
  4,
  3,
  2,
  1,
];
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
    fontSize: headingFontSizes[0],
    textAlign: ["center", "left", "left"],
    py: [5, 0, 0],
    lineHeight: 1.1,
    // eslint-disable-next-line sonarjs/no-duplicate-string
    wordBreak: "break-word",
  },
  h2: {
    ...headingStyles,
    color: "text",
    fontSize: headingFontSizes[1],
    wordBreak: "break-word",
  },
  h3: {
    ...headingStyles,
    color: "gray",
    fontSize: headingFontSizes[2],
    wordBreak: "break-word",
  },
  h4: {
    ...headingStyles,
    color: "gray",
    fontSize: headingFontSizes[3],
  },
  h5: {
    ...headingStyles,
    color: "text",
    fontSize: headingFontSizes[4],
  },
  h6: {
    ...headingStyles,
    color: "text",
    fontFamily: "text",
    fontSize: headingFontSizes[5],
  },
  p: {
    color: "text",
    fontFamily: "body",
    fontWeight: "body",
    lineHeight: "body",
    width: "63ch",
    maxWidth: "100%",
    "& code": {
      ...code,
      verticalAlign: "middle",
      display: "inline-flex",
    },
    "& sup": {
      fontSize: 0,
      "& code": {
        fontSize: [0],
      },
    },
  },

  a: {
    overflowWrap: "break-word",
    color: "primary",
    cursor: "pointer",
    textDecorationColor: alpha("primary", 0.15),
    ":focus, :hover": {
      // Fixme in Theme UI
      [linkTextDecorationColor.name]: getPrimary,
      textDecorationColor: linkTextDecorationColor.value,
    },
    "@media print": {
      color: "inherit",
    },
  },
  code,
  pre: {
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
    mx: [-3, -3, -4],
    p: [2, 3, 4],
    "--scrollbar-color": "255, 255, 255",
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
    "& code": {
      verticalAlign: "middle",
    },
  },
  blockquote: {
    margin: 0,
    padding: "0 1em",
    borderLeft: ".25em solid",
    borderColor: "highlight",
    "*": {
      fontSize: fontSize.small,
    },
    "& p > code": {
      fontSize: fontSize.smaller,
      verticalAlign: "middle",
    },
  },
  hr: {
    border: "none",
    borderBottom: "6px dashed",
    opacity: 0.125,
  },

  details: {
    borderRight: "0.25em dashed",
    paddingRight: "1em",
    borderColor: "muted",
    "> summary": {
      cursor: "pointer",
    },
    "&[open]": {
      borderBottom: "0.25em dashed",
      borderColor: "muted",
      paddingBottom: "0.5em",
    },
  },
});
