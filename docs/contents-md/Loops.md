## Loops

---

#### `each` {#each}

The first operand of `each` is the iterable to loop over; the final operand is the loop [body](?Syntax#body-rules). Between these, we can provide optional _loop parameters_ for the current value, current index and the iterable:

```
// body in parentheses, prints: 4 5 6
@ 4 5 6 each x (print x)

// body is an indented block, prints: 4,0 5,1 6,2
@ 4 5 6 each x i
    + x','i
```

---

#### `map` {#map}

!!!!!!!!!!!!!!!!!HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

---

#### `do` {#do}


---

#### `asyncEach`, `asyncMap`, `asyncDo` {#async-loops}

Asynchronous versions of [`each`](#each), [`map`](#map) and [`do`](#do). These operators return a promise that resolves to the equivalent of that returned by the synchrnous version of the operator.

`await` can be used in body of asynchronous loops, regardless of the parent scope  -- USE ASYNCSCOPE ...


In the following example, we use an `asyncScope` so that we can 


```


```


---

#### Loop Parameters and Variables {#loop-variables}

Loop parameters and any variables created inside the loop body are local to each step of the loop &mdash; they are effectively created fresh each step.

---

#### Breaking from Loops {#stop}


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

