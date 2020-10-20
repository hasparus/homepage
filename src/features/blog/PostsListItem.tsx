/** @jsx jsx */
import { Link } from "gatsby";
import { ComponentPropsWithoutRef } from "react";
import { jsx, Styled as s } from "theme-ui";

import { MdxFields } from "../../../__generated__/global";
import { theme } from "../../gatsby-plugin-theme-ui";
import { formatTitle } from "../../lib/util/formatTitle";

export const PostsListItem = (
  props: ComponentPropsWithoutRef<"article">
) => <article {...props} />;

interface PostListItemHeadingProps {
  title: string;
  fields: Pick<MdxFields, "route">;
}
PostsListItem.Heading = ({
  title,
  fields,
  ...rest
}: PostListItemHeadingProps) => (
  <s.h3
    sx={{
      marginBottom: "0.4375rem",
      marginTop: "1.953rem",
      color: "text",
    }}
    {...rest}
  >
    <Link
      to={fields.route}
      sx={{
        ...theme.styles.a,
        color: "currentColor",
      }}
    >
      {formatTitle(title)}
    </Link>
  </s.h3>
);

PostsListItem.Header = "header" as const;

PostsListItem.Spoiler = (props: ComponentPropsWithoutRef<"p">) => (
  <s.p sx={{ mt: 2 }} {...props} />
);
