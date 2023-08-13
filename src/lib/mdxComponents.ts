import { Callout } from "../own/Callout";
import { CodesandboxIframe } from "../own/CodesandboxIframe";

import { Blockquote } from "./prose/Blockquote";
import { Code, Pre } from "./prose/code-and-pre";
import { createHeading } from "./prose/Heading";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore // TS ran in CLI doesn't see .astro files
import Image from "./prose/Image.astro";
import { Ol } from "./prose/Ol";
import { Paragraph } from "./prose/Paragraph";
import { Table } from "./prose/Table";
import { Ul } from "./prose/Ul";
import { Link } from "./Link";

// TODO: Move the object also in Zaduma.
export const mdxComponents = {
  a: Link,
  Link,
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
  img: Image,
  Image,
  table: Table,
  Table,
  ul: Ul,
  ol: Ol,
  blockquote: Blockquote,
  Blockquote,
  code: Code,
  pre: Pre,
  // Take note that `mdxComponents` replace only Markdown and uppercased components,
  // not inline lowercased JSX, so using `<p>` in and .mdx file won't use the `Paragraph`.
  p: Paragraph,

  // own
  CodesandboxIframe,
  Callout,
};
