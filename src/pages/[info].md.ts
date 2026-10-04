import type { APIRoute, InferGetStaticPropsType } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import solidRenderer from "@astrojs/solid-js/server.js";
import mdxRenderer from "@astrojs/mdx/server.js";
import TurndownService from "turndown";
import { parseHTML } from "linkedom";
import { AUTHOR } from "../lib/siteMeta";

import { pages } from "../build-time/pages";

export function getStaticPaths() {
  return pages.map(({ slug, document, metadata }) => ({
    params: { info: slug },
    props: { document, metadata },
  }));
}

export const GET: APIRoute<
  InferGetStaticPropsType<typeof getStaticPaths>
> = async ({ props }) => {
  const container = await AstroContainer.create();
  container.addServerRenderer({
    name: "@astrojs/solid-js",
    renderer: solidRenderer,
  });
  container.addServerRenderer({ name: "@astrojs/mdx", renderer: mdxRenderer });
  const html = await container.renderToString(props.document.Content);
  const { document } = parseHTML(html);
  for (const link of document.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href")!;
    if (href.startsWith("#") || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
    link.setAttribute("href", new URL(href, AUTHOR.url).href);
  }
  const markdown = new TurndownService({ headingStyle: "atx" }).turndown(
    document,
  );
  return new Response(`# ${props.metadata.title}\n\n${markdown}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
