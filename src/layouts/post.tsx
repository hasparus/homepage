/** @jsx jsx */
import { jsx, Styled } from "theme-ui";
import React from "react";

interface DefaultLayoutProps {
  children: React.ReactNode;
  pathContext: {
    frontmatter: {
      title: string;
    };
  };
}

export default function DefaultLayout({
  children,
  pathContext,
}: DefaultLayoutProps) {
  return (
    <Styled.root>
      <Styled.h1>{pathContext.frontmatter.title}</Styled.h1>
      {children}
    </Styled.root>
  );
}
