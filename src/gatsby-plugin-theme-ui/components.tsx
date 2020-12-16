/** @jsx jsx */
import { Link } from "gatsby";
import { ComponentProps, ComponentPropsWithoutRef } from "react";
import { Box, jsx } from "theme-ui";

import { ReadingList } from "../features/application-ui/ReadingList";
import { TableOfContents } from "../features/blog/TableOfContents";
import {
  BoxedText,
  Button,
  CodesandboxIframe,
  EpistemicNote,
  Footnote,
} from "../lib/reusable-ui";

import { theme } from "./index";
import { fontSize } from "./tokens";

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
};

export default components;
