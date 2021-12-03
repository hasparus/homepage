/** @jsx jsx */
import React, { Fragment } from "react";
import { jsx, Themed as th } from "theme-ui";

import { Footer, Header, Root } from "../features/application-ui";
import { PostDetails } from "../features/blog/PostDetails";
import { PostHeader } from "../features/blog/PostHeader";
import { PostHistory } from "../features/post-history/PostHistory";
import { Seo } from "../features/seo/Seo";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";

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

  const { frontmatter, readingTime, history } = pathContext;
  const title = frontmatter.title || "";
  const spoiler = frontmatter.spoiler || "";
  const date = frontmatter.date as Date | string;

  const image = undefined;
  // const image = socialImage?.childImageSharp?.original;

  // // see gatsby-node-ts.ts onPreInit
  // // assert(image, "socialImage is missing");
  // if (!image) {
  //   console.error("socialImage is missing!", {
  //     frontmatter,
  //     path,
  //   });
  // }

  return (
    <Root>
      <Seo
        article
        title={title}
        description={spoiler}
        pathname={path}
        image={image || undefined}
      />
      <Header />
      <main>
        <article>
          <PostHeader title={title}>
            <PostDetails date={date} readingTime={readingTime} />
          </PostHeader>
          {children}
          <footer>
            <TweetDiscussEditLinks socialLinks={pathContext.socialLinks} />
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
export default PostLayout;
