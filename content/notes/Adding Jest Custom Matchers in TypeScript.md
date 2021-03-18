# Adding Jest Custom Matchers in TypeScript

I needed a Jest custom matcher a few days ago, and I couldn't any article I
could copy-paste it from.
[The docs](https://jestjs.io/docs/expect#expectextendmatchers) are okay, and
they even mention how to use `extend.expect` in TypeScript, but I don't like
their vibe and I think I have some interesting observations which are not
included there.

<BoxedText>
  Dear future me, and other people who land here trying to copy-paste a matcher. [Here's the gist for you.](https://gist.github.com/hasparus/4ebaa17ec5d3d44607f522bcb1cda9fb)
</BoxedText>

I wanted to assert that a long string contains a shorter one, disregarding
all whitespace and formatting. Something like this:

## Por qué?

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
bit.

Firstly, the imports. We could use `expect.extend` without
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

<!-- TODO: The formatting is broken here. -->

```tsx
const noWhitespace = (s: string) => s.replace(/\s/g, "");

const printSubstring = (val: string): string => val.replace(/"|\\/g,
"\\\$&");

const printReceivedStringContainExpectedSubstring = ( received: string,
start: number, length: number // not end ): string => RECEIVED_COLOR( '"' +
printSubstring(received.slice(0, start)) + INVERTED_COLOR(
printSubstring(received.slice(start, start + length)) ) +
printSubstring(received.slice(start + length)) + '"' );

const matchers = { toContainWithoutWhitespace(received: unknown, expected:
unknown) { const matcherName = "toContainWithoutWhitespace"; const isNot =
this.isNot; const options: MatcherHintOptions = { comment: "indexOf", isNot,
promise: this.promise, };

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
      const labelExpected = `Expected ${
        typeof expected === "string" ? "substring" : "value"
      }`;
      const labelReceived = "Received string";
      const printLabel = getLabelPrinter(labelExpected, labelReceived);

      return (
        matcherHint(matcherName, undefined, undefined, options) +
        "\n\n" +
        `${printLabel(labelExpected)}${isNot ? "not " : ""}${printExpected(
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

}, };
```

Now we need to register it.

<!-- TODO: Write something more. -->

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

And add the type of our matcher to Jest's `Matchers` interface.

```tsx
declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      toContainWithoutWhitespace(substring: string): R;
    }
  }
}
```

There's one small problem left — right now we could use this after any
`expect(actual)`, but our implementation throws for anything that's not a
string.

Let's add a simple conditional type to fix it.

```tsx
declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      toContainWithoutWhitespace: T extends string
        ? (substring: string) => R
        : `TYPELEVEL ERROR: Received value must be string`;
    }
  }
}
```

This way, we can always check that `toContainWithoutWhitespace` exists, but
we can call it only when the tested value is a string.

<!-- TODO: Test if diff highlighting works and consider using it in this blog post -->

```ts {diff}
function add(x, y) {
-  return x + x;
+  return x + y;
}
```
