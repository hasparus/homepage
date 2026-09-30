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

## Verification

```sh
pnpm install --frozen-lockfile
pnpm astro sync
pnpm typecheck
pnpm lint --quiet
pnpm build
pnpm test
```

For endpoint checks, start the preview in a separate terminal:

```sh
pnpm preview:agents
```

Then run:

```sh
pnpm verify:agents
pnpm verify:agents https://your-deployment.vercel.app
```

`preview:agents` runs the middleware and API handlers in front of Astro's static
preview. Astro preview alone doesn't run Vercel middleware or root-level API
functions. Playwright uses this wrapper.

The verifier checks the machine-readable files and every public article URL. It
uses the official MCP client to initialize the server and read each resource. On
hosted deployments it also checks a signed OG image and rejection of a bad
token.

CI runs the local tests and checks hosted endpoints after deploying a preview.
Existing visual snapshots cover article rendering.

## Publishing and indexing

Choose a CLI license and confirm npm scope access before publishing. Add
registry installation instructions once the package is available.

Submit the canonical sitemap in Search Console and Bing Webmaster Tools. Request
indexing for the developer docs, and keep public profile links pointing to
`https://haspar.us/`.
