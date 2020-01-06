/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

import { fontSize } from "../gatsby-plugin-theme-ui";
import { MdxFrontmatter } from "../../__generated__/global";
import { formatDate } from "../appUtils";

const cupOfCoffeeTime = 5; // minutes
const burgerTime = cupOfCoffeeTime * Math.E; // stolen from overreacted.io
const readingTimeEmoji = (minutes: number) => {
  return (minutes > 5 * cupOfCoffeeTime
    ? new Array(Math.floor(minutes / burgerTime)).fill("🍔")
    : new Array(Math.ceil(minutes / cupOfCoffeeTime)).fill("☕")
  ).join("");
};

interface BlogpostDetailsProps extends ComponentProps<"small"> {
  date: Date | string;
  readingTime?: number;
  venues?: MdxFrontmatter["venues"];
}

export const BlogpostDetails = ({
  date,
  readingTime,
  venues,
  ...rest
}: BlogpostDetailsProps) => (
  <small
    sx={{
      fontSize: fontSize.small,
      color: "gray",
      display: "block",
    }}
    {...rest}
  >
    {date && formatDate(date)}
    {readingTime &&
      ` · ${readingTimeEmoji(readingTime)} ${readingTime} min read`}
    {venues && ` · ${venues.map(v => v.name).join(", ")}`}
  </small>
);
