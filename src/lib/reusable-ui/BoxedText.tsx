/** @jsx jsx */
import { ComponentPropsWithoutRef } from "react";
import { jsx, Styled as s } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

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
