/** @jsx jsx */

import { graphql } from "gatsby";
import { alpha } from "@theme-ui/color";
import React from "react";
import { jsx, Styled as s } from "theme-ui";

import { Footer, Header, Root } from "../features/application-ui";
// import { PostHistory } from "../components/PostHistory";
import { PostDetails } from "../features/blog/PostDetails";
import { Seo } from "../features/seo/Seo";
import { formatTitle } from "../lib/util/formatTitle";
// import { TweetDiscussEditLinks } from "../components/TweetDiscussEditLinks";
// import { assert } from "../lib/assert";

interface NoteLayoutProps {
  children: React.ReactNode;
  data: {
    file: {
      childMdx: {};
      fields: {
        title: string;
      };
    };
  };
  // pathContext: import("../../gatsby-node-ts").MdxPostPageContext;
  // path: string;
}

// eslint-disable-next-line import/no-default-export
export function NoteLayout({ children, ...rest }: NoteLayoutProps) {
  console.log({ rest });

  const title = "TODO";
  const spoiler = "TODO";
  const date = new Date();
  const path = "TODO";

  return (
    <Root>
      <Seo article title={title} description={spoiler} pathname={path} />
      <Header />
      <main>
        <header sx={{ mb: 4 }}>
          <s.h1
            sx={{
              fontSize: 5,
              mb: [0, 3],
              mt: [0, 5],
              borderBottom: alpha("text", 0.1),
            }}
          >
            {formatTitle(title)}
          </s.h1>
        </header>
        <article
          sx={{
            "> :first-of-type(h1)": { display: "none" },
          }}
        >
          {children}
        </article>
        <footer>
          {/* TODO */}
          {/* <TweetDiscussEditLinks socialLinks={pathContext.socialLinks} /> */}
        </footer>
      </main>
      {/* {history && (
        <Fragment>
          <s.hr sx={{ mt: 5 }} />
          <PostHistory history={history} />
        </Fragment>
      )} */}
      <Footer />
    </Root>
  );
}

// eslint-disable-next-line import/no-default-export
export default NoteLayout;
