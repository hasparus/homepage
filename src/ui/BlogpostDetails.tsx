/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

interface BlogpostDetailsProps extends ComponentProps<"small"> {
  date: Date | string;
  timeToRead: number;
}

export const BlogpostDetails = ({
  date,
  timeToRead,
  ...rest
}: BlogpostDetailsProps) => (
  <small sx={{ fontSize: 0, display: "block" }} {...rest}>
    {date &&
      new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}{" "}
    · {timeToRead!} min read
  </small>
);
