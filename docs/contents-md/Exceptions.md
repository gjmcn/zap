## Exceptions

---

#### `throw` {#throw}

Use the `throw` operator to throw an exception:

```
\Error 'something went wrong' throw
```

The exception need not be an `Error` object, it can be anything:

```
@ 5 6 7 throw
```

---

#### `try`, `asyncTry` {#try}

The single operand of `try` is the [body](?Syntax#body-operands). The code in the body is executed; if it throws, `try` immediately returns whatever was thrown:

```
// prints 1, returns the Error object (2 is not printed)
try
    print 1
    \Error 'something went wrong' throw
    print 2
```

If the body of `try` does not throw, `try` returns `undefined`.

`asyncTry` is the asynchronous version of `try`. `asyncTry` returns a promise that resolves to whatever was thrown, or `undefined` if nothing was thrown. `await` can be used in the body of `asyncTry` &mdash; see [`catch`](#catch) for an example.

---

#### `catch`, `asyncCatch` {#catch}

`catch` takes three operands:

* an expression: typically an application of [`try`](#try)
* a parameter: takes the value of the expression (the parameter is local to the body)
* a [body](?Syntax#body-operands)

The body is only executed if the `try` expression is truthy:

```
// prints 'something went wrong!'
try
    \Error 'something went wrong' throw
| catch err
    + (err :message)'!' print
```

`catch` returns `undefined`.

Here is an example of using `catch` with [`asyncTry`](#try):

```
// waits 1000 ms, prints 'something went wrong!'
asyncScope
    asyncTry
        period 1000 await
        \Error 'something went wrong' throw
    | await catch err
        + (err :message)'!' print
```

`asyncCatch` is the asynchronous version of `catch`. `asyncCatch` returns a promise that resolves to `undefined`. `await` can be used in the body of `asyncCatch`.