/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";

import {
  Footer,
  Header,
  Root,
  RootProps,
} from "../features/application-ui";

export const PageLayout: React.FC<RootProps> = ({ children, ...rest }) => {
  return (
    <Root {...rest}>
      <Header />
      {children}
      <Footer />
    </Root>
  );
};
