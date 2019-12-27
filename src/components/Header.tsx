/** @jsx jsx */
import { Styled as s, jsx, useColorMode, Theme } from "theme-ui";
import { Link, GatsbyLinkProps } from "gatsby";
import {
  ElementType,
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  memo,
} from "react";
import { keys } from "fp-ts/lib/Record";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { colorModes } from "../gatsby-plugin-theme-ui";

import { Button, ButtonProps } from "./Button";
import { ColorModes } from "./index";
import { HamburgerLinks } from "./HamburgerLinks";
import { pageCtx } from "./pageCtx";

const MENU_ID = "menu";

type HeaderStyledLinkProps<As extends ElementType> = { as?: As } & Omit<
  ComponentPropsWithoutRef<typeof s.a> & ComponentPropsWithoutRef<As>,
  "as"
>;
const HeaderLink = <As extends ElementType = "a">(
  props: HeaderStyledLinkProps<As>
) => (
  <s.a
    sx={{
      textTransform: "lowercase",
      px: "0.5em",
      color: "text092",
      ":hover": {
        color: "text",
      },
    }}
    {...props}
  />
);

const HeaderInternalLink = (props: GatsbyLinkProps<any>) => {
  const { location } = pageCtx.useContext();

  // Gatsby Link to the current pathname doesn't change targetted id
  if (location.pathname === props.to) {
    const { to: _, ...newProps } = props;
    return <HeaderLink {...newProps} href="#" />;
  }

  return <HeaderLink as={Link} {...props} />;
};

interface NextColorModeButtonProps extends ButtonProps {}
const NextColorModeButton = (props: NextColorModeButtonProps) => {
  const [colorMode, setColorMode] = useColorMode<ColorModes>();

  return (
    <Button
      variant="clear"
      onClick={e => {
        // iOS safari scrolls a bit down on double tap of this button
        // we'd like to prevent it
        e.preventDefault();

        const modes = keys(colorModes);
        const colorModeIndex = modes.indexOf(colorMode);

        setColorMode(modes[(colorModeIndex + 1) % modes.length]);
      }}
      sx={{
        px: "0.5em",
        color: "text092",
        ":hover, :focus": {
          bg: "muted",
          color: "text",
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

// menu open state is in #menu:target to make it work smoothly without js
export const Header = memo(({ showHome }: HeaderProps) => {
  const [colorMode] = useColorMode();
  const { location } = pageCtx.useContext();
  const navRef = useRef<HTMLElement>(null);

  const hamburgerRef = useRef<HTMLDivElement>(null);
  // if we enter the page with #menu in URL,
  // we'd like to open the menu
  useEffect(() => {
    if (
      hamburgerRef.current &&
      typeof window !== "undefined" &&
      window.location.hash === `#${MENU_ID}`
    ) {
      const element = hamburgerRef.current.firstElementChild;
      if (element) {
        (element as HTMLElement).click();
      }
    }
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (location.hash === `#${MENU_ID}` && navRef.current) {
      const el = navRef.current;
      disableBodyScroll(el);
      window.scrollTo({ top: 0 });
      return () => enableBodyScroll(el);
    }
  });

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
        ref={navRef}
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
              transition:
                "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);",
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
        <HeaderInternalLink
          to="/"
          sx={{
            "@media (min-width: 40em)": { display: "none" },
          }}
        >
          writing
        </HeaderInternalLink>
        <HeaderInternalLink to="/speaking">speaking</HeaderInternalLink>
        <HeaderInternalLink to="/reading">reading</HeaderInternalLink>
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
});
