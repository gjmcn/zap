## Reduce

---

Except for [`reduce`](#reduce-op) itself, the operators in this section take an iterable and a callback function. The callback is applied to each element of the iterable and the returned values are used to compute the result. For some operators, the callback is optional &mdash; if omitted, elements of the iterable are used to compute the result:

---
 
##### `count` <span class="small">(callback required)</span> {#count}

Counts the number of times that the callback returns a truthy value:

```
s = @@ 1 '1' true 0              // Set {1, "1", true, 0}
s count [typeof a == 'number']   // 2
```

---

##### `every`, `some` <span class="small">(callback required)</span> {#every}

`every` returns `true` if the callback returns a truthy value for every element and `false` otherwise. `some` returns `true` if the callback returns a truthy value for any element and `false` otherwise.

```
m = ##
| apple 'green'
| banana 'yellow'
| cherry 'red'   // Map {'apple' => 'green', ...}

// use values method of map
m ~values every [a == 'green']   // false 
m ~values some  [a == 'green']   // true

// use m directly (the callback is passed an array: [key value])
m every [a :1 == 'green']   // false 
m some  [a :1 == 'green']   // true
```

If the iterable is empty, `every` returns `true`, `some` returns `false`.

---

##### `find`, `findIndex` <span class="small">(callback required)</span> {#find}

`find` returns the element corresponding to the first truthy result of the callback. `findIndex` is like `find`, but returns the index of the corresponding element:

```
x = @
| (# u 5 v 20)
| (# u 6 v 10)
| (# u 7 v 30)   // array of objects

x find [a :u > 5]        // {u: 6, v: 10}
x findIndex [a :u > 5]   // 1
```

If the callback does not return a truthy value for any element, `find` returns `undefined`, `findIndex` returns `-1`.

---

##### `min`, `max`, `minIndex`, `maxIndex` <span class="small">(callback optional)</span> {#min}

`min`/`max` returns the element of the iterable corresponding to the minimum/maximum:

```
@ 7 3 2 5 min   // 2

x = @ (@ 2 10) (@ 7 20) (@ 5 30)   // array of arrays
x max [a :0]                       // [7, 20]
```

If multiple elements correspond to the minimum/maximum, the first such element is used.

`minIndex` and `maxIndex` are like `min` and `max` respectively, but return the index corresponding to the minimum/maximum:

```
@ 3 9 5 maxIndex   // 1
```

The elements of the iterable (or results of the callback if used) are treated as numbers. If any element converts to `NaN` or if the iterable is empty, `min` and `max` return `undefined`, `minIndex` and `maxIndex` return `-1`.

---

##### `sum`, `mean`, `variance`, `deviation` <span class="small">(callback optional)</span> {#sum}

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
| (# u 7 v 30)   // array of objects
x sum [a :v]     // 60
```

The elements of the iterable (or results of the callback if used) are treated as numbers. If any element converts to `NaN`, the reduction operator will return `NaN`.

`sum` returns `0` if the iterable is empty, `mean` returns `NaN`. `variance` and `deviation` return `NaN` if the iterable has less than 2 elements.

`variance` calculates the unbiased sample variance: the sum of squared differences from the mean divided by _n_ - 1, where _n_ is the number of elements in the iterable. `deviation` is the square root of `variance`.

---

##### `sumCumu` <span class="small">(callback optional)</span> {#sum-cumu} 

`sumCumu` is like [`sum`](#sum), but returns an array of cumulative sums rather than just the result:

```
x = @ 3 8 2 10
x sum       // 23
x sumCumu   // [3, 11, 13, 23]
```

> `sumCumu` is _not_ a reduction operator, but is listed here due to its similarity to `sum`.

---

#### `reduce` {#reduce-op}

The `reduce` operator takes an iterable, a 'reducer function' and an initial result. The reducer function is called once for each element of the iterable; it is passed the 'current result', the element, the index and the iterable:

```
@ 5 6 7 reduce [a + b] 0   // 18
```

> The initial result is required &mdash; in contrast to the [`reduce` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) where the initial result is optional.