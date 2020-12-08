## Order {#order}

---

`order` takes an iterable and a 'comparison function' (see the [`sort` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)), and returns a new array containing the sorted elements of the iterable. The default comparison function is `[a - b]` which sorts (finite) numbers or dates in ascending order.

`orderIndex` and `rank` behave like `order` except that:

* `orderIndex` returns the original indices of the sorted elements.

* `rank` returns the rank of each element.

```
x = @ 5 9 2
x order        // [2, 5, 9]
x orderIndex   // [2, 0, 1] 
x rank         // [1, 2, 0]

y = @ 
| (# u 5 v 20)
| (# u 6 v 10)
| (# u 7 v 30)   // array of objects

// sort on property v, descending
f = [b,v - a,v]
y order f        // [{u: 7, v: 30}, {u: 5, v: 20}, {u: 6, v: 10}]
y orderIndex f   // [2, 0, 1]
y rank f         // [1, 2, 0]

// tied values
@ 2 3 4 3 rank   // [0, 1, 3, 1]
```

For convenience, the comparison function can be replaced with `'asc'` (ascending) or `'desc'` (descending):

```
x = @ 5 9 2
x order 'desc'        // [9, 5, 2]
x orderIndex 'desc'   // [1, 0, 2] 
x rank 'desc'         // [1, 0, 2]
```

To order an iterable of objects/arrays on an inner property/index, an additional operand can be used after `'asc'` or `'desc'` that specifies the property/index:

```
y = @ 
| (# u 5 v 20)
| (# u 6 v 10)
| (# u 7 v 30)   // array of objects

// sort on property v, descending
y order 'desc' 'v'        // [{u: 7, v: 30}, {u: 5, v: 20}, {u: 6, v: 10}]
y orderIndex 'desc' 'v'   // [2, 0, 1]
y rank 'desc' 'v'         // [1, 2, 0]
```

> `'asc'` or `'desc'` should only be used to sort (finite) numbers or dates.
