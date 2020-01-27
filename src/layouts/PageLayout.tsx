import React from "react";
import { Root, Header, Footer } from "../components";

export const PageLayout: React.FC = ({ children }) => {
  return (
    <Root>
      <Header />
      {children}
      <Footer />
    </Root>
  );
};
