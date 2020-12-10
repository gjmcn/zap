## Bin {#bin}

---

`bin` takes an iterable to bin, an iterable of bin limits and a 'comparison function' (see [`order`](#order) and the [`sort` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)). The default comparison function is `[a - b]` which is suitable for binning (finite) numbers or dates. `bin` returns a map with arrays for values:

```
@ 5 9 12 7 bin (@ 10 20)   // Map {10 => [5, 9, 7], 20 => [12]}

x = @ 
| (@ 23 0) (@ 7 1) (@ 32 2) 
| (@ 38 3) (@ 3 4) (@ 34 5)   // array of arrays

limits = @ 10 20 30 40

x bin limits [a,0 - b]   // Map {
                         //   10 => [[7, 1], [3, 4]],
                         //   20 => [],
                         //   30 => [[23, 0]],
                         //   40 => [[32, 2], [38, 3], [34, 5]]
                         // }

// second callback
x bin limits [a,0 - b] [a pick 1]   // Map {
                                    //   10 => [1, 4]
                                    //   20 => []
                                    //   30 => [0]
                                    //   40 => [2, 3, 5]
                                    // }

// binCount
@ 5 9 12 7 binCount (@ 10 20)   // Map {10 => 3, 20 => 1}
x binCount limits [a,0 - b]     // Map {10 => 2, 20 => 0, 30 => 1, 40 => 3}
x binCount limits [a,0 - b] [a > 1]   // Map {
                                      //   10 => true,
                                      //   20 => false,
                                      //   30 => false,
                                      //   40 => true
                                      // }
```

As shown in the example, `bin` can take a second callback (the example uses [pick](#pick)). This is applied to each bin (it is passed a value and key of the map at each step) and the results are used as the values of the returned map.

`binCount` gets the number of elements in each bin &mdash; see the final examples above. While we could use `bin` with a second callback for this, `binCount` is more efficient and is easier to read. 

An element is assigned to a bin if the comparison function (which is passed the element and the bin limit) is less than or equal to 0. Using the default comparison function `[a - b]` is equivalent to specifying inclusive upper bin limits &mdash; use `[b - a]` to specify lower bin limits. Elements that are not assigned to any bin do not appear in the map returned by `bin` (or contribute to any value in `binCount`).

> `bin` and `binCount` assume that the bin limits are already sorted (with respect to the comparison function). If this is not the case, `bin` and `binCount` will give unexpected results.

> The elements inside each bin are _not_ sorted &mdash; they appear in the same order as in the original iterable.