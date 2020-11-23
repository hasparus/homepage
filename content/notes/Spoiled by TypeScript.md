TypeScript is a gradually typed programming language. It's based on
JavaScript, and destined for easy migration, so you can statically type the
parts of your code you care about, and leave other, less critical parts,
dynamically typed.

That's the obvious side of gradual typing. I'm more interested in the other
side. With the compiler option `strict: true`, we can write TypeScript which
is entirely statically typed, but the gains from gradual typing don't end
here.

What's unapparent for many who connect _static_ typing with _strong_ typing,
TypeScript often lets you type your code **stronger** than Java, C# or C++,
languages that were statically typed from the beginning. By stronger, I mean
_closer to your intent or business domain_.

Why is it so? Well, that's quite funny if you think about it.

**TypeScript needs to deal with JavaScript's bullshit.**

You know JavaScript. It's expressive, it works everywhere, tons of people of
different backgrounds are using it. It's also quirky. It has some bad parts.

![](../assets/javascript-bad-parts.png)

To create a language allowing to statically type _idiomatic JavaScript_ is a
challenge, because popular JavaScript idioms are seldom possible to express
conveniently in a conventional statically typed language.

Think of accessing a deeply nested value by a dotted path.

```tsx
const x = { a: { b: { c: "banana" } } };

get(x, "a.b.c") === "banana";
```

Typing `get` as `(object, string) -> unknown` is clearly inconvenient. I
want to know that `get(x, 'a.d')` is incorrect without leaving my editor,
and I want to know that `get(x, 'a.b')` is `{ c: string }` or even
`{ c: 'banana'}` .

Why would you need such a weird API if you can just write `x.a.b.c` (or
`x?.a?.b?.c ?? 'default'` to handle missing value)? It's quite convenient
for embedded styling DSLs and similar declarative constructs.

```tsx
<p css={{ color: "primary.500", bgColor: "gray.200" }}>Hello world!</p>
```

[Template literal types](https://github.com/microsoft/TypeScript/pull/40336)
come to the rescue here.

This is of course, not the only interesting case. Have a highly dynamic
function which returned typed differs greatly based on input? Generics are
not sufficient?
[Conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
have got your back.

While its simple type inference, the lack of pattern matching and the lack
of higher kinded types (you can fake them with a hack,
[see `fp-ts`](https://gist.github.com/gcanti/2b455c5008c2e1674ab3e8d5790cdad5))
may discourage typed functional programming enthusiasts, TypeScript has
nothing to be ashamed of when it comes to domain modeling capabilities.

Sum types, product types, mapping over types. TypeScript has got it all, and
it adds a bunch of unique features needed to statically type idiomatic
JavaScript.

This is a language that can spoil you. It certainly spoiled me. Many
languages I use feel... "less powerful" now.

The important question is: do you need such powerful features to build good,
reliable software?

---

There are many [[TypeScript Exercises and Challenges]] to learn these unique
and strange features.
