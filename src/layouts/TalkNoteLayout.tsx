/** @jsx jsx */
import React, { Fragment } from "react";
import { jsx, Themed as th } from "theme-ui";

import { Footer } from "../features/application-ui/Footer";
import { Header } from "../features/application-ui/Header";
import { Root } from "../features/application-ui/Root";
import { PostDetails } from "../features/blog/PostDetails";
import { PostHeader } from "../features/blog/PostHeader";
import { PostHistory } from "../features/post-history/PostHistory";
import { Seo } from "../features/seo/Seo";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";
import { assert } from "../lib/util/assert";
import { formatTitle } from "../lib/util/formatTitle";

interface TalkNoteLayoutProps {
  children: React.ReactNode;
  pageContext: import("../../gatsby-node").MdxPostPageContext;
  path: string;
}

// eslint-disable-next-line import/no-default-export
export function TalkNoteLayout({
  children,
  pageContext,
  path,
}: TalkNoteLayoutProps) {
  if (!pageContext.frontmatter) {
    return null;
  }

  const { frontmatter, socialImage, history, socialLinks } = pageContext;
  const title = frontmatter.title || "";
  const spoiler = frontmatter.spoiler || "";
  const date = frontmatter.date as Date | string;
  const venues = frontmatter.venues;

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
          <PostHeader title={title}>
            <PostDetails date={date} venues={venues} />
          </PostHeader>
          {children}
          <footer>
            <TweetDiscussEditLinks socialLinks={socialLinks} />
          </footer>
        </article>
      </main>
      {history && (
        <Fragment>
          <th.hr sx={{ mt: 5 }} />
          <PostHistory history={history} />
        </Fragment>
      )}
      <Footer />
    </Root>
  );
}

// eslint-disable-next-line import/no-default-export
export default TalkNoteLayout;
