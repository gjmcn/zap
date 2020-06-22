## Writing Functions {#writing-functions}

---


A function can be a __regular function__ or a __procedure__: a function that does not have its own `this`, `arguments`, `super` or `new :target` (i.e. a [JavaScript arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)).

A function returns the value of the last expression evaluated.

---

#### `fun`, `asyncFun` {#fun}

Create a regular function.

The operands of `fun` are the parameter names and the function [body](?Syntax#body-operands):

```
// no parameters, body in parentheses
f = fun (5)
\f   // 5

// 2 parameters, body in parentheses
f = fun x y (x + y)
\f 5 10   // 15

// 2 parameters, body in indented block
f = fun x y
    z = x + y
    z + 30 / z
\f 5 10   // 3
```

Use `asyncFun` to create an asynchronous function. The following example uses [`period`](?Print-and-Debug#period) to create a promise that resolves after `delay` milliseconds:

```
af = asyncFun delay
    delay period await
    print 'done'

1000 \af   // waits 1000 ms, prints 'done'
```

---

#### `proc`, `asyncProc` {#proc}

As [`fun`](#fun) and [`asyncFun`](#fun), but `proc` and `asyncProc` create a [procedure](#writing-functions).

---

#### Bracket Functions {#bracket-functions}

Brackets can be used to create a (synchronous) function comprised of a single expression. Use square brackets for a [regular function](#writing-functions) and curly brackets for a [procedure](#writing-functions). Bracket functions have parameters `a`, `b` and `c`:

```
f = []        // regular function (body is empty)
\f            // undefined

f = [5]       // regular function
\f            // 5 

f = [a + 5]   // regular function
\f 10         // 15

f = {a + b}   // procedure
\f 10 5       // 15
```

> When bracket functions are nested, the inner function cannot see the parameters of the outer function because of the shared parameter names.

---

#### The `rest` Parameter {#rest}

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

#### Default Parameters {#default-parameters}

Use [`?=`](?Assignment#conditional-assignment) to set a default parameter value &mdash; the default is used if `undefined` or `null` is passed, or if no value is passed:

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

\f 10 (# u 20) 30 40   // [10, 20, 6, [30, 40]]   
```

> Except for defaulting to an empty object, there is nothing special about `ops` &mdash; it can be used and modified like any other object.

> `<-` simply looks for the variable `ops` and gets the required property. `ops` will typically be a parameter of the current function, but need not be.

> `<-` uses short-circuit evaluation: if the relevant property of `ops` is neither `null` nor `undefined`, the right-hand side of `<-` is not evaluated.

---

#### `scope`, `asyncScope` {#scope-op}

Using `scope` is equivalent to writing a [procedure](#writing-functions) with no parameters and immediately calling it. Like all [body](?Syntax#body-operands) operands, variables created inside the body of `scope` are local:

```
x = 5
y = scope
    x = 10
    x + 20
y   // 30
x   // 5
```

`asyncScope` is the asynchronous version of `scope` &mdash; so `asyncScope` returns a promise rather than returning a value directly. `await` can be used in the body of `asyncScope`:

```
// waits 1000 ms, prints 5
asyncScope
    period 1000 await
    print 5
```

---

#### `as`, `asyncAs` {#as}

Like [`scope`](#scope-op) and [`asyncScope`](#scope-op), but the [body](?Syntax#body-operands) is preceded by an expression and a parameter that represents the value of the expression. The following example uses the [`max`](?Reduce#min) operator:

```
// array of objects
dogs = @
| (# name 'Alex' age 3) 
| (# name 'Beth' age 8) 
| (# name 'Cody' age 2)

// returns 'The oldest dog Beth is 8'
dogs max [a :age] as oldest
    + 'The oldest dog '(oldest :name)' is '(oldest :age)
```

> The parameter of `as` can be [`ops`](#options), but not [`rest`](#rest).

---

#### Generator Functions {#generator-functions}

If `yield` or `yieldFrom` are used inside the body of [`fun`](#fun) (or [`asyncFun`](#fun)), a generator function (or asynchronous generator function) is created:

```
f = fun
    yield 5
    yield 10   // generator function

g = \f         // generator
g ~next        // {value: 5, done: false}
```

A [procedure](#writing-functions) cannot be a generator function:

```
proc
    yield 5   // syntax error, invalid use of yield
```

`yield` and `yieldFrom` _can_ be used inside [`scope`](#scope-op), [`asyncScope`](#scope-op), [`as`](#as) and [`asyncAs`](#as):

```
g = scope
    yield 5
    yield 10   // generator

g ~next        // {value: 5, done: false}
```

> When `yield` or `yieldFrom` are used in [`scope`](#scope-op), [`asyncScope`](#scope-op), [`as`](#as) or [`asyncAs`](#as), the operator will behave like a [regular function](#writing-functions) rather than a [procedure](#writing-functions) &mdash; in particular, the body will have its own `this`.