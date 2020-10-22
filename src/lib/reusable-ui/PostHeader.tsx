/** @jsx jsx */

import { jsx, Styled as s } from "theme-ui";

import { formatTitle } from "../util/formatTitle";

export interface PostHeaderProps {
  title: string;
  children?: React.ReactNode;
}
export function PostHeader({ title, children }: PostHeaderProps) {
  return (
    <header sx={{ mb: 4, pt: [0, 5] }}>
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
