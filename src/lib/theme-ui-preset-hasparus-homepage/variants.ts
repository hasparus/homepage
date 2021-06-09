import { Theme } from "theme-ui";

import { makeStyles } from "./theme-ui-utils";
import { fontSize } from "./tokens";

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

export const buttons: Theme["buttons"] = {
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

export const layouts = makeStyles({
  boxedText: {
    bg: "muted",
    p: 2,
    fontSize: fontSize.small,
    width: "100%",
    "& code": { fontSize: fontSize.smaller },
    fontStyle: "italic",
    "& :not(:first-of-type:is(p))": {
      fontStyle: "normal",
    },
  },
});
