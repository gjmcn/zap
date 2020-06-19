## Import and Export

---

The following rules apply to import and export operators:

* Can only be used at the 'top-level' &mdash; not inside parentheses, indented blocks or bracket functions.

* The first operand of import operators is the module path/url which must be a string literal. All other operands of import and export operators must be [identifiers](?Syntax#identifiers). 

* Return `undefined`.

While not necessary, we typically use import and export operators at the start of a file:

```
import '/modules/a.js' f1 f2
import '/modules/b.js' g
export h1 h2

h1 = [a \f1 \g]
h2 = [a \f2 \g]
```

> Do not assign to imports. Assignment operators that create [local variables](?Assignment#local-variables) will create a new variable that masks the import. Assignment operators that update variables (e.g. [`+=`](?Assignment#update-assignment)) will throw an error since imports are constants.

---

#### `export` {#export}

Export variables:

```
export add subtract

add = [a + b]
subtract = [a - b]
```

`export` can only be used once per file.

---

#### `import` {#import}

Use `import` with one operand to import a module for side effects only:

```
import '/modules/do-something.js'
```

Use additional operands for named imports:

```
import '/modules/arithmetic.js' add subtract
// use add and subtract here
```

---

#### `importAs` {#import-as}

Rename imports. Operands are passed as _importName_ _newName_ pairs:

```
importAs '/modules/arithmetic.js'
| add plus
| subtract takeaway
// use plus and takeaway here
```

---

#### `importAll` {#import-all}

Import all of a module's exports as an object:

```
importAll '/modules/arithmetic.js' arith
// use  arith :add  and  arith :subtract  here
```

---

#### `importDefault` {#import-default}

Import default export.

Zap does not use default exports, but many JavaScript modules do:

```
importDefault '/modules/my-js-module.js' theDefault
// use theDefault here
```

---

#### `load` {#load}

Dynamically import a module.

`load` is not subject to the restrictions that apply to other import operators: `load` can be used anywhere and the module path/url can be any expression. `import` returns a promise that resolves to an object:

```
load '/modules/arithmetic.js' ~then 
    fun arith
        // use  arith :add  and  arith :subtract  here
```

Or using `await`:

```
asyncScope
    add subtract #= '/modules/arithmetic.js' load await
    // use add and subtract here
```

---

#### CommonJS Modules

CommonJS modules do not require dedicated operators or rules.

The following export examples are equivalent:

```
module :exports = #
| add [a + b]
| subtract [a - b]
```

```
add = [a + b]
subtract = [a - b]
exports attach add subtract
```

```
exports
| chg 'add' [a + b]
| chg 'subtract' [a - b]
```

Use the `require` function to load a module:

```
arith = 'arithmetic.js' \require
// use  arith :add  and  arith :subtract  here
```

Or with destructuring:

```
add subtract #= 'arithmetic.js' \require
// use add and subtract here
```