/** @jsx jsx */
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { jsx, Themed as th } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

export interface BoxedTextProps extends ComponentPropsWithoutRef<"p"> {}

export const BoxedText = ({ children, ...rest }: BoxedTextProps) => {
  // <p> cannot appear as descendant of <p>
  // and it's quite easy to do this accidentally in MDX
  if (
    typeof children === "object" &&
    children &&
    "props" in children &&
    children.props.originalType === "p"
  ) {
    children = children.props.children as ReactNode;
  }

  return (
    <th.p
      sx={{
        bg: "muted",
        p: 2,
        fontSize: fontSize.small,
        width: "100%",
        fontStyle: "italic",
      }}
      {...rest}
    >
      {children}
    </th.p>
  );
};
