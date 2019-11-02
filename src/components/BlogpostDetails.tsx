/** @jsx jsx */
import { jsx } from "theme-ui";
import { ComponentProps } from "react";

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
  timeToRead: number;
}

export const BlogpostDetails = ({
  date,
  timeToRead,
  ...rest
}: BlogpostDetailsProps) => (
  <small
    sx={{
      fontSize: 0,
      color: "gray",
      display: "block",
    }}
    {...rest}
  >
    {date &&
      new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}{" "}
    · {readingTimeEmoji(timeToRead)} {timeToRead!} min read
  </small>
);
