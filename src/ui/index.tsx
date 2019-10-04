/** @jsx jsx */
import { Styled as s, jsx } from "theme-ui";

export { theme } from "../gatsby-plugin-theme-ui";

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
