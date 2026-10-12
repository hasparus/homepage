import { z } from "zod";
import {
  errorSchema,
  postSchema,
  postsSchema,
  profileSchema,
} from "./schemas.js";

const registry = z.registry<{ id: string }>();
registry.add(profileSchema, { id: "Profile" });
registry.add(postSchema, { id: "Post" });
registry.add(postsSchema, { id: "PostIndex" });
registry.add(errorSchema, { id: "Error" });
const wireSchemas = z.toJSONSchema(registry, {
  uri: (id) => `#/components/schemas/${id}`,
}).schemas;
for (const schema of Object.values(wireSchemas)) delete schema.$id;

const error = {
  description: "Error details and a hint for the next request.",
  content: {
    "application/json": { schema: { $ref: "#/components/schemas/Error" } },
  },
};
const methodError = {
  ...error,
  headers: {
    Allow: {
      description: "Supported HTTP methods.",
      schema: { type: "string", const: "GET, HEAD" },
    },
  },
};

export const openapi = {
  openapi: "3.1.1",
  info: {
    title: "hasparus public content API",
    version: "1.0.0",
    description:
      "Public profile and article index for haspar.us. Read-only, without authentication.",
    contact: { name: "hasparus", url: "https://haspar.us/contact/" },
  },
  servers: [
    { url: "https://haspar.us", description: "Canonical public website" },
  ],
  security: [],
  externalDocs: {
    description: "hasparus developer documentation and MCP access",
    url: "https://haspar.us/docs/",
  },
  paths: {
    "/api/profile.json": {
      get: {
        operationId: "getHasparusProfile",
        summary: "Read the public author profile",
        description:
          "Read the author's public profile and links. You don't need authentication.",
        responses: {
          "200": {
            description: "Public author profile.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Profile" },
              },
            },
          },
          "404": error,
          "405": methodError,
        },
      },
    },
    "/api/posts.json": {
      get: {
        operationId: "listHasparusPosts",
        summary: "List visible public articles",
        description:
          "List public articles, newest first. Excludes hidden posts and drafts. Follow markdownUrl to read source text, which may contain MDX. You don't need authentication; the index fits in one response.",
        responses: {
          "200": {
            description: "Article index with canonical and Markdown URLs.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostIndex" },
              },
            },
          },
          "404": error,
          "405": methodError,
        },
      },
    },
  },
  components: { schemas: wireSchemas },
};
