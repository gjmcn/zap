## Variables and Scope

---

Variables are created through assignment using `=`, `=:`, `#=` or `@=`:

```
x = 5;   // 5 (outer x is at 'file scope')

\[
  x;     // 5 (outer x)
];

// assign to x with '=' so a local x is created
\[
  x;        // undefined (local x, value is undefined prior to assignment)
  x = 10;   // 10 (local x)
  x;        // 10 (local x)
];

x;       // 5 (outer x)
```

`=`, `=:`, `#=` and `@=` _cannot_ create global variables. Attach a property to the global object to create a global variable:

```
globalThis :x 5;   // works in any JavaScript environment
window :y 6;       // works in browsers
global :z 7;       // works in Node.js
```

> Assignment operators other than `=`, `=:`, `#=` and `@=` update a variable so the variable must already exist.


Use `\=` to avoid creating a local variable. `\=` assigns to the 'most local' variable with the given name:

```
x = 5;       // 5
\[
  x;         // 5
  x \= 10;   // 10
  x;         // 10
];
x;           // 10
```
 
Similarly, conditional assignment (`?=`) and update assignments (`+=`, `-=`, ...) assign to the most local variable with the given name:

```
x = null;    // null
\[
  x;         // null
  x ?= 10;   // 10
  x += 5;    // 15
  x;         // 15
];
x;           // 15
```