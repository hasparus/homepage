# hasparus CLI

Read the public profile and articles at [haspar.us](https://haspar.us). The CLI
is read-only and has no dependencies. You don't need authentication to use it.

The npm package isn't published yet. Run it from a repository checkout with
Node.js 22 or newer:

```sh
node packages/cli/bin/hasparus.mjs profile
node packages/cli/bin/hasparus.mjs posts
node packages/cli/bin/hasparus.mjs read refinement-types
```

`profile` and `posts` print JSON. `read` prints the article's Markdown/MDX
source, which may contain imports or components. Use the HTML article to see
interactive examples.

Requests time out after 15 seconds. The CLI accepts only slugs from the public
index and cannot change the site. Exit codes: `0` for success, `1` for a network
or content error, `2` for invalid arguments.

## Release

Before publishing, choose an npm license and confirm ownership of the
`@hasparus` scope. Run the site and CLI tests. An npm maintainer can then run
`npm publish` from this directory with the required npm authentication/2FA. Once
it's published, add the registry package and installation command to the site
docs.
