/** @jsx jsx */
import React, { Fragment } from "react";
import { jsx, Styled as s } from "theme-ui";

import { Footer } from "../features/application-ui/Footer";
import { Header } from "../features/application-ui/Header";
import { Root } from "../features/application-ui/Root";
import { PostDetails } from "../features/blog/PostDetails";
import { PostHistory } from "../features/post-history/PostHistory";
import { Seo } from "../features/seo/Seo";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";
import { assert } from "../lib/util/assert";
import { formatTitle } from "../lib/util/formatTitle";

interface TalkNoteLayoutProps {
  children: React.ReactNode;
  pathContext: import("../../gatsby-node").MdxPostPageContext;
  path: string;
}

// eslint-disable-next-line import/no-default-export
export function TalkNoteLayout({
  children,
  pathContext,
  path,
}: TalkNoteLayoutProps) {
  if (!pathContext.frontmatter) {
    return null;
  }

  const {
    frontmatter: { title, date, spoiler, venues },
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
            <s.h1 sx={{ mb: [0, 3], mt: [0, 4] }}>
              {formatTitle(title)}
            </s.h1>
            <PostDetails date={date} venues={venues} />
          </header>
          {children}
          <footer>
            <TweetDiscussEditLinks socialLinks={pathContext.socialLinks} />
          </footer>
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
export default TalkNoteLayout;
