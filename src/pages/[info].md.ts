import type { APIRoute, InferGetStaticPropsType } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import solidRenderer from "@astrojs/solid-js/server.js";
import mdxRenderer from "@astrojs/mdx/server.js";
import TurndownService from "turndown";

import { pages } from "../build-time/pages";

export function getStaticPaths() {
  return pages.map(({ slug, document }) => ({
    params: { info: slug },
    props: { document },
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
  const markdown = new TurndownService({ headingStyle: "atx" }).turndown(html);
  return new Response(
    `# ${props.document.frontmatter.title}\n\n${markdown}\n`,
    {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    },
  );
};
