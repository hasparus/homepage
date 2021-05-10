<BoxedText>

TLDR: A set of documentation components in your framework of choice rendered
inside of your app on /docs page.

</BoxedText>

The main problem I have with Storybook is that it's _another set of config
files to maintain_. What's worse — there's a Webpack config hidden inside!
Ouch.

Don't get me wrong! I quite like Storybook, but I'd put it in "tooling that
sometimes breaks and needs to be maintained" category. It's a huge tool. It
has tons of awesome features — a huge surface, multiplicity of choices.

But do you really need it when you're trying to launch an app?

Where Storybook shines the brightest is libraries. You can presume that most
frontend folk are familiar with Storybook or will be able to pick it up
fast. It's so popular we could probably call it a standard for component
examples.

It's as easy to contribute a story as it is to write a piece of markdown for
the docs. Thanks to its popularity, Storybook lowers the burden put on
library maintainers.

However, you can do without Storybook! I've found myself reaching for a
smaller alternative in new projects.

Here's the gist — Documentation catalogue / components workshop software has
a few main parts:

1. File-system router which grabs your files and turns them into pages
2. UI to render examples
3. Devserver which refreshes your examples when you change the code
4. Some search functionality for navigation

Let's address search — If I'm early enough in the project to be worried
about Storybook config maintenance cost slowing me down, I probably don't
have enough components to warrant search anyway. <Kbd>Ctrl+F</Kbd> will be
enough.

Thing is, in most cases I already have file-system routing and a nice
dev-server with React Fast Refresh support. I don't need to maintain another
webpack config to give me the same experience I already have while
developing my app.

<!-- should I even write this? wrap it in <details>? -->

Story time! Storybook used to provide me with a better working environment
than the dev-server in the app I was working on.

A lifetime ago, I used to work on a sizeable legacy codebase and wait for 3
seconds or more for the app to reload. Then I had to and reproduce the state
I was in if it wasn't possible to hardcode it. — Storybook's stories solve
this problem elegantly.

Until we eventually migrated from [Brunch](https://brunch.io/) to Webpack
and configured `react-hot-loader`, Storybook was my safe haven for
UI-focused tasks, and thanks to it a migration from jQuery to React went
like a breeze.

Months later, when our SPA grew even more, and Flow compilation times got
slow, Storybook was a huge help in onboarding new engineers in the team and
getting them started quickly.

<!-- back to the main post -->

However, in 2021, thanks to wide-spread file-system routing and fast
development servers we can easily create a `/docs` page or a few of them.

So we're down to _UI to render examples_. I have a [CodeSandbox with React
components][codesandbox] I'm using for docs in one of my projects.

[codesandbox]: https://example.com

<!-- TODO: Create the CodeSandbox -->

Obviously, this idea has trade-offs that we need to consider.

- Storybook supports 12 component frameworks, but I just need one at a time.
- I lose access to a huge plugin ecosystem, but I want to go _smaller_ and
  remove everything we don't desperately need.
- And the most serious problem — I will definitely not handle all corner
  cases at first, so I'll need to revisit the code and expand it as I use
  it. We're not free from maintenance. Question is — Is maintaining a set of
  _programmable_ components in your language/framework of choice easier than
  maintaining a bunch of config files?
