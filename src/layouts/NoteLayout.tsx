/** @jsx jsx */

import { alpha } from "@theme-ui/color";
import { graphql, Link } from "gatsby";
import React, { isValidElement } from "react";
import { jsx, Themed as th, ThemeUIStyleObject } from "theme-ui";

import { Footer, Header, Root } from "../features/application-ui";
// import { PostHistory } from "../components/PostHistory";
import { PostDetails } from "../features/blog/PostDetails";
import { PostHeader } from "../features/blog/PostHeader";
import { NotePagePathContext } from "../features/brain-notes/gatsby-theme-notes-brain/createPages";
import { Seo } from "../features/seo/Seo";
import { TweetDiscussEditLinks } from "../features/social-sharing/TweetDiscussEditLinks";
import { theme } from "../gatsby-plugin-theme-ui";
import { fontSize } from "../gatsby-plugin-theme-ui/tokens";
import {
  headingFontSizes,
  linkTextDecorationColor,
} from "../lib/theme-ui-preset-hasparus-homepage/styles";

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

        textDecoration: "none",
        p: {
          my: 0,
          width: "unset",
        },
        ":focus, :hover": {
          backgroundColor: alpha("background", 0.25),
          p: {
            ":first-of-type": {
              textDecoration: "underline",
              textDecorationColor: linkTextDecorationColor.value,
            },
          },
        },
      }}
    >
      <th.p>{title}</th.p>
      <th.p
        dangerouslySetInnerHTML={{ __html: paragraphHtml }}
        sx={{
          color: "text092",
          opacity: 0.9,
        }}
      />
    </Link>
  );
};

function assertChildrenHaveNoMoreThanOneTopH1(children: React.ReactNode) {
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
  opacity: 0.9,
};

const titleHeadingFontSizeStyle = { h1: headingFontSizes[2] };
const noteHeadingsFontSizesStyle = {
  // yup, we're hiding all h1s inside of the note
  // there can be only one on the top of the page, and this should be it
  "> h1": { display: "none" },
  h2: { fontSize: headingFontSizes[3] },
  h3: { fontSize: headingFontSizes[4] },
  h4: { fontSize: headingFontSizes[5] },
  h5: { fontSize: headingFontSizes[5] },
};

interface NoteLayoutProps {
  children: React.ReactNode;
  pathContext: NotePagePathContext;
  // path: string;
}

export function NoteLayout({ children, pathContext }: NoteLayoutProps) {
  assertChildrenHaveNoMoreThanOneTopH1(children);

  const {
    title,
    inboundReferences,
    outboundReferences,
    socialLinks,
  } = pathContext;

  // I'm gonna finish it some day.
  const spoiler = ""; // TODO
  const path = ""; // TODO

  return (
    <Root>
      <Seo article title={title} description={spoiler} pathname={path} />
      <Header />
      <main>
        <PostHeader title={title} sx={titleHeadingFontSizeStyle} />
        <article sx={noteHeadingsFontSizesStyle}>{children}</article>
        <footer sx={{ pt: 3 }}>
          {inboundReferences.length === 0 ? null : (
            <ReferencesSection>
              {/* same styles as table-of-contents :: todo: make it a variant? */}
              <header>
                <th.h3 id="referred-in" sx={sectionHeadingStyle}>
                  Referred {inboundReferences.length} time
                  {inboundReferences.length === 1 ? "" : "s"} in
                </th.h3>
              </header>
              {inboundReferences.map(({ node: { fields }, paragraph }) => {
                return (
                  <ReferenceLink
                    key={fields!.route}
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
                <th.h3 id="outbound-references" sx={sectionHeadingStyle}>
                  Outbound references
                </th.h3>
              </header>
              {outboundReferences.map(({ fields, excerpt }) => {
                return (
                  <ReferenceLink
                    key={fields!.route}
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
