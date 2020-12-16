/** @jsx jsx */
import { CSSObject, Global, Interpolation } from "@emotion/react";
import React, { Fragment, useMemo } from "react";
import { Helmet } from "react-helmet";
import {
  css,
  jsx,
  Themed as th,
  ThemeUIStyleObject,
  useThemeUI,
} from "theme-ui";

import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";

import { ColorModeSpecificStyleTweaks } from "./ColorModeSpecificStyleTweaks";

export const focusStyles: ThemeUIStyleObject = {
  "*:focus:not(.focus-visible)": {
    outline: "none",
  },
  ".focus-visible": {
    outlineColor: "secondary",
    outlineStyle: "dashed",
  },
};

const scrollbarStyles: ThemeUIStyleObject = {
  "*": {
    "::-webkit-scrollbar": {
      width: "14px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(var(--scrollbar-color), 0.16)",
      backgroundClip: "padding-box",
      border: "3px solid rgba(var(--scrollbar-color), 0)",
      borderRadius: "100px",
      "&:hover": {
        borderWidth: "2px",
        backgroundColor: "rgba(var(--scrollbar-color), 0.32)",
      },
    },
    "::-webkit-scrollbar-corner": {
      backgroundColor: "rgba(var(--scrollbar-color), 0)",
    },
  },
};

const globalStyles: Interpolation<{}> = {
  html: {
    scrollBehavior: "smooth",
    fontSize: fontSize.base,
    "--scrollbar-color": "0, 0, 0",
  },
  body: {
    margin: 0,
    overflowX: "hidden",
    overflowY: "overlay" as any,
  },
  "@media print": {
    html: {
      fontSize: "17px",
    },
  },
};

export interface RootProps
  extends Omit<React.ComponentProps<typeof th.root>, "ref"> {}

export const Root = (props: RootProps) => {
  const { theme } = useThemeUI();

  const global = useMemo((): CSSObject => {
    return {
      ...globalStyles,
      ...css({ ...scrollbarStyles, ...focusStyles })(theme),
    };
  }, [theme]);

  return (
    <Fragment>
      <Helmet>
        <meta name="theme-color" content={theme.colors!.background} />
      </Helmet>
      <Global styles={global} />
      <ColorModeSpecificStyleTweaks />
      <th.root
        {...props}
        sx={{
          maxWidth: "738px", // ~63ch with Fira Sans 21px
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
