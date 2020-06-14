## Loops

---

#### `each` {#each}

Loop over an iterable.

The first operand of `each` is the iterable to loop over; the final operand is the loop [body](?Syntax#body-rules). Between these, we can provide optional _loop parameters_ for the current value, current index and the iterable:

```
// body in parentheses, prints: 4 5 6
@ 4 5 6 each x (print x)

// body is an indented block, prints: 'a0' 'b1' 'c2'
'abc' each s i
    s + i
```

Use `stop` to exit a loop _at the end the current step_:

```
// prints 4 5 6
@ 4 5 6 7 8 each x
    print x
    if (x > 5)
        stop

// prints 4 5 6
@ 4 5 6 7 8 each x
    if (x > 5)
        stop
    print x
```

---

#### `map` {#map}

As [`each`](#map), but `map` collects the value of the body (the last expression evaluated) at each step in an array:

```
@ 4 5 6 map x (x + 10)   // [14, 15, 16]

// returns [14, 15, 16]
@ 4 5 6 7 8 map x i
    if (i < 4)
        x + 10
    | else
        stop
```

---

#### `do` {#do}

Loop a given number of times.

The final operand of `do` is the loop [body](?Syntax#body-rules). The optional operands are the number of steps and the current index:

```
// prints 0 1 2 3 4
5 do i
    print i
```

Use `stop` to exit a loop _at the end the current step_. 

Use `Infinity` as the number of steps when there there is no actual limit on the number of steps, but the index parameter is required:

```
// prints 0 1 2 3 4
Infinity do i
    print i
    i += 1
    if (i == 5)
        stop
```

If only the loop body is given, the number of steps defaults to `Infinity`:

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

---

#### `asyncEach`, `asyncMap`, `asyncDo` {#async-loops}

Asynchronous versions of [`each`](#each), [`map`](#map) and [`do`](#do).

These operators return a promise that resolves to the equivalent of that returned by the synchronous version of the operator.

`await` can be used in the body of asynchronous loops. The following example uses [`period`](?Print-and-Debug#period) to create a promise that resolves after `delay` milliseconds:

```
// wait 1000 ms, print 5,  wait 1000 ms, print 6 
@ 5 6 asyncEach x
    period 1000 await
    print x
```

If the parent [scope](#Scope) of an asynchronous loop is asynchronous, we can `await` the loop itself. The following example uses [`asyncScope`](?Scope#scope-op) to create an asynchrnouse scope:

```
// returns a promise thet resolves to 
@ 5 6 ayncMap x
    period 1000 await
    x + 10


!!!!!!!!!!!would we actually aawait inside the loop also with map?????????????????
```

---

#### Loop Parameters and Variables {#loop-variables}

Loop parameters and any variables created inside the loop body are local to each step of the loop &mdash; they are effectively created fresh each step.



---

#### Using 'yield' {'#yield-in-loops}


-------------------------


Use `$each` or `$map` to loop over an iterable. `$each` and `$map` are passed an iterable and a callback function; `$each` returns the iterable whereas `$map` collects the values returned by the callback in an array:

```
x = @ 5 6;
x $each [a $print];   // prints 5 6, returns x 
x $map [a + 10];      // [15, 16]

o = # u 5 v 6;
Object |values o $map [a + 10];   // [15, 16]

m = ## u 5 v 6;            // Map {'u' => 5, 'v' => 6}
m |values $map [a + 10];   // [15, 16]
```

The callback is passed the 'current index' as its second argument and the iterable as the third argument:

```
@ 5 6 7 $map [b];         // [0, 1, 2]
@ 5 6 7 $map [c |join];   // ['5,6,7', '5,6,7', '5,6,7']
```

If used with a single operand (a function), `$each` and `$map` automatically create an 'infinite generator' that yields `undefined` until its `return` method is called:

```
// prints 0 1 2 3
$each [
  b $print;
  b == 3 ? (c |return)];
```

> Calling a generator's `return` method exits a loop _at the end_ of the current step.

> When `$each` or `$map` is used with a single operand, the loop has at least one step. Use [`$while`](?Generators#do-and-while) when the loop may have zero steps.

> Operators for working with iterables (including the operators in this section, but also see e.g. [Reduce](?Reduce), [Filter and Group](?Filter-and-Group), [Order and Bin](?Order-and-Bin), [Backticks](?Backticks) and [Tabular Data](?Tabular-Data)) treat empty array elements as normal elements (with value `undefined`). In contrast, some array methods ignore empty elements.

#### Asynchronous Loops {#async-loops}

The callback function of `$each` or `$map` can be asynchronous:

```
// web service that returns a random number
url = 'https://www.random.org/decimal-fractions/?num=1&dec=10&col=1&format=plain&rnd=new';

// prints 'done', then prints 3 random numbers
1 >> 3 $each {url \fetch $await |text $await $number $print};
$print 'done';
```

In the above example, the loop moves to the next step without waiting for the promise returned by the callback to resolve. If we had used `$map`, the returned array would contain the promises. In contrast to this behavior, `$awaitEach` and `$awaitMap` await both the iterable and the callback at each step. Like `$each` and `$map`, `$awaitEach` and `$awaitMap` use an infinite synchronous generator by default. 

`$awaitEach` and `$awaitMap` can only be used inside an asynchronous function:

```
url = 'https://www.random.org/decimal-fractions/?num=1&dec=10&col=1&format=plain&rnd=new';

\{
  // prints random numbers until > 0.9, then prints 'done'
  $awaitEach {
    x = url \fetch $await |text $await $number $print;
    x > 0.9 ? (c |return)};
  $print 'done'};
```

As demonstrated in the above example, `$awaitEach` (and `$awaitMap`) is itself awaited &mdash; `'done'` is printed _after_ the numbers are printed.

