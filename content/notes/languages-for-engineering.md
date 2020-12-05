# Languages for Engineering, not for Coding

There are two kinds of programming languages.

**Languages for Coding** are like C, Python, and JavaScript.

A human writes code.

Then the language tooling comes in. The code is then compiled, ahead of time
or Just in Time, or maybe it's not compiled but interpreted instead. Then
it's executed. End of story.

Why did the human write the code? Is it the code that the human wanted to
write? How is the code documented?

I don't think coding is enough, and modern languages don't stop on this.

Take a look at TypeScript which AST has nodes for JSDoc comments.

![](https://user-images.githubusercontent.com/15332326/101243732-7e199480-3702-11eb-9d7e-d25e44e75817.png)

TypeScript cares about your comments because they need to appear in
tooltips.

Even more modern, Unison goes a few steps forwards and treats documentation
as first-class value in the language and documents it in the
[language reference](https://www.unisonweb.org/docs/language-reference/#documentation-literals).
Test tooling is also a builtin there.
