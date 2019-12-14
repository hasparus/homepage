/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { ComponentPropsWithoutRef } from "react";

import { fontSize } from "../gatsby-plugin-theme-ui";

export type BoxedTextProps = ComponentPropsWithoutRef<typeof s.p>;
export const BoxedText = (props: BoxedTextProps) => {
  return (
    <s.p
      sx={{
        bg: "muted",
        p: 2,
        fontSize: fontSize.small,
        width: "100%",
        fontStyle: "italic",
      }}
      {...props}
    />
  );
};
