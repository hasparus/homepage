<BoxedText>

TLDR: Using a set of documentation components written in your framework of
choice rendered inside of your app on _/docs_ page may be an interesting
alternative for Storybook. I started using this approach in my last few
projects, and I'm pretty happy with it.

[See my documentation components on CodeSandbox.][sandbox]

</BoxedText>

[sandbox]:
  https://codesandbox.io/s/documentation-components-example-dm1vl?file=/pages/index.tsx

## The Problem

The main problem I have with Storybook is that it's _another set of config
files to maintain_. What's worse — there's a Webpack config hidden inside!
Ouch.

Don't get me wrong! I quite like Storybook, but I'd put it in "tooling that
sometimes breaks and needs to be maintained" category. It's a huge tool. It
has tons of awesome features — a huge surface, a multiplicity of choices.

But do you really need it when you're trying to launch an app?

## Storybook and Libraries

Where Storybook shines the brightest is libraries. You can presume that most
frontend folk are familiar with Storybook or will be able to pick it up
fast. It's so popular we could probably call it a standard for component
examples.

It's as easy to contribute a story as it is to write a piece of markdown for
the docs. Thanks to its popularity, Storybook lowers the burden put on
library maintainers.

## Alternative Approach

However, you can do without Storybook! I've found myself reaching for a
smaller alternative in new projects.

Here's the gist — Documentation catalogue / components workshop software has
a few main parts:

1. File-system router which grabs your files and turns them into pages
2. UI to render examples
3. Development server which refreshes your examples when you change the code
4. Some search functionality for navigation

Let's address search — If I'm early enough in the project to be worried
about Storybook config maintenance cost slowing me down, I probably don't
have enough components to warrant search anyway. <Kbd>Ctrl+F</Kbd> will be
enough.

Thing is, in most cases I already have file-system routing and a nice
dev-server with React Fast Refresh support. I don't need to maintain another
webpack config to give me the same experience I already have while
developing my app.

<details>
<summary>
  Historical Context: In the past Storybook was awesome, because the ecosystem was worse.
</summary>

A lifetime ago, I used to work on a sizeable legacy codebase and wait for 4
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

</details>

In 2021, thanks to wide-spread file-system routing and fast development
servers, we can easily create a `/docs` page or a few of them.

So we're down to _"UI to render examples"_. I have a [CodeSandbox with React
components][sandbox] I'm using for docs in one of my projects.

By focusing on documentation UI and forgetting about routing, search and
dev-servers, we reduced complexity enough that copying these components
between projects and maintaining them isn't a burden.

Obviously, this idea has trade-offs that we need to consider.

- Storybook supports 12 component frameworks, but I just need one at a time.
- I lose access to a huge plugin ecosystem, but I want to go _smaller_ and
  remove everything we don't desperately need.
- And the most serious problem — I will definitely not handle all corner
  cases at first, so I'll need to revisit the code and expand it as I use
  it. We're not free from maintenance. Question is — Is maintaining a set of
  _programmable_ components in your language/framework of choice easier than
  maintaining a bunch of config files?
