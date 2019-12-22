/** @jsx jsx */
import { Styled as s, jsx, useColorMode, Theme } from "theme-ui";
import { Link } from "gatsby";
import React, {
  ElementType,
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
} from "react";
import { keys } from "fp-ts/lib/Record";

import { colorModes } from "../gatsby-plugin-theme-ui";

import { Button, ButtonProps } from "./Button";
import { ColorModes } from "./index";
import { HamburgerLinks } from "./HamburgerLinks";

const MENU_ID = "menu";

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
      opacity: 0.9,
      ":hover": {
        opacity: 1,
      },
    }}
    {...props}
  />
);

interface NextColorModeButtonProps extends ButtonProps {}
const NextColorModeButton = (props: NextColorModeButtonProps) => {
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
      {...props}
    >
      {colorMode}
    </Button>
  );
};

const separator = (
  <div
    sx={{
      color: "muted",
      borderRight: "2px solid currentColor",
      mx: 2,
      "@media (max-width: 40em)": { height: "1em", borderRight: "none" },
    }}
  />
);

type HeaderProps = { showHome?: boolean };
export const Header: React.FC<HeaderProps> = ({ showHome }) => {
  const [colorMode] = useColorMode();

  const hamburgerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      hamburgerRef.current &&
      typeof window !== "undefined" &&
      window.location.hash === "#menu"
    ) {
      const element = hamburgerRef.current.firstElementChild;
      if (element) {
        (element as HTMLElement).click();
      }
    }
  }, []);

  return (
    <header
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        // aligns links with content while preserving big hitboxes
        mx: "-0.5em",
        pb: 3,
      }}
    >
      {showHome && (
        <HeaderLink as={Link} to="/">
          haspar.us
        </HeaderLink>
      )}
      <div sx={{ flex: 1 }} />
      <nav
        id={MENU_ID}
        sx={{
          display: "flex",
          flexDirection: "row",
          "@media (max-width: 40em)": {
            position: "fixed",
            flexDirection: "column",
            bg: "background",
            top: 0,
            left: 0,
            width: "100%",
            transform: "translateY(calc(-100% - 2em))",
            py: 5,
            fontSize: 3,
            borderBottom: (th: Theme) => `1px solid ${th.colors?.gray}`,
            ":target": {
              transform: "translateY(0)",
              transition: "transform 0.8s cubic-bezier(.49,.1,.48,1.3)",
            },
            "> *": {
              padding: "0.25em 1em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        }}
      >
        <HeaderLink
          as={Link}
          to="/"
          sx={{
            "@media (min-width: 40em)": { display: "none" },
          }}
        >
          writing
        </HeaderLink>
        <HeaderLink as={Link} to="/speaking">
          speaking
        </HeaderLink>
        <HeaderLink as={Link} to="/reading">
          reading
        </HeaderLink>
        {separator}
        <HeaderLink href="https://github.com/hasparus">GitHub</HeaderLink>
        <HeaderLink href="https://twitter.com/hasparus">Twitter</HeaderLink>
        {separator}
        <NextColorModeButton />
      </nav>
      <HamburgerLinks
        ref={hamburgerRef}
        menuId={MENU_ID}
        bunColor={colorMode === "dark" ? "gray" : "sandybrown"}
        meatColor={colorMode === "dark" ? "highlight" : "brown"}
        sx={{ "@media (min-width: 40em)": { display: "none" } }}
      />
    </header>
  );
};
