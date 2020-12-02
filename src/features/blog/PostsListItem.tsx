/** @jsx jsx */
import { Link } from "gatsby";
import { ComponentPropsWithoutRef } from "react";
import { jsx, Themed as th } from "theme-ui";

import { theme } from "../../gatsby-plugin-theme-ui";
import { linkTextDecorationColor } from "../../lib/theme-ui-preset-hasparus-homepage/styles";
import { formatTitle } from "../../lib/util/formatTitle";

export const PostsListItem = (
  props: ComponentPropsWithoutRef<"article">
) => <article {...props} />;

interface PostListItemHeadingProps {
  title: string;
}
PostsListItem.Heading = ({ title, ...rest }: PostListItemHeadingProps) => (
  <th.h3
    sx={{
      marginBottom: 0,
      marginTop: "1.953rem",
      color: "text092",
    }}
    {...rest}
  >
    {formatTitle(title)}
  </th.h3>
);

export interface PostListItemHeaderProps {
  linkTo: string;
  children: React.ReactNode;
}
PostsListItem.Header = ({ linkTo, children }: PostListItemHeaderProps) => {
  return (
    <Link
      to={linkTo}
      sx={{
        ...theme.styles.a,
        textDecoration: "none",
        ":focus > h3, :hover > h3": {
          textDecoration: "underline",
          textDecorationColor: linkTextDecorationColor.value,
        },
      }}
    >
      {children}
    </Link>
  );
};

PostsListItem.Spoiler = (props: ComponentPropsWithoutRef<"p">) => (
  <th.p sx={{ mt: 2 }} {...props} />
);
