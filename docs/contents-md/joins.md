## Joins {#joins}

---

`innerJoin`, `leftJoin`, `rightJoin`, `outerJoin` {#inner-join}

Database-style joins. The first two operands are iterables; the elements of each iterable should be objects or arrays. The third operand specifies the join criteria which can be a:

* function: called on each pair of elements of the iterables; if the function returns a truthy value, the pair of elements is included in the join.

* non-string iterable: the inner property names/indices to join on &mdash; the first element corresponds to the first iterable, the second element to the second iterable.

* string/number: the inner property name/index to join on &mdash; use this when the name/index is the same for both iterables.

The optional fourth operand is the maximum number of results to yield.

Join operators return a generator that yields arrays; each array contains a pair of elements from the iterables. The operators differ on how they treat unmatched elements:

* `innerJoin`: unmatched elements are not included.

* `leftJoin`: unmatched elements of the first iterable are included.

* `rightJoin`: unmatched elements of the second iterable are included.

* `outerJoin`: unmatched elements of both iterables are included.

```
p = @ 
| (# u 1 v 4)
| (# u 2 v 5)
| (# u 3 v 6)        // array-of-objects

q = @
| (# u 0 w 7 x 10)
| (# u 3 w 8 x 20)
| (# u 1 w 9 x 30)   // array-of-objects

r = @
| (# x 10 y 11)
| (# x 30 y 31)      // array-of-objects

// these are equivalent
p outerJoin q [a,u == b,u]   // generator
p outerJoin q (@ 'u' 'u')    // generator
p outerJoin q 'u'            // generator

p outerJoin q 'u' array
  // [
  //   [{u: 1, v: 4}, {u: 1, w: 9, x: 30}],
  //   [{u: 3, v: 6}, {u: 3, w: 8, x: 20}],
  //   [{u: 2, v: 5}, null               ],
  //   [null,         {u: 0, w: 7, x: 10}]
  // ]

// chained join - this is easier with crush (see below)
p outerJoin q 'u' outerJoin r [a,1 ?: 'x' == b,x] array
  // [
  //   [{u: 1, v: 4}, {u: 1, w: 9, x: 30}, {x: 30, y: 31}], 
  //   [null,         {u: 0, w: 7, x: 10}, {x: 10, y: 11}], 
  //   [{u: 3, v: 6}, {u: 3, w: 8, x: 20}, null          ], 
  //   [{u: 2, v: 5}, null,                null          ]
  // ]
```

Unless speed or memory usage is critical, we typically [`crush`](#crush) the generator returned by a join operator &mdash; the resulting array-of-objects is easier to work with.

> In the "chained join" example above, the depth of nesting does not increase &mdash; elements have the form `[{...}, {...}, {...}]`, not `[[{...}, {...}], {...}]`. When chaining joins, the intermediate join must be the returned generator or crushed to get this behavior.

---

#### `crush` {#crush}

Flatten a join into an array-of-objects. The first operand is the join; additional operands are objects that specify which properties to keep and property name prefixes:

```
p = @ 
| (# u 1 v 4)
| (# u 2 v 5)
| (# u 3 v 6)        // array-of-objects

q = @
| (# u 0 w 7 x 10)
| (# u 3 w 8 x 20)
| (# u 1 w 9 x 30)   // array-of-objects

r = @
| (# x 10 y 11)
| (# x 30 y 31)      // array-of-objects

p outerJoin q 'u' crush
  // [
  //   {u: 1, v: 4, w: 9, x: 30},
  //   {u: 3, v: 6, w: 8, x: 20},
  //   {u: 2, v: 5             },
  //   {u: 0,       w: 7, x: 10}
  // ]                 

p outerJoin q 'u'
| crush (# prefix '_p') (# prefix '_q' keep (@ 'u' 'x'))
  // [
  //   {p_u: 1, p_v: 4, q_u: 1, q_x: 30},
  //   {p_u: 3, p_v: 6, q_u: 3, q_x: 20},
  //   {p_u: 2, p_v: 5                 },
  //   {                q_u: 0, q_x: 10}
  // ]

// chained join
p outerJoin q 'u' crush outerJoin r 'x' crush
  // [
  //   {u: 1, v: 4, w: 9, x: 30, y: 31}, 
  //   {u: 0,       w: 7, x: 10, y: 11}, 
  //   {u: 3, v: 6, w: 8, x: 20       }, 
  //   {u: 2, v: 5                    }
  // ]
```

Notes:

* Any number of additional operands can be used with `crush` &mdash; since joins can be chained, each 'row' of results can have more than two objects.

* If prefixes are not used and objects in the same row share a property name, the result will use the value from the last object in the row that has the property.

* Use a falsy value to skip an optional operand, e.g. `someJoin crush null (# prefix '_')`.

* Do not use the new prefixes when listing property names with `keep`.

* If `keep` is not used, all enumerable own properties of the corresponding objects are included in the result.

* `crush` can be applied to any iterable-of-iterables. Elements of the inner iterables that are (non-null) objects are used to construct the result; other elements are ignored.

---

#### `crossJoin`{#cross-join}

All pairs of elements from two iterables. `crossJoin` is equivalent to `innerJoin` with a callback function that always returns `true`:

* `x crossJoin y` is equivalent to `x innerJoin y [true]`

* `x crossJoin y 5` is equivalent to `x innerJoin y [true] 5`

```
p = @ (@ 1 2) (@ 3 4)   // array-of-arrays
q = @ (@ 5 6) (@ 7 8)   // array-of-arrays

p crossJoin q array
  // [
  //   [[1, 2], [5, 6]], 
  //   [[1, 2], [7, 8]], 
  //   [[3, 4], [5, 6]], 
  //   [[3, 4], [7, 8]] 
  // ]

p crossJoin q crush (# prefix 'p_') (# prefix 'q_')
  // [
  //   {p_0: 1, p_1: 2, q_0: 5, q_1: 6}, 
  //   {p_0: 1, p_1: 2, q_0: 7, q_1: 8}, 
  //   {p_0: 3, p_1: 4, q_0: 5, q_1: 6}, 
  //   {p_0: 3, p_1: 4, q_0: 7, q_1: 8} 
  // ]
```

---

#### `semiJoin`, `antiJoin`{#semi-join}

These operators take the same operands as [`innerJoin`](#inner-join).

`semiJoin` yields elements of the first iterable that match an element of the second iterable. `antiJoin` yields elements of the first iterable that _do not_ match any elements of the second iterable.

While `semiJoin` and `antiJoin` only yield elements from the first iterable, they behave like other join operators for consistency: they return a generator that yields arrays (each array containing a single object/array in this case):

```
p = @ 
| (# u 1 v 4)
| (# u 2 v 5)
| (# u 3 v 6)        // array-of-objects

q = @
| (# u 0 w 7 x 10)
| (# u 3 w 8 x 20)
| (# u 1 w 9 x 30)   // array-of-objects

p semiJoin q 'u' array   // [[{u: 1, v: 4}], [{u: 3, v: 6}]]
p semiJoin q 'u' crush   // [{u: 1, v: 4}, {u: 3, v: 6}]
p antiJoin q 'u' crush   // [{u: 2, v: 5}]
```