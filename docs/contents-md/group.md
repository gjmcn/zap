## Group {#group}

---

`group` takes an iterable and a callback function (default `[a]`). The callback is applied to each element of the iterable (it is passed the element, index and iterable); the results are used to group the elements. When grouping an iterable of objects/arrays, an inner property/index can be used instead of a callback function &mdash; for example, `'v'` can be used instead of the callback `[a,v]`.

`group` returns a map with arrays for values:

```
x = @ 
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)   // array-of-objects
  
x group 'u'   // Map {
              //   5 => [{u: 5, v: 10}, {u: 5, v: 30}]
              //   6 => [{u: 6, v: 20}]
              // }

// second callback
x group 'u' [a mean 'v']   // Map {5 => 20, 6 => 20}
```

As shown in the example, `group` can take a second callback. This is applied to each group (it is passed a value and key of the map at each step, as well as the index) and the results are used as the values of the returned map.

`groupCount` gets the size of each group: 

```
@ 5 2 5 5 7 2 groupCount   // Map {5 => 3, 2 => 2, 7 => 1}

x = @ 
| (# u 5 v 10)
| (# u 6 v 20)
| (# u 5 v 30)   // array-of-objects

x groupCount 'u'           // Map {5 => 2, 6 => 1}
x groupCount 'u' [a > 1]   // Map {5 => true, 6 => false}
```