## Calling Functions

---

Use the `\` operator to call a function:

```
\f;        // call f with no arguments
\f 5;      // pass 5 to f
\f 5 10;   // pass 5 and 10 to f
```

`\` (and the other operators described below for calling functions/methods) uses the [right operand rule](?Evaluation#right-operand-rule):

```
f = [a + b];   // function (adds its arguments)
\f 5 10;       // 15 
5 \f 10;       // 15
5 10 \f;       // 15
```

The behavior of `\` allows us to 'pipe' function calls rather than nest them:

```
double = [2 * a];       // function
add = [a + b];          // function
\double 5 \add 20;      // 30 (piped calls)
\add (\double 5) 20;    // 30 (nested calls)
```

#### Methods {#calling-methods}

`\` can be used to call methods, or we can use the method call operator `|`:

```
x = @ 5 6 7 8;
x |slice 1 3;      // [6, 7]
|slice x 1 3;      // [6, 7]
x 1 3 |slice;      // [6, 7]
\(x :slice) 1 3;   // [6, 7]

Array |isArray x;      // true
\(Array :isArray) x;   // true
x \(Array :isArray);   // true
```

`|` uses the [identifier-name rule](?Evaluation#identifier-name-rule):

```
x = @ 5 6 7 8;
s = 'slice'; 
x |(s) 1 3;   // [6, 7]
```

`?|` is like `|`, but `?|` short-circuits and returns `undefined` if the method does not exist (i.e. is `null` or `undefined`):

```
o = # f [5] v 6;   // {f: function, v: 6}

o |f;    // 5
o ?|f;   // 5

o |g;    // TypeError: o.g is not a function
o ?|g;   // undefined

o |v;    // TypeError: o.v is not a function
o ?|v;   // TypeError: o.v is not a function
```

#### Return Calling Object or First Argument {#return-first}

`<|` is like `|`, but always returns the calling object. For example, we can use `<|` to chain the array methods `push` and `shift` (neither of which return the calling array):

```
@ 5 6 <|push 7 <|shift;   // [6, 7]
```

Similarly, `<\` is like the function call operator `\`, but `<\` returns the first argument passed to the function.