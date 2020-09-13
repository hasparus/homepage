/** @jsx jsx */
import { Global, ObjectInterpolation } from "@emotion/core";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { jsx, Styled as s, useThemeUI } from "theme-ui";

import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";

const globalStyles: ObjectInterpolation<any> = {
  html: {
    scrollBehavior: "smooth",
    fontSize: fontSize.base,
  },
  body: {
    margin: 0,
    overflowX: "hidden",
  },
  "@media print": {
    html: {
      fontSize: "17px",
    },
  },
};

export interface RootProps
  extends Omit<React.ComponentProps<typeof s.root>, "ref"> {}

export const Root = (props: RootProps) => {
  const { theme } = useThemeUI();
  return (
    <Fragment>
      <Helmet>
        <meta name="theme-color" content={theme.colors!.background} />
      </Helmet>
      <Global styles={globalStyles} />

      <s.root
        {...props}
        sx={{
          maxWidth: "746px", // ~63ch with Segoe UI 22px
          "@media print": {
            maxWidth: "80ch",
          },
          px: [3, 3, 0],
          mx: "auto",
          mt: 3,
          mb: 5,
        }}
      />
    </Fragment>
  );
};
