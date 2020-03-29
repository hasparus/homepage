/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import { ComponentProps, ComponentPropsWithoutRef } from "react";
import { Link } from "gatsby";

import { fontSize, theme } from "../gatsby-plugin-theme-ui";
import {
  EpistemicNote,
  CodesandboxIframe,
  ReadingList,
  BoxedText,
  Button,
  TableOfContents,
} from "../components";

// eslint-disable-next-line import/no-default-export
export default {
  Epistemic: EpistemicNote,
  CodesandboxIframe,
  ReadingList,
  BoxedText,
  Box,
  Button,
  TableOfContents,
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
