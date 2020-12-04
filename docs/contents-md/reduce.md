## Reduce {#reduce}

---

Unless otherwise stated, reduction operators take an iterable and a callback function (default `[a]`). The callback is applied to each element of the iterable (the callback is passed the element, index and iterable) and the returned values are used to compute the result:

```
x = @ 4 5 6
x sum            // 15
x sum [a >< 5]   // 16 (>< is 'greatest')
```

When 'reducing' an iterable of objects/arrays, an inner property/index can be used instead of a callback function:

```
x = @ 
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)   // array of objects

x sum [a :v]   // 60
x sum 'v'      // 60
```

---
 
#### `count`{#count}

Count the truthy values:

```
s = @@ 1 '1' true 0    // Set {1, "1", true, 0}
s count                // 3
s count [a isNumber]   // 2
```

---

#### `every`, `some`{#every}

`every` returns `true` if all values are truthy; `some` returns `true` if any value is truthy:

```
x = @ 5 null 'abc'
x every            // false
x some             // true
x some [a == 10]   // false

m = ##
| apple 'green'
| banana 'yellow'
| cherry 'red'   // Map {'apple' => 'green', ...}

// use values method of map
m ~values every [a == 'green']   // false 
m ~values some  [a == 'green']   // true
```

If the iterable is empty, `every` returns `true`, `some` returns `false`.

---

#### `find`, `findIndex`{#find}

`find` returns the element corresponding to the first truthy value. `findIndex` is like `find`, but returns the index of the element:

```
x = @ 3 7 2 9
x find [a > 5]        // 7
x findIndex [a > 5]   // 1

x = @
| (# u 5)
| (# u 6 v 10)
| (# u 7 v 30)   // array-of-objects

x find 'v'               // {u: 6, v: 10}
x find [a :u == 7]       // {u: 7, v: 30}
x findIndex [a :u > 5]   // 1
```

If there are no truthy values, `find` returns `undefined`, `findIndex` returns `-1`.

---

#### `min`, `max`, `minIndex`, `maxIndex`{#min}

`min`/`max` returns the element corresponding to the minimum/maximum value:

```
@ 7 3 2 5 min   // 2

x = @ (@ 2 10) (@ 7 20) (@ 5 30)   // array-of-arrays
x max 0                            // [7, 20]
```

If multiple elements correspond to the minimum/maximum value, the first such element is returned.

`minIndex` and `maxIndex` are like `min` and `max` respectively, but return the index corresponding to the minimum/maximum value:

```
@ 3 9 5 maxIndex   // 1
```

Values are treated as numbers. If any value converts to `NaN` or if the iterable is empty, `min` and `max` return `undefined`, `minIndex` and `maxIndex` return `-1`.

---

#### `sum`, `mean`, `variance`, `deviation`{#sum}

Sum, mean, variance and standard deviation:

```
x = @ 4 6 8
x sum         // 18
x mean        // 6
x variance    // 4
x deviation   // 2

x = @
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 7 v 30)   // array-of-objects
x sum 'v'        // 60
```

Values are treated as numbers. If any value converts to `NaN`, the reduction operator will return `NaN`.

`sum` returns `0` if the iterable is empty, `mean` returns `NaN`. `variance` and `deviation` return `NaN` if the iterable has less than 2 elements.

`variance` calculates the unbiased sample variance: the sum of squared differences from the mean divided by _n_ - 1, where _n_ is the number of elements in the iterable. `deviation` is the square root of `variance`.

---

#### `sumCumu`{#sum-cumu} 

`sumCumu` is like [`sum`](#sum), but returns an array of cumulative sums rather than just the result:

```
x = @ 3 8 2 10
x sum       // 23
x sumCumu   // [3, 11, 13, 23]

x = @
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 7 v 30)     // array-of-objects
x sumCumu 'v'      // [10, 30, 60]
```

> `sumCumu` is _not_ a reduction operator, but is listed here due to its similarity to `sum`.

---

#### `median`, `quantile`{#median}

The median value:

```
@ 4 2 7 median      // 4
@ 4 2 7 10 median   // 5.5

y = @ 
| (# u 5 v 25)
| (# u 6 v 10)
| (# u 7 v 30)    // array-of-objects
y median 'v'      // 25
```

If the values are already sorted, use a third truthy operand with `median` to skip the sorting step.

`quantile` is like `median`, but takes an extra operand &mdash; a probability bounded at 0 and 1 &mdash; after the iterable:

```
x = @ 4 2 7 10 
x quantile 0         // 2
x quantile 1         // 10
x quantile 0.5       // 5.5 (the median)
x quantile (2 / 3)   // 7

y = @ 
| (# u 5 v 25)
| (# u 6 v 10)
| (# u 7 v 30)        // array-of-objects
y quantile 0.25 'v'   // 17.5
```

`median` and `quantile` use linear interpolation. Values (and the probability operand of `quantile`) are treated as numbers. If any of the numbers are `NaN` or if the iterable is empty, `median` and `quantile` return `NaN`.

---

#### `reduce` {#reduce-op}

The `reduce` operator takes an iterable, a 'reducer function' and an initial result. The reducer function is called once for each element of the iterable; it is passed the 'current result', the element, the index and the iterable:

```
@ 5 6 7 reduce [a + b] 0   // 18
```

> The initial result is required &mdash; in contrast to the [`reduce` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) where the initial result is optional.