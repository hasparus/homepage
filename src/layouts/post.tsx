/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React, { Fragment } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import preval from "preval.macro";

import { Header, Root } from "../components";
import { BlogpostDetails } from "../components/BlogpostDetails";
import { Seo } from "../components/Seo";
import { Mdx, File, MdxFields } from "../../__generated__/global";
import { Footer } from "../components/Footer";
import { formatDate } from "../appUtils";
import { fontSize } from "../gatsby-plugin-theme-ui";

const REPO_URL = preval/*js*/ `
  module.exports = require('../../package.json').repository.url;
`;

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: Mdx["frontmatter"];
    readingTime: number;
    socialImage: File;
    history: MdxFields["history"];
  };
  path: string;
}

// eslint-disable-next-line import/no-default-export
export default function PostLayout({
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

  return (
    <Root>
      <Seo
        article
        title={title}
        description={spoiler}
        pathname={path}
        image={socialImage.childImageSharp?.original || undefined}
      />
      <Header showHome />
      <main>
        <article>
          <header sx={{ mb: 4 }}>
            <s.h1 sx={{ mb: [0, 2], mt: [0, 4] }}>{title}</s.h1>
            <BlogpostDetails
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
          <s.hr />
          <section
            sx={{
              overflowY: "hidden",
              px: 2,
            }}
          >
            <s.ol
              reversed
              sx={{
                listStyle: "none",
                p: 0,
                fontSize: fontSize.small,
                borderLeft: "1px solid currentColor",
                color: "muted",
              }}
            >
              {history.map(
                ({ abbreviatedCommit, subject, authorDate }, i) => (
                  <s.li
                    key={abbreviatedCommit || i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      my: 1,
                      color: "text092",
                    }}
                  >
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
                    <s.code sx={{ mr: 2 }}>
                      <s.a href={`${REPO_URL}/commit/${abbreviatedCommit}`}>
                        {abbreviatedCommit}
                      </s.a>
                    </s.code>
                    <span sx={{ mr: 2 }}>{formatDate(authorDate)}</span>
                    {subject}
                  </s.li>
                )
              )}
            </s.ol>
          </section>
        </Fragment>
      )}
      <Footer />
    </Root>
  );
}
