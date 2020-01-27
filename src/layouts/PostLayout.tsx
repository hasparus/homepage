/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React, { Fragment, ComponentPropsWithoutRef } from "react";
import preval from "preval.macro";

import { Header, Root } from "../components";
import { PostDetails } from "../components/PostDetails";
import { Seo } from "../components/Seo";
import {
  Mdx,
  File,
  MdxFields,
  BlogpostHistory,
  BlogpostHistoryEntry,
} from "../../__generated__/global";
import { Footer } from "../components/Footer";
import { formatDate } from "../appUtils";
import { fontSize } from "../gatsby-plugin-theme-ui";
import { assert } from "../lib";

const REPO_URL = preval/*js*/ `
  module.exports = require('../../package.json').repository.url;
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
        },
      },
    }}
  />
);

const PostHistoryList = (props: ComponentPropsWithoutRef<"ol">) => (
  <s.ol
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
  entry: BlogpostHistoryEntry;
}
const PostHistoryListItem = ({
  entry: { abbreviatedCommit, authorDate, subject },
}: PostHistoryListItemProps) => {
  return (
    <s.li
      sx={{
        display: "flex",
        alignItems: "center",
        my: 1,
        color: "text092",
      }}
    >
      <ListItemDot />
      <s.code
        sx={{
          mr: 2,
          fontSize: fontSize.small,
        }}
      >
        <s.a href={`${REPO_URL}/commit/${abbreviatedCommit}`}>
          {abbreviatedCommit}
        </s.a>
      </s.code>
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
    </s.li>
  );
};

const SHOWN_HISTORY_LENGTH = 15;

interface PostHistoryProps {
  history: BlogpostHistory;
}
export function PostHistory({
  history: { entries, url },
}: PostHistoryProps) {
  if (entries.length < 2) {
    return null;
  }

  const hasDatesOnly = !entries[0].abbreviatedCommit;

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
          ` between ${formatDate(
            entries[entries.length - 1].authorDate
          )} and ${formatDate(entries[0].authorDate)}.`}
      </span>
      {!hasDatesOnly && (
        <PostHistoryList>
          {entries.slice(0, SHOWN_HISTORY_LENGTH).map((entry, i) => (
            <PostHistoryListItem key={i} entry={entry} />
          ))}
        </PostHistoryList>
      )}
      {entries.length > SHOWN_HISTORY_LENGTH && (
        <s.a sx={{ fontSize: fontSize.small, ml: 3 }} href={url}>
          see {entries.length - SHOWN_HISTORY_LENGTH} more on GitHub
        </s.a>
      )}
    </section>
  );
}

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: Mdx["frontmatter"];
    readingTime: number;
    socialImage: File | null;
    history: MdxFields["history"];
  };
  path: string;
}

// eslint-disable-next-line import/no-default-export
export function PostLayout({
  children,
  pathContext,
  path,
}: PostLayoutProps) {
  // HMR issue?
  if (!pathContext.frontmatter) {
    return null;
  }

  const {
    frontmatter: { title, date, spoiler, venues },
    readingTime,
    socialImage,
    history,
  } = pathContext;

  const image = socialImage?.childImageSharp?.original;

  // see gatsby-node-ts.ts onPreInit
  assert(image, "socialImage is missing");

  return (
    <Root>
      <Seo
        article
        title={title}
        description={spoiler}
        pathname={path}
        image={image}
      />
      <Header />
      <main>
        <article>
          <header sx={{ mb: 4 }}>
            <s.h1 sx={{ mb: [0, 3], mt: [0, 4] }}>{title}</s.h1>
            <PostDetails
              date={date}
              readingTime={venues ? undefined : readingTime}
              venues={venues}
            />
          </header>
          {children}
        </article>
      </main>
      {history && (
        <Fragment>
          <s.hr sx={{ mt: 5 }} />
          <PostHistory history={history} />
        </Fragment>
      )}
      <Footer />
    </Root>
  );
}

// eslint-disable-next-line import/no-default-export
export default PostLayout;
