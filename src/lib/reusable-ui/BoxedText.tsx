/** @jsx jsx */
import { Children, ComponentPropsWithoutRef, ReactNode } from "react";
import { jsx, Themed as th, ThemeUIStyleObject } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

const styles: ThemeUIStyleObject = {
  bg: "muted",
  p: 2,
  fontSize: fontSize.small,
  width: "100%",
  fontStyle: "italic",
  "& code": {
    fontSize: fontSize.smaller,
  },
};

export interface BoxedTextProps extends ComponentPropsWithoutRef<"p"> {}

export const BoxedText = ({ children, ...rest }: BoxedTextProps) => {
  // <p> cannot appear as descendant of <p>
  // and it's quite easy to do this accidentally in MDX
  if (Array.isArray(children)) {
    return (
      <div
        sx={{
          ...styles,
          marginBottom: 3,
          "& p": {
            font: "inherit",
            "&:first-child": { marginTop: 0 },
            "&:last-child": { marginBottom: 0 },
          },
        }}
      >
        {children}
      </div>
    );
  } else if (
    typeof children === "object" &&
    children &&
    "props" in children &&
    children.props.originalType === "p"
  ) {
    children = children.props.children as ReactNode;
  }

  return <th.p {...rest}>{children}</th.p>;
};
