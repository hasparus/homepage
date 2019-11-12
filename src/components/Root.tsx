/** @jsx jsx */
import { jsx, Styled as s, useThemeUI } from "theme-ui";
import React, { Fragment } from "react";
import { Helmet } from "react-helmet";

export const Root = (
  props: Omit<React.ComponentProps<typeof s.root>, "ref">
) => {
  const { theme } = useThemeUI();
  return (
    <Fragment>
      <Helmet>
        <meta name="theme-color" content={theme.colors!.background} />
      </Helmet>
      <s.root
        sx={{
          // this is about "80ch" but I'd like to avoid layout jumping on font load,
          maxWidth: "824px",
          mx: "auto",
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
