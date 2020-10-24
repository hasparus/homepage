/** @jsx jsx */
import { transparentize } from "@theme-ui/color";
import { ComponentProps } from "react";
import { jsx, Styled as s } from "theme-ui";

import { MdxFrontmatter, Venue } from "../../../__generated__/global";
import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";
import { formatDate } from "../../lib/util/formatDate";

const cupOfCoffeeTime = 5; // minutes
const burgerTime = cupOfCoffeeTime * Math.E; // stolen from overreacted.io
const readingTimeEmoji = (minutes: number) => {
  return (minutes > 5 * cupOfCoffeeTime
    ? new Array(Math.floor(minutes / burgerTime)).fill("🍔")
    : new Array(Math.ceil(minutes / cupOfCoffeeTime)).fill("☕")
  ).join("");
};

interface VenueLinkProps {
  venue: Venue;
}
const VenueLink = ({ venue }: VenueLinkProps) => {
  return (
    <span sx={{ ":not(:last-child)::after": { content: "', '" } }}>
      {venue.link ? (
        <s.a
          sx={{
            color: "unset",
            textDecoration: "underline",
            textDecorationColor: transparentize("text", 0.85),
          }}
          href={venue.link || undefined}
        >
          {venue.name}
        </s.a>
      ) : (
        venue.name
      )}
    </span>
  );
};

const Venues = ({
  venues,
}: {
  venues: readonly Venue[] | null | undefined;
}) => {
  return venues ? (
    <span>
      {" · "}
      {venues.map((v) => (
        <VenueLink key={v.name} venue={v} />
      ))}
    </span>
  ) : null;
};

interface PostDetailsProps extends ComponentProps<"small"> {
  date: Date | string;
  readingTime?: number;
  venues?: MdxFrontmatter["venues"];
}

export const PostDetails = ({
  date,
  readingTime,
  venues,
  ...rest
}: PostDetailsProps) => (
  <small
    sx={{
      fontSize: fontSize.small,
      color: "gray",
      display: "block",
      fontWeight: "bold",
    }}
    {...rest}
  >
    {date && formatDate(date)}
    {readingTime &&
      ` · ${readingTimeEmoji(readingTime)} ${readingTime} min read`}
    <Venues venues={venues} />
  </small>
);
