## Order {#order}

---

`order` takes an iterable and a 'comparison function' (see the [`sort` array method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)), and returns a new array containing the sorted elements of the iterable. The default comparison function is `[a - b]` which sorts (finite) numbers or dates in ascending order:

```
@ 5 9 2 order   // [2, 5, 9]

x = @ 
| (# u 5 v 20)
| (# u 6 v 10)
| (# u 7 v 30)   // array of objects

// sort on property v, descending
x order [b :v - (a :v)]   // [{u: 7, v: 30}, {u: 5, v: 20}, {u: 6, v: 10}]

// orderIndex
x orderIndex [b :v - (a :v)]   // [2, 0, 1]
```

As shown in the final example, `orderIndex` can be used to get the original indices of the sorted elements.