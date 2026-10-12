# Agent access

haspar.us is a static Astro site. Vercel middleware handles Markdown
negotiation; the MCP server runs in a Node function with the official SDK.

## Interfaces

- Send `Accept: text/markdown` to `/` or a public article for Markdown. Use
  `Accept: text/html` for HTML. Negotiated responses include `Vary: Accept`.
- Missing URLs requested as Markdown return HTTP 404 with an explanation and a
  link to `/llms.txt`.
- `/openapi.json` describes `GET /api/profile.json` and `GET /api/posts.json`.
  Both are public and read-only. API errors contain `code`, `message`, and
  `hint`; unsupported methods return HTTP 405 with `Allow: GET, HEAD`.
- Connect MCP clients to `/mcp` using Streamable HTTP. Send
  `Accept: application/json, text/event-stream` and
  `Content-Type: application/json`. Initialize the client before reading
  resources or calling tools.
- MCP exposes four resources and the `list_posts` / `read_post` tools. It uses
  stateless JSON responses and has no GET SSE stream; GET returns HTTP 405.
- `/llms.txt` explains when to use the site and links to the developer
  interfaces. `/.well-known/api-catalog` follows the RFC 9727 linkset format.
- `/about/`, `/contact/`, and `/privacy/` provide site background and contact
  information.
- `packages/cli` contains the CLI. Its README covers checkout usage and npm
  releases.

Article Markdown exports contain MDX source and may include imports or
components. Use the HTML page to see interactive examples. Hidden articles and
production drafts stay out of the public index and MCP tools.

The site pages and developer docs are authored in `src/content/pages/*.mdx`.
Their Markdown exports render the same documents with Astro and convert the
content to Markdown, including shared components such as the author bio. MCP
reads the published `/docs.md`; it doesn't keep another copy of the prose.

## Verification

```sh
pnpm install --frozen-lockfile
pnpm astro sync
pnpm typecheck
pnpm lint --quiet
pnpm build
pnpm test
```

The local tests use Astro's static preview for page rendering, visual snapshots,
and isolated unit tests. Astro preview doesn't run Vercel middleware or
root-level API functions.

After deploying a Vercel preview, run the protocol suite against that
deployment:

```sh
pnpm verify:agents https://your-deployment.vercel.app
```

This command runs `e2e/agent-protocols.spec.ts` with the deployment as its base
URL. It checks negotiated content, machine-readable files, every public article,
MCP resources and tools, and signed OG images. CI uses the same suite after
preview and production deployments, before recording success. Production also
verifies the advertised public hostname. There is no local replacement for
Vercel routing or header configuration.

Remote-image fetch and decoding errors fail the build, including images marked
raw. Repair the asset rather than masking the failure with a placeholder.

## Publishing and indexing

Choose a CLI license and confirm npm scope access before publishing. Add
registry installation instructions once the package is available.

Submit the canonical sitemap in Search Console and Bing Webmaster Tools. Request
indexing for the developer docs, and keep public profile links pointing to
`https://haspar.us/`.
