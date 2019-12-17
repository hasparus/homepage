/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

import { fontSize } from "../gatsby-plugin-theme-ui";

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
  readingTime: number;
}

export const BlogpostDetails = ({
  date,
  readingTime,
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
    {date &&
      new Date(date).toLocaleDateString('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}{" "}
    · {readingTimeEmoji(readingTime)} {readingTime} min read
  </small>
);
