/** @jsx jsx */
import { jsx, Styled as s, useThemeUI } from "theme-ui";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Global, ObjectInterpolation } from "@emotion/core";

const globalStyles: ObjectInterpolation<any> = {
  html: {
    scrollBehavior: "smooth",
  },
  body: {
    margin: 0,
    overflowX: "hidden",
  },
};

export const Root = (
  props: Omit<React.ComponentProps<typeof s.root>, "ref">
) => {
  const { theme } = useThemeUI();
  return (
    <Fragment>
      <Helmet>
        <meta name="theme-color" content={theme.colors!.background} />
      </Helmet>
      <Global styles={globalStyles} />

      <s.root {...props} />
    </Fragment>
  );
};
