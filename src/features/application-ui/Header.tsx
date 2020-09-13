/** @jsx jsx */
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { keys } from "fp-ts/lib/Record";
import { GatsbyLinkProps, Link } from "gatsby";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  Fragment,
  memo,
  useEffect,
  useRef,
} from "react";
import {
  jsx,
  Styled as s,
  Theme,
  ThemeUICSSObject,
  useColorMode,
} from "theme-ui";

import { Button, ButtonProps } from "../../lib/reusable-ui/Button";
import { HamburgerLinks } from "../../lib/reusable-ui/HamburgerLinks";
import {
  ColorModes,
  colorModes,
} from "../../lib/theme-ui-preset-hasparus-homepage/colorModes";
import { pageCtx } from "../pageCtx";

const MENU_ID = "menu";

const headerLinkStyle: ThemeUICSSObject = {
  textTransform: "lowercase",
  px: "0.5em",
  color: "text092",
  ":hover": {
    color: "text",
  },
};

type HeaderStyledLinkProps<As extends ElementType> = { as?: As } & Omit<
  ComponentPropsWithoutRef<typeof s.a> & ComponentPropsWithoutRef<As>,
  "as"
>;
const HeaderLink = <As extends ElementType = "a">(
  props: HeaderStyledLinkProps<As>
) => (
  <s.a
    sx={headerLinkStyle}
    {...(props as Omit<
      ComponentPropsWithoutRef<typeof s.a>,
      "sx" | "css" | "key"
    >)}
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
  const [colorMode, setColorMode] = useColorMode();

  const modes = keys(colorModes);
  const nextColorMode =
    modes[(modes.indexOf(colorMode as ColorModes) + 1) % modes.length];

  return (
    <Button
      variant="clear"
      onClick={e => {
        // iOS safari scrolls a bit down on double tap of this button
        // we'd like to prevent it
        e.preventDefault();

        setColorMode(nextColorMode);
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

const Separator = (props: ComponentProps<"div">) => (
  <div
    sx={{
      color: "muted",
      borderRight: "2px solid currentColor",
      mx: 2,
      "@media (max-width: 40em)": { height: "1em", borderRight: "none" },
    }}
    {...props}
  />
);

// menu open state is in #menu:target to make it work smoothly without js
export const Header = memo(() => {
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
    <Fragment>
      <header
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          // aligns links with content while preserving big hitboxes
          mx: "-0.5em",
          pb: 3,
          fontSize: 1,

          position: "relative",
          zIndex: 1,
          "@media print": {
            display: "none",
          },
        }}
      >
        <HeaderLink as={Link} to="/">
          haspar.us
        </HeaderLink>
        <div sx={{ flex: 1 }} />
        <nav
          ref={navRef}
          id={MENU_ID}
          sx={{
            display: "flex",
            flexDirection: "row",
            "@media screen and (max-width: 40em)": {
              fontWeight: "bold",
              position: "fixed",
              flexDirection: "column",
              bg: "background",
              top: 0,
              left: 0,
              width: "100%",
              transform: "translateY(calc(-100% - 2em))",
              py: 5,
              fontSize: 4,
              borderBottom: (th: Theme) => `1px solid ${th.colors?.gray}`,
              ":target": {
                transform: "translateY(0)",
                transition:
                  "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);",
              },
              "> div, > a, > button": {
                padding: "0.25em 1em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        >
          <HeaderInternalLink to="/writing">writing</HeaderInternalLink>
          <HeaderInternalLink to="/speaking">speaking</HeaderInternalLink>
          <HeaderInternalLink to="/reading">reading</HeaderInternalLink>
          <Separator />
          <HeaderLink href="https://github.com/hasparus">GitHub</HeaderLink>
          <HeaderLink href="https://twitter.com/hasparus">
            Twitter
          </HeaderLink>
          <Separator className="js-only" />
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
      <div
        sx={{
          display: "none",
          [`#${MENU_ID}:target ~ &`]: {
            display: "unset",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "background",
            opacity: 0.5,
          },
        }}
      />
    </Fragment>
  );
});
