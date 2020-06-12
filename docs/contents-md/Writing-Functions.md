## Writing Functions

---


A function can be a __regular function__ or a __procedure__: a function that does not have its own `this`, `arguments`, `super` or `new.target` (i.e. a [JavaScript arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)).

The body of a function is a [scope block](?Scope). A function returns the value of the final expression evaluated in the body.

---

#### `fun`, `asyncFun` {#fun}

Create a regular function. The operands of `fun` are the parameter names and the function body:

```
// no paramaters, body in parentheses
f = fun (5)
\f   // 5

// 2 paramaters, body in parentheses
f = fun x y (x + y)
\f 5 10   // 15

// 2 parameters, body in indented block
f = fun x y
    z = x + y
    z + 30 / z
\f 5 10   // 3
```

Use `asyncFun` for an asynchronous function. The following example uses [`period`](?Print-and-Debug#period) to ceate a promise that resolves after `delay` milliseconds:

```
af = asyncFun delay
    delay period await
    print 'done'

1000 \af
```

---

#### `proc`, `asyncProc` {#proc}

As [`fun`](#fun) and [`asyncFun`](#fun), but `proc` and `asyncProc` create a procedure.

---

#### Bracket Functions {#bracket-functions}

Brackets can be used to create a (synchronous) function comprised of a single expression. Use square brackets for a regular function and curly brackets for a procedure. Bracket functions have parameters `a`, `b` and `c`:

```
f = [5]       // regular function
\f   // 5     // 5 

f = [a + 5]   // regular function
\f 10         // 15

f = {a + b}   // procedure
\f 10 5       // 15
```

> When bracket functions are nested, the inner function cannot see the parameters of the outer function because of the shared parameter names.

---

#### The `rest` Parameter

If the final parameter of a function is called `rest`, it collects 'the rest of the arguments' in an array:

```
f = fun x y rest
    rest
\f 5 6 7 8   // [7, 8]

f = fun rest
    rest
\f 5 6 7 8   // [5, 6, 7, 8]
```

---

#### Default Parameters

Use [`?=`](?Assignment#conditional-assignment) to set a default parameter value (so the default is used if `undefined` or `null` is passed, or if no value is passed):

```
f = fun x
  x ?= 5
  x + 10

\f 3   // 13
\f     // 15  
```

---

#### The `ops` Parameter {#options}

A parameter called `ops` ('options') automatically defaults to an empty object. The assignment operator `<-` is specifically for working with `ops` objects. `<-` assigns a property of `ops` to a variable of the same name; the given default value is used if the property does not exist, or is `undefined` or `null`:

```
area = fun ops
    width <- 5
    height <- 10
    width * height

# width 20 height 30 \area   // 600
# height 30 \area            // 150
\area                        // 50
```

`ops` can be used with other parameters:

```
f = fun x ops rest
    u <- 5
    v <- 6
    @ x u v rest

\f 10 (# u 20) 30 40;   // [10, 20, 6, [30, 40]]   
```

> Except for defaulting to an empty object, there is nothing special about `ops` &mdash; it can be used and modified like any other object.

> `<-` simply looks for the variable `ops` and gets the required property. `ops` will typically be an argument of the current function, but need not be.

> `<-` uses short-circuit evaluation: if the relevant property of `ops` is neither `null` nor `undefined`, the second operand of `<-` is not evaluated.

---

#### Generators {#generator-functions}

If `yield` or `yieldFrom` are used inside a function body, a generator function is created:

```
f = fun
    yield 5
    yield 10   // generator function

g = \f         // generator
g ~next        // {value: 5, done: false}
```

> Procedures cannot be generators, so `yield` and `yieldFrom` cannot be used inside procedures.