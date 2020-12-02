/** @jsx jsx */
import { ComponentPropsWithoutRef } from "react";
import { jsx, Themed as th } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

export type BoxedTextProps = ComponentPropsWithoutRef<typeof th.p>;

export const BoxedText = (props: BoxedTextProps) => {
  return (
    <th.p
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
