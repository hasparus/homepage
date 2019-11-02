/** @jsx jsx */
import { Styled as s, jsx, useColorMode } from "theme-ui";
import { Link } from "gatsby";
import React, { ElementType, ComponentPropsWithoutRef } from "react";
import { keys } from "fp-ts/lib/Record";

import { colorModes } from "../gatsby-plugin-theme-ui";

import { Button } from "./Button";
import { ColorModes } from "./index";

type HeaderLinkProps<As extends ElementType> = { as?: As } & Omit<
  ComponentPropsWithoutRef<typeof s.a> & ComponentPropsWithoutRef<As>,
  "as"
>;
const HeaderLink = <As extends ElementType = "a">(
  props: HeaderLinkProps<As>
) => (
  <s.a
    sx={{
      color: "currentColor",
      textTransform: "lowercase",
      px: "0.5em",
    }}
    {...props}
  />
);

const NextColorModeButton = () => {
  const [colorMode, setColorMode] = useColorMode<ColorModes>();

  return (
    <Button
      variant="clear"
      onClick={() => {
        const modes = keys(colorModes);
        const colorModeIndex = modes.indexOf(colorMode);

        setColorMode(modes[(colorModeIndex + 1) % modes.length]);
      }}
      sx={{
        px: "0.5em",
        ":hover, :focus": {
          bg: "muted",
        },
      }}
      title="change color mode"
    >
      {colorMode}
    </Button>
  );
};

type HeaderProps = { showHome?: boolean };
export const Header: React.FC<HeaderProps> = ({ showHome }) => (
  <header
    sx={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      // aligns links with content while preserving big hitboxes
      mx: "-0.5em",
    }}
  >
    {showHome && (
      <HeaderLink as={Link} to="/">
        haspar.us
      </HeaderLink>
    )}
    <div sx={{ flex: 1 }} />
    <nav sx={{ display: "flex", flexDirection: "row" }}>
      <HeaderLink href="https://github.com/hasparus">GitHub</HeaderLink>
      <HeaderLink href="https://twitter.com/hasparus">Twitter</HeaderLink>
      <NextColorModeButton />
    </nav>
  </header>
);
