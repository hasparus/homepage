/** @jsx jsx */
import { jsx, Styled as s } from "theme-ui";
import { fontSize } from "../gatsby-plugin-theme-ui";

export const Footer = () => (
  <footer
    sx={{
      "> a": { mr: "1rem", color: "text" },
      fontSize: fontSize.small,
      mt: 5,
    }}
  >
    <s.a href="/rss.xml">RSS</s.a>
    <s.a href="/sitemap.xml">Sitemap</s.a>
  </footer>
);
