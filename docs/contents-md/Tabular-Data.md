## Tabular Data

---

The operators in this section convert between common representations of tabular data. In all cases, we can think of the elements of the original 'table' as rows, and the elements of the returned table as columns (or vice versa).

> Empty array elements in the original table become normal elements/properties (with value `undefined`) in the returned table.

---

#### `transpose` {#transpose}

`transpose` takes an iterable-of-iterables (typically an array-of-arrays) and returns an array-of-arrays:

```
x = @ 
| (@ 5 6 7)
| (@ 10 20 30)   // [[5, 6, 7], [10, 20, 30]] 

x transpose      // [[5, 10], [6, 20], [7, 30]] 
```

The result of `transpose` can have empty elements and inner arrays of different lengths:

```
@ 
| (@ 1 2) 
| (@ 3 4 5)
| (@ 6)
| transpose   // [[1, 3, 6], [2 4], [empty, 5]] 
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

As shown in the final example, `arrObj` can take a second operand (an iterable) that specifies the properties to include in the returned table. When this argument is omitted (or falsy), all properties are included.

The iterables in the original table can have different lengths:

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

As shown in the final example, `objArr` can take a second operand (an iterable) that specifies the properties to include in the result. When this argument is omitted (or falsy), the returned object has an array for each unique property name in the original table.

When a second operand is used, the arrays in the result have no empty elements and have the same length as the orginal table. When a second operand is not used, the arrays of the result can have empty elements and different lengths:

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