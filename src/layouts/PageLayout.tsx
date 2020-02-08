/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import { Root, Header, Footer, RootProps } from "../components";

export const PageLayout: React.FC<RootProps> = ({ children, ...rest }) => {
  return (
    <Root {...rest}>
      <Header />
      {children}
      <Footer />
    </Root>
  );
};
