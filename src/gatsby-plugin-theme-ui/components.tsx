/** @jsx jsx */
import { Link } from "gatsby";
import { ComponentProps, ComponentPropsWithoutRef } from "react";
import { Helmet, HelmetProps } from "react-helmet";
import { Box, jsx } from "theme-ui";

import { ReadingList } from "../features/application-ui/ReadingList";
import { TableOfContents } from "../features/blog/TableOfContents";
import { seoImage } from "../features/seo/Seo";
import {
  BoxedText,
  Button,
  CodesandboxIframe,
  EpistemicNote,
  Footnote,
} from "../lib/reusable-ui";

import { theme } from "./index";
import { fontSize } from "./tokens";

const isApple =
  // It's more convenient to default to "Cmd" on the server, as MacOS does
  // have Ctrl key, but other devices don't have "Cmd", so we minimize total
  // confusion.
  typeof window === "undefined" ||
  /Mac|IPad|IPhone/i.test(navigator.platform);

const components = {
  Epistemic: EpistemicNote,
  CodesandboxIframe,
  ReadingList,
  BoxedText,
  Box,
  Button,
  TableOfContents,
  Footnote,
  FootnoteA: Footnote.A,
  small: (props: ComponentProps<"small">) => (
    <small sx={{ fontSize: fontSize.small }} {...props} />
  ),
  figure: (props: ComponentProps<"figure">) => (
    <figure
      sx={{ margin: 0, "> pre": { mb: 2 }, "> p": { mb: 0 } }}
      {...props}
    />
  ),
  figcaption: (props: ComponentProps<"figcaption">) => (
    <figcaption
      sx={{
        fontSize: fontSize.small,
        fontStyle: "italic",
        px: 3,
        "> p": { margin: 0 },
      }}
      {...props}
    />
  ),
  // gatsby-plugin-catch-links breaks my hamburger :c
  a: (props: ComponentPropsWithoutRef<"a">) => {
    if (
      !props.href ||
      props.href.match(/^(https?|\/\/|#|mailto:|javascript:)/)
    ) {
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a sx={theme.styles.a} {...props} />;
    }
    const { href, ...rest } = props;
    return <Link sx={theme.styles.a} to={href} {...rest} />;
  },
  Kbd: ({
    children,
    ...rest
  }: ComponentPropsWithoutRef<"kbd"> & { children: string }) => {
    if (isApple) {
      children = children.replace("Ctrl", "Cmd");
    }

    return <kbd {...rest}>{children}</kbd>;
  },
  details: (props: ComponentPropsWithoutRef<"details">) => {
    console.log(">>", props);
    return <details sx={theme.styles.details} {...props} />;
  },
  // a workaround to allow using react-helmet from MDX
  Helmet: ({
    imageSrc,
    ...rest
  }: {
    imageSrc: string;
  } & Omit<HelmetProps, "children">) => {
    return <Helmet {...rest}>{seoImage(imageSrc)}</Helmet>;
  },
};

export default components;
