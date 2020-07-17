## Use {#use}

---

##### Install

<pre><code>npm install --save '@gjmcn/zap'</code></pre>

##### Load

* CommonJS:

  <pre><code>const zap = require('@gjmcn/zap');</code></pre>

* ES module:

  <pre><code>import zap from '@gjmcn/zap';</code></pre>

* UMD: `dist/zap.umd.js`. This can be loaded with a `<script>` tag and will create a global `zap` function.

The exported `zap` function compiles a string of Zap code to JavaScript. The optional second argument of `zap` is an options object that specifies which properties to include in the returned object:

| Property     | Default | Description |
| -------------|---------|-------------|
| `js`         | `true`  | JavaScript code |
| `sourceMap`  | `false` | source map | 
| `tokens`     | `false` | tokens produced by the lexer |
| `procTokens` | `false` | tokens after processing blocks |
| `jsTree`     | `false` | JavaScript tree produced by the parser {.table .table-sm .w600}|

When `sourceMap` is `true`, add a `sourceFile` option giving the path to the source file.

The options object can also have an `iife` property that specifies whether the generated JavaScript should be wrapped in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). This property can be `'sync'` (synchronous IIFE, the default), `'async'` (asynchronous IIFE) or `'none'` (no IIFE). Wrapper IIFEs use [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). 

Zap code compiles to modern JavaScript. Where appropriate, use a transpiler such as [Babel](https://babeljs.io/) to ensure compatibility with the target environment(s).

#### Command Line {#command-line}

> The command line app and the REPL are currently very basic with limited functionality.

Zap can be installed as a command line app:

<pre><code>npm install -g @gjmcn/zap</code></pre>

Use `zap` with no arguments to start an interactive Zap REPL:

<pre><code>zap</code></pre>

Pass a file path to compile a file. For example, to compile the file `index.za` to `index.js` (in the same directory):

<pre><code>zap index.za</code></pre>

Use:

<pre><code>zap --help</code></pre>

to print the command-line options:

| Short | Long            | Behavior |
|-------|-----------------|----------|
| `-a`  | `--all`         | Compile all `.za` files in directory to `.js` files |
| `-c`  | `--compile`     | Compile `.za` file to `.js` file of same name |
| `-e`  | `--eval`        | Evaluate a string from the command line |
| `-h`  | `--help`        | Print help |
| `-i`  | `--interactive` | Run an interactive Zap REPL |
| `-m`  | `--map`         | Generate source map(s), save as `.js.map` file(s) |
| `-n`  | `--nodes`       | Print the JavaScript tree produced by the parser |
| `-p`  | `--print`       | Print the generated JavaScript |
| `-t`  | `--tokens`      | Print the tokens produced by the lexer |
| `-r`  | `--proc`        | Print the tokens after processing the blocks |
| `-v`  | `--version`     | Print version number {.table .table-sm .w600} |

Additional information:

* `--all` and `--compile` overwrite existing `.js` files.

* `--map` overwrites existing `.js.map` files. If `--all` or `--compile` are used without `--map`, existing `.js.map` files (that correspond to the `.za` files being compiled) are deleted.

* `--all` is recursive &mdash; `.za` files in subdirectories are compiled.

* `--eval`, `--help`, `--interactive` and `--version` cannot be combined with other options.

* `--map` is the only option that can be combined with `--all`.

* `--compile`, `--map`, `--nodes`, `--print`, `--tokens` and `--proc` can be combined.

* All file actions are synchronous.

#### Code Editors

##### [VS Code](https://code.visualstudio.com/)

Use the [Zap Highlight](https://github.com/gjmcn/zap-highlight-vscode) extension for syntax highlighting. Given the flexibility of operator positioning in Zap, and that only operators 'do things' (functions are called with operators and there are no keywords), a theme that highlights operators differently to all other language elements can help readability. The included _Solarized Dark_ theme and the _One Dark Pro_ extension theme are good examples of this.