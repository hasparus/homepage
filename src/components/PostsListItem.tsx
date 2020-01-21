/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { ComponentPropsWithoutRef } from "react";
import { Link } from "gatsby";

import { MdxFields } from "../../__generated__/global";
import { theme } from "../components";

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
      marginTop: "3rem",
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
      {title}
    </Link>
  </s.h3>
);

PostsListItem.Header = "header" as const;

PostsListItem.Spoiler = (props: ComponentPropsWithoutRef<"p">) => (
  <s.p sx={{ mt: 1 }} {...props} />
);
