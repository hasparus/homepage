/** @jsx jsx */

import { graphql, Link } from "gatsby";
import { alpha } from "@theme-ui/color";
import React, { isValidElement } from "react";
import { jsx, Styled as s, ThemeUIStyleObject } from "theme-ui";

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

const ReferencesSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <section sx={{ backgroundColor: "muted", mx: -3, px: 3, pt: 2, pb: 3 }}>
      {children}
    </section>
  );
};

interface ReferenceLinkProps {
  linkTo: string;
  title: string;
  paragraphHtml: string;
}
const ReferenceLink = ({
  linkTo,
  title,
  paragraphHtml,
}: ReferenceLinkProps) => {
  return (
    <Link
      to={linkTo}
      sx={{
        ...theme.styles.a,
        fontSize: 0,
        display: "block",
        py: 1,
        px: 3,

        p: {
          my: 0,
          width: "unset",
        },
        ":focus, :hover": {
          backgroundColor: alpha("background", 0.25),
          p: {
            textDecoration: "none",
            ":first-of-type": {
              textDecoration: "underline",
            },
          },
        },
      }}
    >
      <s.p>{title}</s.p>
      <s.p
        dangerouslySetInnerHTML={{ __html: paragraphHtml }}
        sx={{
          color: "text092",
          opacity: 0.9,
        }}
      />
    </Link>
  );
};

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

const sectionHeadingStyle: ThemeUIStyleObject = {
  fontSize: fontSize.small,
  textTransform: "uppercase",
  letterSpacing: 3,
  color: "text092",
  opacity: 0.92,
};

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
            <ReferencesSection>
              {/* same styles as table-of-contents :: todo: make it a variant? */}
              <header>
                <s.h3 id="referred-in" sx={sectionHeadingStyle}>
                  Referred {inboundReferences.length} time
                  {inboundReferences.length === 1 ? "" : "s"} in
                </s.h3>
              </header>
              {inboundReferences.map(({ node: { fields }, paragraph }) => {
                return (
                  <ReferenceLink
                    linkTo={fields!.route}
                    title={fields!.title!}
                    paragraphHtml={paragraph}
                  />
                );
              })}
            </ReferencesSection>
          )}
          {outboundReferences.length === 0 ? null : (
            <ReferencesSection>
              <header>
                <s.h3 id="outbound-references" sx={sectionHeadingStyle}>
                  Outbound references
                </s.h3>
              </header>
              {outboundReferences.map(({ fields, excerpt }) => {
                return (
                  <ReferenceLink
                    linkTo={fields!.route}
                    title={fields!.title!}
                    paragraphHtml={excerpt}
                  />
                );
              })}
            </ReferencesSection>
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
