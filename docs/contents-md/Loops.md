## Loops

---

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

#### Zipped Loops {#zipped-loops}

`$zipEach` and `$zipMap` take one or more iterables and a callback function. The callback is passed the first element of each iterable, then the second element of each iterable, ...

```
x = @ 5 6 7;       // [5, 6, 7]
y = @@ 50 60 70;   // Set {50, 60, 70}

x y $zipEach [a + b $print];    // prints 55 66 77
x y $zipMap [a + b];            // [55, 66, 77]
```

`$zipEach` and `$zipMap` return when the end of the shortest iterable is reached. `$zipEach` returns `undefined`, `$zipMap` returns an array.

The callback is passed the current index and the iterables (in an array) after the elements. If any of the iterables is a generator, its return method can be used to exit the loop (at the end of the current step):

```
x = 5 >> 10;        // generator (5 6 7 8 9 10)
y = 50 >> 100 10;   // generator (50 60 70 80 90 100)

x y $zipMap [xi yi i iterables ->
  i == 2 ? (iterables :0 |return);
  xi + yi];         // [55, 66, 77]
```

> [`$zip`](?Generators#zip) returns a generator that iterates over multiple iterables simultaneously.

#### Nested Loops {#nested-loops}

`$nestEach` and `$nestMap` take one or more iterables and a callback function, and loop over the iterables as in a nested loop. `$nestEach` returns `undefined`, `$nestMap` returns nested arrays:

```
x = @ 10 20;   // [10, 20]
y = @ 5 6 7;   // [5, 6, 7]

// explicit nested loop, prints 15 16 17 25 26 27
// (use custom parameter names to avoid shadowing)
x $each [xi ->
  y $each [yi ->
    xi + yi $print]];

// using nestEach, prints 15 16 17 25 26 27
x y $nestEach [a + b $print];

// using nestMap, returns [[15, 16, 17], [25, 26, 27]]
x y $nestMap [a + b];
```

`$nestEach` and `$nestMap` create a new array from each iterable and loop over these arrays. This allows generators (which can only be used once) to be used with `$nestEach` and `$nestMap`. However, it also means that the `return` method of a generator _cannot_ be used to exit the loop.

> `$nestEach` and `$nestMap` do _not_ pass the loop indices or the iterables to the callback.

> [`$nest`](?Generators#nest) returns a generator for a nested loop.