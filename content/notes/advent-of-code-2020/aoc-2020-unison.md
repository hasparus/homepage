# AoC 2020 — Getting Started with Unison

I'm starting Advent of Code late, but it's okay. I don't care about the
leaderboard anyway, I just want to learn a few new languages.

My fiancee already completed all puzzles published to this point, and if I
used a conventional language I'd have to try hard to get better asymptotic
time complexity than her to save my male pride.

By using bleeding edge languages, I'm making it hard enough for myself, that
I won't feel the need to compete with her.

Hello Unison. Thank you for your help.

Unison so new that you have to join #alphatesting channel on their Slack to
see the installation instructions.

Unison Codebase Manager is an all-in-one tool for everything Unison. I love
it. The bundling here saves a lot of complexity. I liked that `go fmt` is
built-in and belongs to the language, and I like Rust's `cargo` even more.
This is the way to go in 2020. Imagine there are people who write JavaScript
and don't use Prettier. Scary, huh? Point for you, Unison.

```
.> pull https://github.com/unisonweb/base:.releases._latest base
  Importing downloaded files into local codebase...


  Here's what's changed in base after the merge:

  Added definitions:

    1.    ability Abort (+2 metadata)
    2.    ability Ask a (+2 metadata)
    3.    unique type Author
    4.    builtin type Boolean
    5.    builtin type Bytes
    6.    builtin type Char
```

Nice one.

There's no VSCode Language Server extension for Unison, but it's less
painful than I expected.

I wrote my first bit of Unison...

```u
> List.map (x -> x * 10) [1,2,3,4,5,6]
```

And I immediately saw the result in my terminal.

It's a bit like [Quokka.js](https://quokkajs.com/) for TypeScript, but built
into the language. Sweet. Of course, I'd prefer to see the result right next
to the code, as I write it, but I know they're working on an editor of their
own, so this might be how it looks like in the future.

The lack of autocomplete will be a bit painful. I'll have to read the docs
in the browser of instead of _"querying them_" from the editor.

After a longer [tour of Unison](https://www.unisonweb.org/docs/tour), I
started with the first puzzle — [[Day 1 - Report Repair]].
