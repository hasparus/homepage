# Going too far with Jest Custom Matchers in TypeScript

I needed a Jest
[custom matcher](https://jestjs.io/docs/expect#expectextendmatchers) a few
days ago, and I couldn't any article I could copy-paste it from.
[The docs](https://jestjs.io/docs/expect#expectextendmatchers) are okay, and
they even mention how to use `extend.expect` in TypeScript, but I don't like
their vibe and I think I have some observations which are not included
there.

Later down the post I write a lot of unnecessary and overly complex
typelevel code, so if you're a fan of this kind of stuff, bear with me.

<BoxedText>

Dear future me, and other people who land here trying to copy-paste a
matcher.
[Here's the gist for you.](https://gist.github.com/hasparus/4ebaa17ec5d3d44607f522bcb1cda9fb)

</BoxedText>

## Por qué?

I wanted to assert that a long string contains a shorter one, disregarding
all whitespace and formatting. Something like this:

```ts
expect(longString).toContainWithoutWhitespace(shortString);
```

I could write the following

```ts
expect(stripWhitespace(longString)).toContain(stripWhitespace(shortString));
```

but then my tests wouldn't
[read like prose](https://idratherbewriting.com/blog/treat-code-like-code-and-prose-like-prose/)
(lol).

## Here's how we do this

I've stolen `toContain` implementation from Jest's repo and adapted it a
bit. Firstly, the imports. We could use `expect.extend` without
`jest-matcher-utils`, but our matcher would be inferior to built-ins.

```ts
import {
  EXPECTED_COLOR,
  RECEIVED_COLOR,
  INVERTED_COLOR,
  MatcherHintOptions,
  getLabelPrinter,
  matcherErrorMessage,
  matcherHint,
  printExpected,
  printReceived,
  printWithType,
} from "jest-matcher-utils";
```

A bunch of useful stuff, innit?

Here comes the matcher implementation.

```tsx
import type { MatcherState } from "expect";

const matchers = {
  toContainWithoutWhitespace(
    // a matcher is a method, it has access to Jest stuff on `this`
    this: MatcherState,
    // I'm going with `unknown` here, because we should validate the input
    received: unknown,
    // When we extend expect our matcher is effectively added to all expect()
    // results, so we don't have full control of what's passed here
    expected: unknown
  ) {
    const matcherName = "toContainWithoutWhitespace";
    const isNot = this.isNot;
    const options: MatcherHintOptions = {
      comment: "indexOf",
      isNot,
      promise: this.promise,
    };

    // We throw some nice errors to tell people how to use the function
    // This part is entirely stolen from useContain, but it's a great idea :P
    if (typeof received !== "string") {
      throw new Error(
        matcherErrorMessage(
          matcherHint(
            matcherName,
            String(received),
            String(expected),
            options
          ),
          `${RECEIVED_COLOR("received")} value must be a string`,
          printWithType("Expected", expected, printExpected) +
            "\n" +
            printWithType("Received", received, printReceived)
        )
      );
    }

    if (typeof expected !== "string") {
      throw new Error(
        matcherErrorMessage(
          matcherHint(matcherName, received, String(expected), options),
          `${EXPECTED_COLOR("expected")} value must be a string`,
          printWithType("Expected", expected, printExpected) +
            "\n" +
            printWithType("Received", received, printReceived)
        )
      );
    }

    const index = noWhitespace(received).indexOf(noWhitespace(expected));
    const pass = index !== -1;

    const message = () => {
      const labelExpected = "Expected substring";
      const labelReceived = "Received string";
      const printLabel = getLabelPrinter(labelExpected, labelReceived);

      return (
        matcherHint(matcherName, undefined, undefined, options) +
        "\n\n" +
        `${labelExpected} ${isNot ? "not " : ""}${printExpected(
          expected
        )}\n` +
        `${printLabel(labelReceived)}${isNot ? "    " : ""}${
          isNot
            ? printReceivedStringContainExpectedSubstring(
                received,
                index,
                String(expected).length
              )
            : printReceived(received)
        }`
      );
    };

    return { message, pass };
  },
};
```

2 lines of logic we wanted, and a lot of lines of plumbing for better error
messages. It's not all yet. A few small functions we used before:

```tsx
const noWhitespace = (s: string) => s.replace(/\s/g, "");

const printSubstring = (val: string): string =>
  val.replace(/"|\\/g, "\\$&");

const printReceivedStringContainExpectedSubstring = (
  received: string,
  start: number,
  length: number
): string =>
  RECEIVED_COLOR(
    '"' +
      printSubstring(received.slice(0, start)) +
      INVERTED_COLOR(
        printSubstring(received.slice(start, start + length))
      ) +
      printSubstring(received.slice(start + length)) +
      '"'
  );
```

Now we need to register it.

```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jestExpect = (global as any).expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  console.error(
    "Unable to find Jest's global expect." +
      "\nPlease check you have added jest-extended correctly to your jest configuration." +
      "\nSee https://github.com/jest-community/jest-extended#setup for help."
  );
}
```

Tada! We can now use our matcher 🎉 There's a small problem though.
TypeScript doesn't know about it, so our tests are all red and fiery.

We arrived to the fun stuff. Let's add the type of our matcher to Jest's
`Matchers` interface.

```tsx
// Hey TypeScript, let's go to global scope
declare global {
  // Where `jest` namespace is already defined
  namespace jest {
    // And enter `jest` namespace
    // Hey TS, remember the Matchers interface that was already defined here?
    interface Matchers<R> {
      // This interface contains one more method now! Cool, huh?
      toContainWithoutWhitespace(substring: string): R;
    }
  }
}
```

You can read more on
[merging interfaces](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces),
[merging namespaces](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-namespaces),
and
[global augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation)
in TypeScript docs.

There's one small problem left — right now we could use this after any
`expect(actual)`, but our implementation throws for anything that's not a
string.

Let's add a simple conditional type to fix it. In tests written in
TypeScript, we'll prevent from using our matcher if the argument passed to
`expect` is not a string.

Fortunately, `Matchers` interface provides us with _T_ parameter with the
type of value given to `expect`.

```tsx
declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      toContainWithoutWhitespace: T extends string
        ? (substring: string) => R
        : "Type-level Error: Received value must be string";
    }
  }
}
```

This way, we can always check that `toContainWithoutWhitespace` exists, but
we can call it only when the tested value (the _T_ we get from Jest's types)
is a string.

<BoxedText>

This typelevel `X extends Y ? A : B` is a
[conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html).
You can read `extends` as _is assignable to_ and then it works like usual
[inline if](https://en.wikipedia.org/wiki/%3F:).

</BoxedText>

Our implementation uses `unknown` and validates its arguments so we're
covered from both sides.

Okay, but what if I have a _production codebase_, an a ton of custom
matchers — imagine a big number like ℵ<sub>0</sub> or 8?

## Going too far with types

( ͡° ͜ʖ ͡°)

Insted of writing signatures of our matchers to add them to `Matchers`
interface, we can compute them from the implementation!

```tsx
/// <reference types="@types/jest" />
import type { MatcherState } from "expect";

const matchers = {
  toHaveWordsCount(
    this: MatcherState,
    sentence: string,
    wordsCount: number
  ) {
    // implementation redacted
  },
};
```

Okay, what information do we have here?

- The function name is important, obviously.
- We're not interested in `this: MatcherState`.
- `sentence` is passed to `expect`, and we want `toHaveWordsCount` to appear
  **only if** the sentence is a string.
- `wordsCount: number` will be the only argument of the function we're
  trying to derive.

So what do we need?

Certainly, we need something extract function arguments. — `Parameters` is a
built-in.

```ts
// type _Step1 = [sentence: string, wordsCount: number]
type _Step1 = Parameters<typeof matchers.toHaveWordsCount>;
```

We need something to get rid of that `sentence`. We could have more
arguments, so we're not interested in picking the second one, but in
skipping the first. A function which does it is usually called _tail_.

```ts
type Tail<T extends unknown[]> = T extends [infer _Head, ...infer Tail]
  ? Tail
  : never;

// type _Step2 = [wordsCount: number]
type _Step2 = Tail<_Step1>;
```

We can combine it into something like this.

```ts
// type _Step3 = { toHaveWordsCount: (wordsCount: number) => void; }
type _Step3 = {
  toHaveWordsCount: (
    ...args: Tail<Parameters<typeof matchers.toHaveWordsCount>>
  ) => void;
};
```

We'll have to
[map over](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
`typeof matchers` instead of listing its properties one by one.

```ts
type OurMatchers = typeof matchers;

// type _Step4 = { toHaveWordsCount: (wordsCount: number) => void; }
type _Step4 = {
  [P in keyof OurMatchers]: (
    ...args: Tail<Parameters<OurMatchers[P]>>
  ) => void;
};
```

And turn it into a generic type parametrized by the type of our matchers
implementation.

```ts
type GetMatchersType<TMatchers> = {
  [P in keyof TMatchers]: (...args: Tail<Parameters<TMatchers[P]>>) => void;
};
```

Okay, this doesn't quite work yet — we've got an error.

> Type `TMatchers[P]` does not satisfy the constraint
> `(...args: any) => any`.

`Parameters` is defined like this:

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

Noticed this generic constraint? We can't use `Parameters` on something that
isn't a function. Of course!

```ts
type AnyFunction = (...args: any) => any;

type GetMatchersType<TMatchers> = {
  // for each property in TMatchers
  [P in keyof TMatchers]: TMatchers[P] extends AnyFunction
    ? // if it's a function we transform it like we wanted
      (...args: Tail<Parameters<TMatchers[P]>>) => void
    : // if it's not a function, we have no beef with it — we pass it further
      TMatchers[P];
};
```

We're almost done. but do you remember that _R_ parameter `Matchers`
interface had? It holds the return type of the matcher. If I'm not wrong it
has something to do with Jest's `.resolves` and
[`.rejects`](https://jestjs.io/docs/tutorial-async#rejects) which turn the
result of matchers after them into a promise. For our use case, let's just
play nice and pass it along because all the builtin matchers do.

```ts
interface Matchers<R, T = {}>
  toBeDefined(): R;
  toBeFalsy(): R;
  toBeGreaterThan(expected: number | bigint): R;
  // ...redacted for brevity
}
```

See?

Here goes our final `GetMatchersType`.

```ts
type GetMatchersType<TMatchers, TResult> = {
  [P in keyof TMatchers]: TMatchers[P] extends AnyFunction
    ? (...args: Tail<Parameters<TMatchers[P]>>) => TResult
    : TMatchers[P];
};
```

The only thing left to do is ensuring that `toHaveWordsCount` appears only
if the value given to `expect` is a string.

```ts
type FirstParam<T extends AnyFunction> = Parameters<T>[0]

type OnlyMethodsWhereFirstArgIsOfType<
  TObject,
  TWantedFirstArg
> = {
    [P in keyof TObject]: TObject[P] extends AnyFunction
      ? TWantedFirstArg extends FirstParam<TObject[P]>
        ? TObject[P]
        : [`Type-level Error: this function is present only when received is:`, FirstParam<TObject[P]>]
      : TObject[P]
}
```

Let's try it out:

```ts
type OurMatchers = {
  toHaveWordsCount(sentence: string, wordsCount: number): void;
  toBeGreaterThan(actual: number | bigint, expected: number | bigint): void;
};

// type _Step6 = {
//   toHaveWordsCount: ["Type-level: this function is present only when received is:", string];
//   toBeGreaterThan: (actual: number | bigint, expected: number | bigint) => void;
// }
type _Step6 = OnlyMethodsWhereFirstArgIsOfType<OurMatchers, number>;
```

I went with that _fake type-level error_ because it carries more information
than `never`. There is a
[nice draft PR](https://github.com/microsoft/TypeScript/pull/40468) to
TypeScript repo implementing throw-types, but faking it with strings and
arrays is the best of what we have today.

Here's how it looks like in practice.

```ts
// 🔥 This expression is not callable.
//      Type '["Error: this function is present only when received is:", string]' has no call signatures.(2349)
_step6.toHaveWordsCount(2);
```

A bit messy, right? I'll argue it's still better than `never`.

Going back to Jest, we're ready to merge into `jest.Matchers` and use our
new matchers!

```ts
declare global {
  namespace jest {
    interface Matchers<R, T = {}>
      extends GetMatchersType<
        OnlyMethodsWhereFirstArgIsOfType<typeof matchers, T>,
        R
      > {}
  }
}

// ✅
expect("foo bar").toHaveWordsCount(2);

// 🔥 error as expected
expect(20).toHaveWordsCount(2);
```

Have a play with it in
[**TypeScript Playground**](https://tsplay.dev/mq8eYN).

Let me know if you liked this post. Thanks for reading!
