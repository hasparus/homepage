/** @jsx jsx */
import { Styled as s, jsx } from "theme-ui";
import { colorModes } from "../gatsby-plugin-theme-ui";

export { theme } from "../gatsby-plugin-theme-ui";

export type ColorModes = keyof typeof colorModes;
export { colorModes };

export const Root = (
  props: Omit<React.ComponentProps<typeof s.root>, "ref">
) => (
  <s.root
    sx={{
      maxWidth: "42rem",
      mx: "auto",
    }}
    {...props}
  />
);

export const Button = (props: React.ComponentProps<"button">) => (
  <button
    sx={{
      display: "inline",
      padding: 0,
      font: "inherit",
      color: "inherit",
      background: "none",
      outline: "none",
      cursor: "pointer",
      border: "1px solid transparent",
      "&:focus, &:hover": {
        borderColor: "currentColor",
      },
    }}
    {...props}
  />
);
