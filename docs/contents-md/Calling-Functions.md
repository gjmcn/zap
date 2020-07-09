## Calling Functions {#calling-functions}

---

The `\` operator calls a function. `\` uses the [right operand rule](#right-operand-rule):

```
f = [a + b]   // function (adds its arguments)
\f 5 10       // 15 
5 \f 10       // 15
5 10 \f       // 15
```

The behavior of `\` allows us to 'pipe' function calls rather than nest them:

```
double = [2 * a]      // function
add = [a + b]         // function
\double 5 \add 20     // 30 (piped calls)
\add (\double 5) 20   // 30 (nested calls)
```

---

#### Methods {#calling-methods}

`\` can be used to call methods, but there is also a dedicated method call operator `~` which is often more convenient. `~` uses both the [right operand rule](#right-operand-rule) and the [identifier-name rule](#identifier-name-rule):

```
x = @ 5 6 7 8
x ~slice 1 3      // [6, 7]
~slice x 1 3      // [6, 7]
x 1 3 ~slice      // [6, 7]
\(x :slice) 1 3   // [6, 7]

Array ~isArray x      // true
\(Array :isArray) x   // true
x \(Array :isArray)   // true
```

---

#### Return Calling Object or First Argument {#return-first}

`<~` is like `~`, but `<~` always returns the calling object. For example, we can use `<~` to chain the array methods `push` and `shift` (neither of which return the calling array):

```
@ 5 6 <~push 7 <~shift   // [6, 7]
```

Similarly, `<\` is like the function call operator `\`, but `<\` returns the first argument passed to the function.

---

#### `call` and `apply` {#call-and-apply}

Call a function.

The first operand of `call` must be a function; any other operands are passed to the function:

```
f = [a + b]   // function (adds its arguments)
call f 5 10   // 15 
f call 5 10   // 15
```

`apply` is like `call`, but any arguments for the function are passed inside a single iterable:

```
f = [a + b]        // function (adds its arguments)
f apply (@ 5 10)   // 15
apply f (@ 5 10)   // 15
```

> `call` and `apply` are like the function methods [`call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) and [`apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) respectively, but the Zap operators do not specify the value of `this`. Also, the `apply` operator can take any iterable, whereas the `apply` method is restricted to array-like objects.
