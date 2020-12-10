## Get Property {#get-property}

---

#### `,`, `;` {#comma-getter}

Get an object/array property or a character from a string. These operators have [special behavior](#getter-precedence) including high precedence. `,` [autoquotes](#autoquoting) the property name whereas `;` does not:

```
circle = #
| radius 50
| center (@ 100 200)
| color 'red'

r = 'radius'

circle,radius     // 50
circle;r          // 50
circle,center,1   // 200   
circle,color,2    // 'd'
```

---

#### `:` {#colon-getter}

Get an object/array property or a character from a string:

```
circle = #
| radius 50
| center (@ 100 200)
| color 'red'

r = 'radius'

circle : 'radius'          // 50
circle : r                 // 50
circle : ('rad' + 'ius')   // 50
circle : 'center' : 1      // 200   
circle : 'color' : 2       // 'd'
```

---

#### `::` {#colon-proto-getter}

As [`:`](#colon-getter), but `::` gets a property from the object's prototype:

```
Array : 'prototype' : 'slice'   // function
Array :: 'slice'                // same function
```

---

#### `?:` {#conditional-get}

As [`:`](#colon-getter), but `?:` short-circuits and returns `undefined` if the object is `null` or `undefined`:

```
o = # u 5 v (# x 10 y 20)   // {u: 5, v: {x: 10, y: 20}}

o : 'q'          // undefined
o : 'q' : 'y'    // TypeError: Cannot read property 'y' of undefined
o : 'q' ?: 'y'   // undefined
```

---

#### `at` {#at}

`at` can get multiple properties or characters &mdash; the second operand of `at` must be an iterable.

`at` returns the same kind of object that it gets properties from. For example, when getting elements from an array, `at` returns an array.

```
// array-of-objects
data = @
| (# Name 'vw pickup'     Horsepower 52 Origin 'Europe')
| (# Name 'dodge rampage' Horsepower 84 Origin 'USA')
| (# Name 'ford ranger'   Horsepower 79 Origin 'USA')

data at (@ 2 0)
    // [
    //   {Name: 'ford ranger', Horsepower: 79, Origin: 'USA'}
    //   {Name: 'vw pickup', Horsepower: 52, Origin: 'Europe'}
    // ]

data,2 at (@ 'Name' 'Origin')
    // {Name: 'ford ranger', Origin: 'USA'}

data,0,Origin at (@ 1 3)   // 'uo'
```

The second operand of `at` can be any iterable. For example, a string or a [range](#ranges):

```
# u 5 v 6 w 7 at 'uw'        // {u: 5, w 7}
'abcdefghij' at (1 to 9 2)   // 'bdfhj'
```

---

#### `getter` {#getter}

Use a custom getter function for a property:

```
o = # celsius 10
o 'fahrenheit' getter [this,celsius * 1.8 + 32]

o,fahrenheit     // 50

o,celsius = 20   // 20 (set celsius property to 20)
o,fahrenheit     // 68
```

In general:

```
o 'x' getter f
```

is equivalent to:

```
Object ~defineProperty o 'x'
    #
    | get f
    | configurable true
    | enumerable true
```

See [`Object,defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) for details.

`getter` returns the modified object.