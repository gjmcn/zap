## Loops

---

> Operators for working with iterables (including loop operators, but also see e.g. [Reduce](?Reduce), [Filter and Group](?Filter-and-Group), [Order and Bin](?Order-and-Bin), [Backticks](?Backticks) and [Tabular Data](?Tabular-Data)) treat empty array elements as normal elements (with value `undefined`). In contrast, some array methods ignore empty elements.

---

#### `each` {#each}

Loop over an iterable.

The first operand of `each` is the iterable; the final operand is the loop [body](?Syntax#body-rules). Between these, we can provide optional _loop parameters_ for the current value, current index and the iterable:

```
// body in parentheses, prints: 4 5 6
@ 4 5 6 each x (print x)

// body in indented block, prints: 'a0' 'b1' 'c2'
'abc' each s i
    s + i print
```

`each` returns the iterable.

Use `stop` to exit a loop _at the end of the current step_:

```
// prints 4 5 6
@ 4 5 6 7 8 each x
    print x
    if (x == 6)
        stop

// prints 4 5 6
@ 4 5 6 7 8 each x
    if (x == 6)
        stop
    print x
```

---

#### `map` {#map}

As [`each`](#each), but `map` collects the value of the body (the last expression evaluated) at each step in an array:

```
@ 4 5 6 map x (x + 10)   // [14, 15, 16]

// returns [14, 15, 16]
@ 4 5 6 7 8 map x i
    if (i == 2)
        stop
    x + 10
```

---

#### `do` {#do}

Basic loop.

The final operand of `do` is the loop [body](?Syntax#body-rules). The optional operands are the maximum number of steps and the current index:

```
// prints 0 1 2 3 4
5 do i
    print i
```

`do` returns `undefined`.

Use `stop` to exit a loop _at the end of the current step_.

Use `Infinity` as the maximum number of steps when there is no actual maximum, but the index parameter is required:

```
// prints 0 1 2 3 4
Infinity do i
    print i
    if (i == 4)
        stop
```

If only the loop body is given, the maximum number of steps defaults to `Infinity`:

```
x = 1
do
    x *= 2
    if (x > 20)
        stop
x   // 32
```

Even though `stop` only exits a loop at the end of the current step, we can use `if` with an `else` branch to effectively exit a loop at the point where `stop` is encountered:

```
x = 25
do
    if (x > 20)
        stop
    | else
        x *= 2
x   // 25
```

The maximum number of steps is fixed before the loop starts:

```
// prints 0 1 2 3 4
n = 5
n do i
    n += 10
    print i
```

---

#### `asyncEach`, `asyncMap`, `asyncDo` {#async-loops}

Asynchronous versions of [`each`](#each), [`map`](#map) and [`do`](#do).

These operators return a promise that resolves to:

* `asyncEach`: the iterable
* `asyncMap`: a new array
* `asyncDo`: `undefined`

`await` can be used in the body of an asynchronous loop. The following example uses [`period`](?Print-and-Debug#period) to create a promise that resolves after 1000 milliseconds:

```
// wait 1000 ms, print 5, wait 1000 ms, print 6 
@ 5 6 asyncEach x
    period 1000 await
    print x
```

If the parent [scope](?Scope) of an asynchronous loop is asynchronous, we can `await` the loop itself. The following example uses [`asyncScope`](?Scope#scope-op) to create an asynchronous scope:

```
// wait 1000 ms, print 5, wait 1000 ms, print 6, print 'done'
asyncScope
    @ 5 6 asyncEach x
        period 1000 await
        print x
    | await
    print 'done'
```

---

#### Loop Parameters and Variables {#loop-variables}

Loop parameters, and variables created inside the loop body are local to a single step of the loop. Assigning a new value to a parameter/variable will not affect its value at the next step, nor will it affect the behavior of the loop.

---

#### Using `yield` and `yieldFrom` {'#yield-in-loops}

If `yield` or `yieldFrom` is used in the body of an [`each`](#each), [`do`](#do), [`asyncEach`](#async-loops) or [`asyncDo`](#async-loops) loop, the operator returns a generator (or asynchronous generator):

```
g = 5 do i (yield i)   // generator
g array                // [0, 1, 2, 3, 4]

@ 5 6 7 each x
    yield x
    yieldFrom 'ab'   // generator
| array              // [5, 'a', 'b', 6, 'a', 'b', 7, 'a', 'b']
```