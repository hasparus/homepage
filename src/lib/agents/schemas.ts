import { z } from "zod";

export const profileSchema = z.strictObject({
  name: z.string().describe("Published author name."),
  handle: z.string().describe("Public online handle."),
  url: z.url().describe("Canonical homepage."),
  description: z.string().describe("Author's software interests."),
  sameAs: z
    .array(z.url())
    .describe("Published profiles for identity resolution."),
  contactUrl: z.url().describe("Published contact channels."),
});

export const postSchema = z.strictObject({
  slug: z
    .string()
    .describe(
      "Exact identifier accepted by the MCP read_post tool and CLI read command.",
    ),
  title: z.string().describe("Article title."),
  description: z
    .string()
    .describe("Article description, or an empty string if none is published."),
  date: z.iso.date().describe("Publication date."),
  url: z.url().describe("Canonical HTML article URL to cite."),
  markdownUrl: z.url().describe("Markdown/MDX source export."),
});
export const postsSchema = z.strictObject({
  posts: z.array(postSchema).describe("Visible articles, newest first."),
});
export const errorSchema = z.strictObject({
  error: z.strictObject({
    code: z.string().describe("Stable machine-readable error code."),
    message: z.string().describe("Explanation of the failure."),
    hint: z.string().describe("How to resolve or investigate the failure."),
  }),
});

export type PublicPost = z.infer<typeof postSchema>;
export type PublicProfile = z.infer<typeof profileSchema>;
