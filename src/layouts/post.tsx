/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import React from "react";
import { Header, Root } from "../ui";

interface PostLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: {
      title: string;
    };
  };
}

export default function PostLayout({ children, pathContext }: PostLayoutProps) {
  return (
    <Root>
      <Header showHome />
      <main sx={{ mb: 6 }}>
        <article>
          <header>
            <s.h1>{pathContext.frontmatter.title}</s.h1>
            <s.p></s.p>
          </header>
          {children}
        </article>
      </main>
    </Root>
  );
}
