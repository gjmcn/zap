## Assignment

---

> Assignment operators [do not follow the normal position and precedence rules](?Syntax#assignment-precedence).

Use `=` for assignment:

```
x = 5   // 5
x       // 5
```

#### Update-Assignment

Use `+=`, `-=`, `*=`, `/=`, `%=`, `^=` for update-assignments:

```
x = 5     // 5
x += 10   // 15
x         // 15
```

#### Conditional Assignment {#conditional-assignment}

Use `?=` for _conditional assignment_: if the variable (the first operand) is currently `undefined` or `null`, the second operand is evaluated and the result is assigned to the variable. If the variable _is not_ currently `undefined` or `null`, the variable is assigned its current value and the second operand is not evaluated (short-circuit evaluation):

```
x = null
x ?= 5    // 5 (x is 5)
x ?= 10   // 5 (x is 5)
```

#### Destructuring Assignment {#destructuring}

Use `#=` to destructure an object:

```
o = # h 5 i 6 j 7
h j z #= o   // returns o, h is 5, j is 7, z is undefined
```

Use `@=` to destructure an iterable:

```
x = @ 5 6 7
u v @= x       // returns x, u is 5, v is 6
u v w z @= x   // returns x, u is 5, v is 6, w is 7, z is undefined 
```

#### Other Assignment Operators

* [`<-`](?Writing-Functions#options) is discussed in [Writing Functions](?Writing-Functions)

* [`\=`](?Variables-and-Scope) is discussed in [Variables and Scope](?Variables-and-Scope)