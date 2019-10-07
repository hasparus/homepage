/** @jsx jsx */
import { Styled as s, jsx } from "theme-ui";
import { colorModes } from "../gatsby-plugin-theme-ui";
import { Link } from "gatsby";
import React, { ElementType, ComponentPropsWithoutRef } from "react";

export { theme } from "../gatsby-plugin-theme-ui";

export type ColorModes = keyof typeof colorModes;
export { colorModes };

export const Root = (
  props: Omit<React.ComponentProps<typeof s.root>, "ref">
) => (
  <s.root
    sx={{
      maxWidth: "80ch",
      mx: "auto",
      mt: 3,
      mb: 6,
    }}
    {...props}
  />
);

export const Button = (props: React.ComponentProps<"button">) => (
  <button
    sx={{
      display: "inline",
      padding: 0,
      font: "inherit",
      color: "inherit",
      background: "none",
      outline: "none",
      cursor: "pointer",
      border: "1px solid transparent",
      "&:focus, &:hover": {
        borderColor: "currentColor",
      },
    }}
    {...props}
  />
);

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
      ":not(:last-of-type)": {
        marginRight: "1em",
      },
    }}
    {...props}
  />
);

type HeaderProps = { showHome?: boolean };
export const Header: React.FC<HeaderProps> = ({ showHome }) => (
  <header
    sx={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
    }}
  >
    {showHome && (
      <HeaderLink as={Link} to="/">
        haspar.us
      </HeaderLink>
    )}
    <div sx={{ flex: 1 }} />
    <nav>
      <HeaderLink href="https://github.com/hasparus">GitHub</HeaderLink>
      <HeaderLink href="https://twitter.com/hasparus">Twitter</HeaderLink>
    </nav>
  </header>
);
