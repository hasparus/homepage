/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React from "react";
import { Header, Root } from "../ui";
import { BlogpostDetails } from "../ui/BlogpostDetails";

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
}

export default function PostLayout({ children, pathContext }: PostLayoutProps) {
  return (
    <Root>
      <Header showHome />
      <main>
        <article>
          <header>
            <s.h1>{pathContext.frontmatter.title}</s.h1>
            <BlogpostDetails
              date={pathContext.frontmatter.date}
              timeToRead={pathContext.timeToRead}
            />
          </header>
          {children}
        </article>
      </main>
    </Root>
  );
}
