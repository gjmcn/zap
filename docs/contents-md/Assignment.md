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

#### `+=`, `-=`, `*=`, `/=`, `%=`, `^=` {#update-assignment}

Update-assignments:

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


#### `\=` {#non-local}

Variables assigned to with [`=`](#standard-assignment), [`#=`](#destructure-object), [`@=`](#destructure-iterable) or  [`<-`](?Writing-Functions#options) (discussed in [Writing Functions](?Writing-Functions)) are automatically created at the start of the current [scope](?Syntax#body) &mdash; with initial value `undefined`. `\=` is like `=`, except that `\=` _does not_ trigger the creation of a local variable. The following example uses the [`scope`](?Writing-Functions#scope-op) operator to open a new scope:


```
x = 5         // 5
scope
    x         // 5
    x \= 10   // 10
    x         // 10
x             // 10
```

Note that [conditional assignment](#conditional-assignment) (`?=`) and [update-assignment](#update-assignment) (`+=`, `-=`, `*=`, `/=`, `%=`, `^=`) _does not_ trigger the creation of a local variable so behave like `\=` in this respect:


```
x = 5         // 5
scope
    x         // 5
    x += 10   // 15
    x         // 15
x             // 15
```