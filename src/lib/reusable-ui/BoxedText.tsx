/** @jsx jsx */
import { Children, ComponentPropsWithoutRef, ReactNode } from "react";
import { jsx, Themed as th, ThemeUIStyleObject } from "theme-ui";

import { fontSize } from "../theme-ui-preset-hasparus-homepage/tokens";

export interface BoxedTextProps extends ComponentPropsWithoutRef<"p"> {}

export const BoxedText = ({ children, ...rest }: BoxedTextProps) => {
  // <p> cannot appear as descendant of <p>
  // and it's quite easy to do this accidentally in MDX
  if (Array.isArray(children)) {
    return (
      <div
        sx={{
          variant: "layouts.boxedText",
          marginBottom: 3,
          "& p": {
            font: "inherit",
            "&:first-of-type": { marginTop: 0 },
            "&:last-of-type": { marginBottom: 0 },
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

  return (
    <th.p sx={{ variant: "layouts.boxedText" }} {...rest}>
      {children}
    </th.p>
  );
};
