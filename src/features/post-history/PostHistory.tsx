/** @jsx jsx */
import preval from "preval.macro";
import { ComponentPropsWithoutRef } from "react";
import { jsx, Themed as th } from "theme-ui";

import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";
import { formatDate } from "../../lib/util/formatDate";

const REPO_URL = preval/*js*/ `
  module.exports = require('../../../package.json').repository.url;
`;

const ListItemDot = () => (
  <div
    sx={{
      width: "7px",
      height: "7px",
      bg: "gray",
      borderRadius: "50%",
      mr: "0.5em",
      transform: "translateX(-4px)",
      flexShrink: 0,
      "li:first-of-type > &": {
        position: "relative",
        ":before": {
          top: "-100px",
          content: "''",
          position: "absolute",
          width: 8,
          height: 100,
          bg: "background",
          zIndex: -1,
        },
      },
      "li:last-of-type > &": {
        position: "relative",
        ":after": {
          bottom: "-100px",
          content: "''",
          position: "absolute",
          width: 8,
          height: 100,
          bg: "background",
          zIndex: -1,
        },
      },
    }}
  />
);

const PostHistoryList = (props: ComponentPropsWithoutRef<"ol">) => (
  <th.ol
    reversed
    sx={{
      p: 0,
      mx: 2,
      mb: 0,
      listStyle: "none",
      fontSize: fontSize.small,
      borderLeft: "1px solid currentColor",
      color: "muted",
    }}
    {...props}
  />
);

interface PostHistoryListItemProps {
  entry: GatsbyTypes.BlogpostHistoryEntry;
}
const PostHistoryListItem = ({
  entry: { abbreviatedCommit, authorDate, subject },
}: PostHistoryListItemProps) => {
  return (
    <th.li
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
        color: "text092",
        // above background stripe
        "> *": { zIndex: 0 },
      }}
    >
      <ListItemDot />
      <th.code
        sx={{
          mr: 2,
          fontSize: fontSize.small,
        }}
      >
        <th.a href={`${REPO_URL}/commit/${abbreviatedCommit}`}>
          {abbreviatedCommit}
        </th.a>
      </th.code>
      <span sx={{ width: "6.5em", flexShrink: 0 }}>
        {formatDate(authorDate)}
      </span>
      <span
        title={subject && subject.length > 55 ? subject : undefined}
        sx={{
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {subject}
      </span>
    </th.li>
  );
};

type DateRange = [Date | string, Date | string];
const editionDates = (...dates: DateRange) => {
  const [from, to] = dates.map(formatDate);

  return from === to ? ` on ${from}` : ` between ${from} and ${to}.`;
};

const SHOWN_HISTORY_LENGTH = 15;

interface PostHistoryProps {
  history: GatsbyTypes.BlogpostHistory;
}
export function PostHistory({
  history: { entries, url },
}: PostHistoryProps) {
  if (entries.length < 2) {
    return null;
  }

  const hasDatesOnly = !entries[0]!.abbreviatedCommit;

  return (
    <section sx={{ overflowY: "hidden" }}>
      <span
        sx={{
          ml: hasDatesOnly ? 0 : 3,
          color: "text092",
          position: "relative",
          // above dot background stripe
          zIndex: 1,
        }}
      >
        Edited {entries.length} times
        {hasDatesOnly &&
          editionDates(
            entries[entries.length - 1]!.authorDate,
            entries[0]!.authorDate
          )}
      </span>
      {!hasDatesOnly && (
        <PostHistoryList>
          {entries.slice(0, SHOWN_HISTORY_LENGTH).map((entry, i) => (
            <PostHistoryListItem key={i} entry={entry} />
          ))}
        </PostHistoryList>
      )}
      {entries.length > SHOWN_HISTORY_LENGTH && (
        <th.a sx={{ fontSize: fontSize.small, ml: 3 }} href={url}>
          see {entries.length - SHOWN_HISTORY_LENGTH} more on GitHub
        </th.a>
      )}
    </section>
  );
}
