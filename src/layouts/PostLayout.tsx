/** @jsx jsx */
import React, { Fragment } from "react";
import { jsx, Styled as s } from "theme-ui";

import { Footer, Header, Root } from "../features/application-ui";
import { PostDetails } from "../features/blog/PostDetails";
import { PostHistory } from "../features/post-history/PostHistory";
import { Seo } from "../features/seo/Seo";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";
import { assert } from "../lib/util/assert";
import { formatTitle } from "../lib/util/formatTitle";

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: import("../../gatsby-node").MdxPostPageContext;
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

  const { frontmatter, readingTime, socialImage, history } = pathContext;
  const title = frontmatter.title || "";
  const spoiler = frontmatter.spoiler || "";
  const date = frontmatter.date as Date | string;

  const image = socialImage?.childImageSharp?.original;

  // see gatsby-node-ts.ts onPreInit
  // assert(image, "socialImage is missing");
  if (!image) {
    console.error("socialImage is missing!", path);
  }

  return (
    <Root>
      <Seo
        article
        title={title}
        description={spoiler}
        pathname={path}
        image={image || undefined} // TODO
      />
      <Header />
      <main>
        <article>
          <header sx={{ mb: 4 }}>
            <s.h1 sx={{ mb: [0, 3], mt: [0, 5] }}>
              {formatTitle(title)}
            </s.h1>
            <PostDetails date={date} readingTime={readingTime} />
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
export default PostLayout;
