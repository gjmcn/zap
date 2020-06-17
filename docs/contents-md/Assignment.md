## Assignment

---

> Assignment operators [do not follow the normal position and precedence rules](?Syntax#assignment-precedence).

---

#### `=` {#standard-assignment}

Standard assignment:

```
x = 5   // 5
x       // 5
```

---

#### `\=` {#non-local}

Assign, but do not trigger the creation of a local variable (see [Assignment and Scope](#assignment-and-scope)):

```
x = 5         // 5
scope
    x         // 5
    x \= 10   // 10
    x         // 10
x             // 10
```

---

#### `+=`, `-=`, `*=`, `/=`, `%=`, `^=` {#update-assignment}

Update-assignment:

```
x = 5     // 5
x += 10   // 15
x         // 15
```

---

#### `?=` {#conditional-assignment}

Use `?=` for _conditional assignment_: if the variable (the first operand) is currently `undefined` or `null`, the second operand is evaluated and the result is assigned to the variable. If the variable _is not_ currently `undefined` or `null`, the variable is assigned its current value and the second operand is not evaluated (short-circuit evaluation):

```
x = null
x ?= 5    // 5 (x is 5)
x ?= 10   // 5 (x is 5)
```

---

#### `#=` {#destructure-object}

Destructure an object:

```
o = # h 5 i 6 j 7
h j z #= o   // returns o, h is 5, j is 7, z is undefined
```

---

#### `@=` {#destructure-iterable}

Destructure an iterable:

```
x = @ 5 6 7
u v @= x       // returns x, u is 5, v is 6
u v w z @= x   // returns x, u is 5, v is 6, w is 7, z is undefined
```

---

#### Assignment and Scope {#assignment-and-scope}

Assignment triggers the creation of a local variable. The variable is created at the start of the current [scope](?Syntax#open-scope), and has the value `undefined` until it is assigned to. Here is an example that uses the [`scope`](?Writing-Functions#scope-op) operator to open a new scope:

```
x = 5        // 5 (outer x)

scope
    x        // 5 (outer x)

// assign to x in inner scope so local x is created
scope
    x        // undefined (local x)
    x = 10   // 10 (local x)
    x        // 10 (local x)

x            // 5 (outer x)
```

Variables created at the top-level scope are _not_ global &mdash; they are not visible to other files. [Set a property](?Set-Property) of the global object to create a global variable:

```
globalThis :x = 5   // works in any JavaScript environment
window :y = 6       // works in browsers
global :z = 7       // works in Node.js
```

Only [`=`](#standard-assignment), [`#=`](#destructure-object), [`@=`](#destructure-iterable) and [`<-`](?Writing-Functions#options) (discussed in [Writing Functions](?Writing-Functions)) trigger the creation of local variables. The other assignment operators change the value of an existing variable.