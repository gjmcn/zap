## Compatibility

---

The compiled JavaScript is automatically wrapped in an IIFE and runs in strict mode.

Almost all JavaScript features used by Zap are supported by recent versions of browsers and Node.js. Features most likely to be unsupported are:

* Rest syntax in [destructuring assignments](?Assignment#destructuring) (`#=`, `@=`) &mdash; [JavaScript docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

* Nullish coalescing (`??`), conditional assignment (`?=`) and assignment from option (`=:`) use [JavaScript's nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator).

* Conditional get property (`?:`) and conditional call method (`?|`) use [JavaScript's optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

Where appropriate, transpile JavaScript with e.g. [Babel](https://babeljs.io/) to ensure compatibility with the target environment(s).