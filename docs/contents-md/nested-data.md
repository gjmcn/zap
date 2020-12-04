## Nested Data {#nested-data}
<br>

> See [Reduce](#reduce), [Filter](#filter), [Group](#group), [Order](#order) and [Bin](#bin) for other operators that can act directly on nested data.

---

#### `pick` {#pick}
`pick` gets a property from each element of an iterable. The first operand of `pick` is the iterable; the second operand is the property name/index. `pick` returns an array:

```
// pick from an array-of-arrays
@ 
| (@ 4 5 6)
| (@ 7 8 9)
| pick 1   // [5, 8]

// pick from a set-of-objects
@@
| (# u 4)
| (# u 5 v 6)
| (# u 7)
| pick 'v'   // [undefined, 6, undefined]

// pick from an array-of-strings
@ 'abc' 'def' pick 0   // ['a', 'd']
```

---

#### `mapAt` {#map-at}

`mapAt` applies [`at`](#at) to each element of an iterable. The first operand of `mapAt` is the iterable to extract values from; the second operand is an iterable of names/indices. `mapAt` returns an array:

```
// apply mapAt to an array-of-arrays
@
| (@ 4 5 6)
| (@ 7 8 9)
| mapAt (@ 2 0)
  // [
  //   [6, 4],
  //   [9, 7]
  // ]

// apply mapAt to a set-of-objects
@@
| (# u 4 v 5)
| (# u 6 v 7 w 8)
| (# u 9 w 10)
| mapAt (@ 'u' 'w')
  // [
  //   {u: 4, w: undefined},
  //   {u: 6, w: 8},
  //   {u: 9, w: 10}
  // ]

// apply mapAt to an array-of-strings
@ 'abc' 'def' mapAt (@ 0 2)   // ['ac', 'df']
```

---

#### `transpose` {#transpose}

`transpose` takes an iterable-of-iterables (typically an array-of-arrays) and returns an array-of-arrays:

```
x = @ 
| (@ 5 6 7)
| (@ 10 20 30)   // [[5, 6, 7], [10, 20, 30]] 

x transpose      // [[5, 10], [6, 20], [7, 30]] 
```

The result of `transpose` can have empty elements and inner arrays of different lengths. Empty array elements in the original data have value `undefined` in the transpose:

```
@ 
| (@ 1 2)
| (new Array 2)  // [empty, empty]
| (@ 3 4 5)
| (@ 6)
| transpose
  // [
  //   [1, undefined, 3, 6],
  //   [2, undefined, 4],
  //   [empty, empty, 5]
  // ] 
```

---

#### `arrObj` {#array-of-objects}

`arrObj` takes an object-of-iterables (typically an object-of-arrays) and returns an array-of-objects:

```
// object-of-arrays
data = #
| Name       (@ 'vw pickup' 'dodge rampage' 'ford ranger')
| Horsepower (@ 52 84 79)
| Origin     (@ 'Europe' 'USA' 'USA')

data arrObj
  // [
  //   {Name: 'vw pickup', Horsepower: 52, Origin: 'Europe'}
  //   {Name: 'dodge rampage', Horsepower: 84, Origin: 'USA'}
  //   {Name: 'ford ranger', Horsepower: 79, Origin: 'USA'}
  // ]
  
data arrObj (@ 'Horsepower' 'Origin')
  // [
  //   {Horsepower: 52, Origin: 'Europe'}
  //   {Horsepower: 84, Origin: 'USA'}
  //   {Horsepower: 79, Origin: 'USA'}
  // ]
```

As shown in the final example, `arrObj` can take a second operand (an iterable) that specifies the properties to include in the result. When this argument is omitted (or falsy), all properties are included.

The iterables in the original data can have different lengths:

```
#
| u (@ 5 6 7)
| v (@ 8 9)
| arrObj   // [
           //   {u: 5, v: 8},
           //   {u: 6, v: 9},
           //   {u: 7}
           // ]
```

Empty array elements in the original data will result in properties with value `undefined` in the result.

---

#### `objArr` {#object-of-arrays}

`objArr` takes an iterable-of-objects (typically an array-of-objects) and returns an object-of-arrays:

```
// array-of-objects
data = @
| (# Name 'vw pickup'     Horsepower 52 Origin 'Europe')
| (# Name 'dodge rampage' Horsepower 84 Origin 'USA')
| (# Name 'ford ranger'   Horsepower 79 Origin 'USA')

data objArr
  // {
  //   Name: ['vw pickup', 'dodge rampage', 'ford ranger'],
  //   Horsepower: [52, 84, 79],
  //   Origin: ['Europe', 'USA', 'USA']
  // }

data objArr (@ 'Horsepower' 'Origin')
  // {
  //   Horsepower: [52, 84, 79],
  //   Origin: ['Europe', 'USA', 'USA']
  // }
```

As shown in the final example, `objArr` can take a second operand (an iterable) that specifies the properties to include in the result. When this argument is omitted (or falsy), the returned object has an array for each unique property name in the original data.

When a second operand is used, the arrays in the result have no empty elements and have the same length as the orginal data. When a second operand is not used, the arrays of the result can have empty elements and different lengths:

```
data = @
| (# u 1 v 2)
| (# u 3 v 4 w 5)
| (# u 6)

data objArr (@ 'v' 'w')   // {
                          //   v: [2, 4, undefined],
                          //   w : [undefined, 5, undefined]
                          // }

data objArr   // {
              //   u: [1, 3, 6],
              //   v: [2, 4],
              //   w: [empty, 5]
              // }
```