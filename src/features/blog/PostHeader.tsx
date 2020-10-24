/** @jsx jsx */

import { ComponentPropsWithoutRef } from "react";
import { jsx, Styled as s } from "theme-ui";

import { formatTitle } from "../../lib/util/formatTitle";

export interface PostHeaderProps
  extends ComponentPropsWithoutRef<"header"> {
  title: string;
  children?: React.ReactNode;
}
export function PostHeader({ title, children, ...rest }: PostHeaderProps) {
  return (
    <header sx={{ mb: 4, pt: [0, 5] }} {...rest}>
      <s.h1
        sx={{
          mt: 0,
          mb: [0, 3],
        }}
      >
        {formatTitle(title)}
      </s.h1>
      {children}
    </header>
  );
}
