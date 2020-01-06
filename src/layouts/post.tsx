/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React from "react";

import { Header, Root } from "../components";
import { BlogpostDetails } from "../components/BlogpostDetails";
import { Seo } from "../components/Seo";
import { Mdx, File } from "../../__generated__/global";
import { Footer } from "../components/Footer";

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: Mdx["frontmatter"];
    readingTime: number;
    socialImage: File;
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
      <Footer />
    </Root>
  );
}
