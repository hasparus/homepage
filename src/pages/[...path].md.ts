import type { APIRoute, GetStaticPaths } from "astro";
import { orderedPosts, postMarkdown } from "../build-time/posts";

export const getStaticPaths: GetStaticPaths = () =>
  orderedPosts.map((post) => ({
    params: { path: post.module.frontmatter.path.replace(/^\//, "") },
    props: { markdown: postMarkdown(post) },
  }));

export const GET: APIRoute<{ markdown: string }> = ({ props }) =>
  new Response(props.markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
