/** @jsx jsx */

// import { graphql } from "gatsby";
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
  // pathContext: import("../../gatsby-node-ts").MdxPostPageContext;
  // path: string;
}

// eslint-disable-next-line import/no-default-export
export function NoteLayout({
  children,
  // pathContext,
  // path,
  ...props
}: NoteLayoutProps) {
  const title = "TODO";
  const spoiler = "TODO";
  const date = new Date();
  const path = "TODO";

  console.log({ props });

  return (
    <Root>
      <Seo article title={title} description={spoiler} pathname={path} />
      <Header />
      <main>
        <article>
          <header sx={{ mb: 4 }}>
            <s.h1 sx={{ mb: [0, 3], mt: [0, 4] }}>
              {formatTitle(title)}
            </s.h1>
            <PostDetails date={date} />
          </header>
          {children}
          <footer>
            {/* TODO */}
            {/* <TweetDiscussEditLinks socialLinks={pathContext.socialLinks} /> */}
          </footer>
        </article>
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
// export const pageQuery = graphql`
//   query GetNote($id: String!) {
//     file(id: { eq: $id }) {
//       childMdx {
//         body
//         ...GatsbyGardenReferences
//       }
//       fields {
//         slug
//         title
//       }
//     }
//   }
// `;
