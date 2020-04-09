## Generators

---

We can use a [generator function](?Writing-Functions#generator-functions) to create a generator, but the operators described in this section are more convenient for many common tasks.

Since generators are iterables, they can be used with [spread syntax](?Spread) and with many operators &mdash; see e.g. [Loops](?Loops), [Reduce](?Reduce), [Filter and Group](?Filter-and-Group), [Order and Bin](?Order-and-Bin), [Backticks](?Backticks) and  [Destructuring](?Assignment#Destructuring). Here are some examples that use the [`>>`](#range) operator described below:

```
r = 5 >> 7;   // generator (5 6 7)
r |next;      // {value: 5, done: false}
r |next;      // {value: 6, done: false}
r |next;      // {value: 7, done: false}
r |next;      // {value: undefined, done: true}

5 >> 7 $each [a $print];   // prints 5 6 7
5 >> 7 $array;             // [5, 6, 7]
@ ...(5 >> 7);             // [5, 6, 7]
@@ ...(5 >> 7);            // Set {5, 6, 7}
5 >> 7 $mean;              // 6
5 >> 7 `+ 10;              // [15, 16, 17]
u v w @= 5 >> 7;           // u is 5, v is 6, w is 7
```

---

##### `>>` `>>>`{#range}

The range operator `>>` returns a generator that represents a sequence of equally spaced numbers. `>>` takes three operands: _start_, _end_ and _step_. _step_ is 1 by default:

```
5 >> 7;        // generator (5 6 7)
1.5 >> 10 3;   // generator (1.5 4.5 7.5 9)
1 >> ~2 ~1;    // generator (1 0 -1 -2)
```

> Ranges created with `>>` can include <i>end</i>. Specifically, for an increasing range: <code><i>value</i> &lt; (<i>end</i> + 1e-15)</code> is used to test if <code><i>value</i></code> is in the range.

`>>>` is like `>>` except that the third operand (which should be a non-negative integer) is the number of steps:

```
2 >>> 8 4;    // generator (2 4 6 8)
3 >>> 6 3;    // generator (3 4.5 6)
2 >>> ~7 4;   // generator (2 -1 -4 -7) 
```

> Due to floating-point arithmetic, the final element of a range created with `>>>` may not be identical to _end_.

---

##### `$seq`{#seq}

The `$seq` operator returns a generator that represents a sequence. The operands of `$seq` are a _value_, a _test_ function and an _update_ function. _value_ is passed to _test_; if _test_ returns truthy, _value_ is passed to _update_ and the result is the new _value_. These steps are repeated until _test_ is falsy. The generator returned by `$seq` yields _value_ at each step (after _test_, before _update_):

```
$seq 1 [a < 10] [a * 2];   // generator (1 2 4 8)
```

---

##### `$zip`{#zip}

`$zip` takes one or more iterables and returns a generator that yields the first elements of the iterables as an array, then the second elements, ...

```
$zip (5 >> 7) (@ 10 20 30);   // generator ([5, 10], [6, 20], [7, 30])
```

The generator returns when the end of the shortest iterable is reached.

> [`$zipEach`](?Loops#zipped-loops) or [`$zipMap`](?Loops#zipped-loops) are typically used to iterate over multiple iterables simultaneously. Use `$zip` if an explicit generator is required or to get the yielded elements as an array at each step.

---

##### `$nest`{#nest}

Like `$zip`, `$nest` takes one or more iterables and the returned generator yields an array of elements (one from each iterable) each time it is called. However, `$nest` yields all combinations of elements from the iterables:  

```
$nest (5 >> 7) (@ 10 20);   // generator ([5, 10], [5, 20], [6, 10], 
                            //            [6, 20], [7, 10], [7, 20])
```

The generator returned by `$nest` is analogous to a nested loop. In the above example, the second ('inner') iterable is cycled through once for each element of the first ('outer') iterable.

`$nest` creates a new array from each iterable and yields elements from these arrays. This allows generators (which can only be used once) to be used with `$nest`. However, it also means that calling the `return` method of a generator will _not_ prevent `$nest` yielding further elements.

> [`$nestEach`](?Loops#nested-loops) or [`$nestMap`](?Loops#nested-loops) are typically used for nested loops. Use `$nest` if an explicit generator is required or to get the yielded elements as an array at each step.

---

##### `$do` `$while`{#do-and-while}

`$do` takes a callback function and returns a generator that repeatedly yields the result of the callback. `$do` is typically used with [`$each`](?Loops) or [`$map`](?Loops):

```
// prints random numbers until > 0.9
$do [Math |random] $each [
  $print a;
  a > 0.9 ? (c |return)];
```

`$while` takes a callback function and returns a generator that repeatedly yields `undefined` until the callback returns a falsy value:

```
i = 3;

// prints 3 2 1
$while [i > 0] $each [
  $print i;
  i -= 1];
```

> A generator created with `$do` yields at least once. A generator created with `$while` may yield zero times.

`$asyncDo` and `$asyncWhile` are like `$do` and `$while` respectively, but return an asynchronous generator that awaits the callback before yielding. In the following example, `$asyncDo` creates an asynchronous generator for a stream of data and `$awaitEach` uses the generator to compute the size of the response:

```
// web service that returns fake JSON data
url = 'https://jsonplaceholder.typicode.com/photos';

// prints '1071472 bytes' 
\{
  reader = url \fetch $await :body |getReader;
  bytes = 0;
  $asyncDo {reader |read} $awaitEach [data index gen ->
    data :done ? (gen |return) (bytes += data :value :length)];
  + bytes' bytes' $print};
```

The above example demonstrates the use of an asynchronous generator. However, note that we could handle the asynchronous part of the task inside the loop callback instead: 

```
url = 'https://jsonplaceholder.typicode.com/photos';

// prints '1071472 bytes' 
\{
  reader = url \fetch $await :body |getReader;
  bytes = 0;
  $awaitEach {  // default synchronous generator, asynchronous callback
    done value #= reader |read $await;
    done ? (c |return) (bytes += value :length)};
  + bytes' bytes' $print};
```