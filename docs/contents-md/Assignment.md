## Assignment

---

Use `=` for standard assignment:

```
x = 5;   // 5
x;       // 5
```

> Assignment operators [do not follow the normal position and precedence rules](?Evaluation#assignment-precedence).

#### Update-Assignment

Use `+=`, `-=`, `*=`, `/=`, `%=`, `^=` for update-assignments:

```
x = 5;     // 5
x += 10;   // 15
x;         // 15
```

#### Conditional Assignment {#conditional-assignment}

Use `?=` for _conditional assignment_: if the variable (the first operand) is currently `undefined` or `null`, the second operand is evaluated and the result is assigned to the variable. If the variable _is not_ currently `undefined` or `null`, the variable is assigned its current value and the second operand is not evaluated (short-circuit evaluation):

```
x = null;
x ?= 5;    // 5 (x is 5)
x ?= 10;   // 5 (x is 5)
```

#### Assignment and Options

The assignment operator [`=:`](?Writing-Functions#options) is discussed in [Writing Functions](?Writing-Functions).

#### Destructuring {#destructuring}

Use `#=` to destructure an object:

```
o = # h 5 i 6 j 7;
h z j #= o;   // returns o, h is 5, z is undefined, j is 7
```

Use `@=` to destructure an iterable. Use `null` to skip entries:

```
x = @ 5 6 7;
u v @= x;             // returns x, u is 5, v is 6
u null v @= x;        // returns x, u is 5, v is 7

s = @@ 5 6;   // Set {5, 6}
u v @= s;     // returns s, u is 5, v is 6
```

Rest syntax can be used when destructuring:

```
o = # u 5 v 6 w 7;
v ...z #= o;   // returns o, v is 6, z is {u: 5, w: 7}

x = @ 5 6 7;
s ...t @= x;   // returns x, s is 5, t is [6, 7]
```