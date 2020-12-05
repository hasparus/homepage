/** @jsx jsx */
import { jsx, Themed as th } from "theme-ui";

import { fontSize } from "../../gatsby-plugin-theme-ui/tokens";

export const Footer = () => (
  <footer
    sx={{
      fontSize: fontSize.small,
      mt: 5,
      "> a": {
        p: "0.5em",
        mx: "-0.5em",
        mr: "1rem",
        color: "text",
        textDecorationColor: "transparent",
      },
      "@media print": {
        display: "none",
      },
    }}
  >
    <th.a href="/rss.xml">RSS</th.a>
    <th.a href="/sitemap.xml">Sitemap</th.a>
  </footer>
);
