/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React from "react";
import { Header, Root } from "../components";
import { BlogpostDetails } from "../components/BlogpostDetails";
import Seo from "../components/Seo";

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: {
      title: string;
      spoiler: string;
      date: string;
    };
    timeToRead: number;
  };
  path: string;
}

export default function PostLayout({
  children,
  pathContext,
  path,
}: PostLayoutProps) {
  const {
    frontmatter: { title, date, spoiler },
    timeToRead,
  } = pathContext;

  return (
    <Root>
      <Seo article title={title} description={spoiler} pathname={path} />
      <Header showHome />
      <main>
        <article>
          <header>
            <s.h1>{title}</s.h1>
            <BlogpostDetails date={date} timeToRead={timeToRead} />
          </header>
          {children}
        </article>
      </main>
    </Root>
  );
}
