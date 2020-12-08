## Filter {#filter}

---

`filter` takes an iterable and a callback function (default `[a]`). The callback is applied to each element of the iterable (it is passed the element, index and iterable); if the result is truthy, the element is included in the array returned by `filter`:

```
@ true false null 5 filter   // [true, 5]
@ 3 7 4 9 filter [a > 5]     // [7, 9]

x = @
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)   // array of objects

x filter [a,u == 5]   // [{u: 5, v: 10}, {u: 5, v: 30}]

// filterIndex
x filterIndex [a,u == 5]   // [0, 2]
```

As shown in the final example, `filterIndex` can be used to get the original indices of the filtered elements.

When filtering an iterable of objects/arrays, an inner property/index can be used instead of a callback function:

```
x = @ 
| (# u 5 v 10)
| (# u 6)
| (# u 5 v 30)   // array of objects

x filter [a,v]   // [{u: 5, v: 10}, {u: 5, v: 30}]
x filter 'v'     // [{u: 5, v: 10}, {u: 5, v: 30}]
```