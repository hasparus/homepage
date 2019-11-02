/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React from "react";

export const Root = (
  props: Omit<React.ComponentProps<typeof s.root>, "ref">
) => (
  <s.root
    sx={{
      maxWidth: "80ch",
      mx: "auto",
      mt: 3,
      mb: 6,
      "*": {
        boxSizing: "border-box",
      },
    }}
    {...props}
  />
);
