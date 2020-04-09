## Writing Functions

---

Use square brackets to create a function. By default, a function has parameters `a`, `b`, `c` and `d`. To use custom parameter names, list them after the opening bracket followed by `->`:

```
f = [a + b];          // function
g = [u v -> u + v];   // function

\f 5 10;   // 15 
\g 5 10;   // 15

f :length;      // 4 (number of parameters)
g :length;      // 2
[] :length;     // 4
[->] :length;   // 0
```

> If an inner function must see the parameters of an outer function, at least one of the functions must have custom parameter names &mdash; otherwise the parameters of the outer function will be 'shadowed'.

#### Rest Syntax

Rest syntax can be used with the final parameter:

```
f = [x ...y -> y];
\f 5 6 7;   // [6, 7]
```

#### Defaults

Use [`?=`](?Assignment#conditional-assignment) to set a default parameter value. The default is used if `undefined` or `null` is passed, or if no value is passed:

```
f = [
  a ?= 5;
  a + 10];

\f;   // 15  
```

#### Options {#options}

A parameter called `ops` ('options') automatically defaults to an empty object. The assignment operator `=:` is specifially for working with `ops` objects. `=:` assigns a property of `ops` to a variable of the same name; the given default value is used if the property does not exist, or is `undefined` or `null`:

```
area = [ops ->
  width =: 5;
  height =: 10;
  width * height];

# width 20 height 30 \area;   // 600
# height 30 \area;            // 150
\area;                        // 50
```

`ops` can be used alongside other parameters:

```
f = [x ops ...y ->
  u =: 5;
  v =: 6;
  @ x u v y];

\f 10 (# u 20) 30 40;   // [10, 20, 6, [30, 40]]   
```

> Except for defaulting to an empty object, there is nothing special about `ops` &mdash; it can be used and modified like any other object.

> `=:` simply looks for the variable `ops` and gets the required property. `ops` will typically be an argument of the current function, but need not be.

> `=:` uses short-circuit evaluation: if the relevant property of `ops` is neither `null` nor `undefined`, the second operand of `=:` is not evaluated.

#### Asynchronous Functions

Use curly brackets for an asynchronous function:

```
f = {
  data = a \fetch $await |json $await;
  + 'Rows in data: '(data :length) $print};

// custom parameter name
g = {url ->
  data = url \fetch $await |json $await;
  + 'Rows in data: '(data :length) $print};
```

#### Generator Functions {#generator-functions}

Use `**` immediately after the opening bracket for a generator function:

```
f = [**
  5 $yield;   
  6 $yield];   // generator function

g = \f;        // generator
g |next;       // {value: 5, done: false}
```

#### Arrow Functions

Functions compile to standard JavaScript function expressions by default. Use `=>` rather than `->` for a [JavaScript arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions):

``` 
f = [x => x + 5];   // arrow function
\f 10;   // 15
```

#### Immediately Invoked Function Expressions

As in JavaScript, we can use immediately invoked function expressions (IIFEs):

```
// IIFE with no arguments
\[5];   // 5

// IIFE with 2 arguments
5 10 \[a + b];   // 15
5 \[a + b] 10;   // 15
\[a + b] 5 10;   // 15

// asynchronous IIFE
\{
  data = someURL \fetch $await |json $await;
  + 'Rows in data: '(data :length) $print};
```