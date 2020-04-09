## Import and Export

---

#### ES Modules

The following rules apply to import and export operators:

* Cannot be used inside functions or parentheses.

* The first operand of import operators is the module path/url which must be a string literal. All other operands of import and export operators must be [identifiers](?Expressions#identifiers). 

* Return `undefined`.

While not necessary, we typically use import and export operators at the start of a file. For example (assuming we have written the modules `arithmetic` and `classify`):

```
$import '/modules/arithmetic.js' add subtract;
$import '/modules/classify.js' isSmall;
$export smaller isVerySmall;

smaller = [a \subtract 10];
isVerySmall = [a \add 100 \isSmall];
```

> Do not assign to imports. In the compiled JavaScript, all code except import and export statements is wrapped in an IIFE. For an imported value `x`, `x += 5` will produce an error since imports are constants. In contrast, `x = x + 5` will create a local `x` inside the IIFE with value `NaN` (the result of `undefined + 5`).

---

##### `$export` {#export}

Export variables:

```
$export add subtract;

add = [a + b];
subtract = [a - b];
```

`$export` can only be used once per file.

---

##### `$import` {#import}

Use `$import` with one operand to import a module for side effects only:

```
$import '/modules/do-something.js';
```

Use additional operands for named imports:

```
$import '/modules/arithmetic.js' add subtract;
// use add and subtract here
```

---

##### `$importAs` {#import-as}

Rename imports. Operands are passed as _importName_ _newName_ pairs:

```
$importAs '/modules/arithmetic.js'
  add plus
  subtract takeaway;
// use plus and takeaway here
```

---

##### `$importAll` {#import-all}

Import entire contents of module as an object:

```
$importAll '/modules/arithmetic.js' ar;
// use  ar :add  and  ar :subtract  here
```

---

##### `$importDefault` {#import-default}

Import default export. Zap does not use default exports, but many JavaScript modules do:

```
$importDefault '/modules/my-js-module.js' theDefault;
// use theDefault here
```

---

##### Dynamic Imports

Call `import` as a function to dynamically import a module. Dynamically imported modules are not subject to the restrictions that apply to import operators: dynamic imports can be used anywhere and the module path/url can be any expression. When called as a function, `import` returns a promise that resolves to an object:

```
\import '/modules/arithmetic.js' |then [ar ->
  // use  ar :add  and  ar :subtract  here
  ];
```

Or (assuming the code is inside an asynchronous function) using `$await`:

```
add subtract #= '/modules/arithmetic.js' \import $await;
// use add and subtract here
```

---

#### CommonJS Modules

CommonJS modules do not require dedicated operators or rules.

The following export examples are equivalent:

```
exports
  :add [a + b]
  :subtract [a - b];
```

```
add = [a + b];
subtract = [a - b];
exports ::add ::subtract;
```

```
module :exports (#
  add [a + b]
  subtract [a - b]);
```

Use the `require` function to load a module:

```
ar = 'arithmetic.js' \require;
// use  ar :add  and  ar :subtract  here
```

Or with destructuring:

```
add subtract #= 'arithmetic.js' \require;
// use add and subtract here
```