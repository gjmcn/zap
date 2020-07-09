## Ranges {#ranges}

---

#### `to` {#to}

`to` returns a generator that represents a sequence of equally spaced numbers. `to` takes three operands: _start_, _end_ and _step_. _step_ is 1 by default:

```
5 to 7           // generator (5 6 7)
1.5 to 10 3      // generator (1.5 4.5 7.5)
1 to (-2) (-1)   // generator (1 0 -1 -2)

r = 5 to 7   // generator (5 6 7)
r ~next      // {value: 5, done: false}
r ~next      // {value: 6, done: false}
r ~next      // {value: 7, done: false}
r ~next      // {value: undefined, done: true}
```

Generators are iterables, so can be used with many operators &mdash; see e.g. [Loops](#loops), [Reduce](#reduce), [Filter](#filter), [Group](#group), [Order](#order), [Bin](#bin), [Backticks](#backticks) and [Destructuring](#destructure-iterable). Some examples:

```
5 to 7 each a (print a)   // prints 5 6 7
5 to 7 array              // [5, 6, 7]
5 to 7 mean               // 6
5 to 7 `+ 10              // [15, 16, 17]
u v w @= 5 to 7           // u is 5, v is 6, w is 7
'abcdefg' at (0 to 6 2)   // 'aceg'
```

---

#### `linSpace` {#lin-space}

As [`to`](#to), but the third operand of `linSpace` (which should be a non-negative integer) is the number of steps:

```
2 8 linSpace 4      // generator (2 4 6 8)
3 6 linSpace 3      // generator (3 4.5 6)
2 (-7) linSpace 4   // generator (2 -1 -4 -7) 
```

> Due to floating-point arithmetic, the final element of a range created with `linSpace` may not be identical to the _end_ operand.
