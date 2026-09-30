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
      "Public profile and article index for haspar.us. Read-only, without authentication. Cache reads and back off on HTTP 429; no fixed quota is promised.",
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
  components: {
    schemas: {
      Profile: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "handle",
          "url",
          "description",
          "sameAs",
          "contactUrl",
        ],
        properties: {
          name: { type: "string", description: "Published author name." },
          handle: { type: "string", description: "Public online handle." },
          url: {
            type: "string",
            format: "uri",
            description: "Canonical homepage.",
          },
          description: {
            type: "string",
            description: "Author's software interests.",
          },
          sameAs: {
            type: "array",
            items: { type: "string", format: "uri" },
            description: "Published profiles for identity resolution.",
          },
          contactUrl: {
            type: "string",
            format: "uri",
            description: "Published contact channels.",
          },
        },
      },
      Post: {
        type: "object",
        additionalProperties: false,
        required: [
          "slug",
          "title",
          "description",
          "date",
          "url",
          "markdownUrl",
        ],
        properties: {
          slug: {
            type: "string",
            description:
              "Exact identifier accepted by the MCP read_post tool and CLI read command.",
          },
          title: { type: "string", description: "Article title." },
          description: {
            type: "string",
            description:
              "Article description, or an empty string if none is published.",
          },
          date: {
            type: "string",
            format: "date",
            description: "Publication date.",
          },
          url: {
            type: "string",
            format: "uri",
            description: "Canonical HTML article URL to cite.",
          },
          markdownUrl: {
            type: "string",
            format: "uri",
            description: "Markdown/MDX source export.",
          },
        },
      },
      PostIndex: {
        type: "object",
        additionalProperties: false,
        required: ["posts"],
        properties: {
          posts: {
            type: "array",
            description: "Visible articles, newest first.",
            items: { $ref: "#/components/schemas/Post" },
          },
        },
      },
      Error: {
        type: "object",
        additionalProperties: false,
        required: ["error"],
        properties: {
          error: {
            type: "object",
            additionalProperties: false,
            required: ["code", "message", "hint"],
            properties: {
              code: {
                type: "string",
                description: "Stable machine-readable error code.",
              },
              message: {
                type: "string",
                description: "Explanation of the failure.",
              },
              hint: {
                type: "string",
                description: "How to resolve or investigate the failure.",
              },
            },
          },
        },
      },
    },
  },
};
