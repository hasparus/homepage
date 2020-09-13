/** @jsx jsx */
import { Link } from "gatsby";
import { ComponentProps, ComponentPropsWithoutRef } from "react";
import { Box, jsx } from "theme-ui";

import { TableOfContents } from "../features/blog/TableOfContents";
import {
  BoxedText,
  Button,
  CodesandboxIframe,
  EpistemicNote,
  Footnote,
  ReadingList,
} from "../lib/reusable-ui";
import { theme } from "./index";
import { fontSize } from "./tokens";

// eslint-disable-next-line import/no-default-export
export default {
  Epistemic: EpistemicNote,
  CodesandboxIframe,
  ReadingList,
  BoxedText,
  Box,
  Button,
  TableOfContents,
  Footnote,
  small: (props: ComponentProps<"small">) => (
    <small sx={{ fontSize: fontSize.small }} {...props} />
  ),
  figure: (props: ComponentProps<"figure">) => (
    <figure sx={{ margin: 0, "> pre": { mb: 2 } }} {...props} />
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
    console.log('components.a', theme)
    
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
