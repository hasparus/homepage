/** @jsx jsx */

import { graphql, Link } from "gatsby";
import { alpha } from "@theme-ui/color";
import React, { isValidElement } from "react";
import { jsx, Styled as s } from "theme-ui";

import { Footer, Header, Root } from "../features/application-ui";
// import { PostHistory } from "../components/PostHistory";
import { PostDetails } from "../features/blog/PostDetails";
import { Seo } from "../features/seo/Seo";
import { formatTitle } from "../lib/util/formatTitle";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";
import { NotePagePathContext } from "../features/brain-notes/gatsby-theme-notes-brain/createPages";
import { theme } from "../gatsby-plugin-theme-ui";
import { fontSize } from "../gatsby-plugin-theme-ui/tokens";
import { PostHeader } from "../lib/reusable-ui/PostHeader";

function assertChildrenHaveMoreThanOneTopH1(children: React.ReactNode) {
  if (process.env.NODE_ENV === "development") {
    React.Children.forEach(children, (child, i) => {
      const node: React.ReactNode = child;
      if (isValidElement(node) && node.props.mdxType === "h1") {
        if (i === 0) {
          // leading h1 is okay, we'll just hide it, but no reason to warn about it
          return;
        }

        throw new Error(
          "h1 elements in notes are not displayed. Are you sure you want to use them?"
        );
      }
    });
  }
}

interface NoteLayoutProps {
  children: React.ReactNode;
  pathContext: NotePagePathContext;
  // path: string;
}

export function NoteLayout({ children, pathContext }: NoteLayoutProps) {
  assertChildrenHaveMoreThanOneTopH1(children);

  const {
    title,
    inboundReferences,
    outboundReferences,
    socialLinks,
  } = pathContext;

  const spoiler = "TODO";
  const date = new Date();
  const path = "TODO";

  return (
    <Root>
      <Seo article title={title} description={spoiler} pathname={path} />
      <Header />
      <main>
        <PostHeader title={title} />
        <article
          sx={{
            // yup, we're hiding all h1s
            // there's one on the top of the page, and this should be it
            "> h1": { display: "none" },
          }}
        >
          {children}
        </article>
        <footer>
          {inboundReferences.length === 0 ? null : (
            <section>
              {/* same styles as table-of-contents :: todo: make it a variant? */}
              <header>
                <s.h3
                  id="referred-in"
                  sx={{
                    fontSize: fontSize.small,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    color: "text092",
                  }}
                >
                  Referred {inboundReferences.length} time
                  {inboundReferences.length === 1 ? "" : "s"} in
                </s.h3>
              </header>
              {inboundReferences.map(({ fields }) => {
                return (
                  <Link
                    to={fields!.route}
                    sx={{ ...theme.styles.a, fontSize: fontSize.small }}
                  >
                    {fields!.title}
                  </Link>
                );
              })}
            </section>
          )}
          <TweetDiscussEditLinks socialLinks={socialLinks} />
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
