/** @jsx jsx */
import { jsx, Styled as s, useThemeUI } from "theme-ui";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Global } from "@emotion/core";

const globalStyles = {
  body: {
    margin: 0,
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

      <s.root
        sx={{
          // this is about "80ch" but I'd like to avoid layout jumping on font load,
          maxWidth: "824px",
          mx: [3, "auto"],
          mt: 3,
          mb: 6,
          "*": {
            boxSizing: "border-box",
          },
        }}
        {...props}
      />
    </Fragment>
  );
};
