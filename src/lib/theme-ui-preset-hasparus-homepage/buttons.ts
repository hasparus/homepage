import { Theme } from "theme-ui";

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
