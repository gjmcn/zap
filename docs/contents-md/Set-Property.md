## Set Property

---

#### Assignment

The assignment operator `=` and the update-assignment operators `+=`, `-=`, `*=`, `/=`, `%=`, `^=` can be used to set an object/array property:

```
circle = # radius 50 center (@ 100 200)

circle :color = 'red'    // 'red'
circle :radius = 60      // 60
circle :center :1 += 5   // 205

circle   // {radius: 60, center: [100, 205], color: 'red'}
```

---

#### `chg` {#chg}

`chg` takes an object/array, a property name and a new value for the property. `chg` sets the property and returns the modified object:

```
o = # u 5 v 6
o 
| chg 'u' 10
| chg 'w' 20   // {u: 10, v: 6, w: 20} 
```

> Setting a property with `chg` is equivalent to using assignment; it is not equivalent to using [`Object :defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

---

#### `attach` {#attach}

`attach` sets properties using variables of the same name:

```
width = 100
height = 200
color = 'red'

rect = # attach width      // {width: 100}
rect attach height color   // {width: 100, height: 200, color: 'red'}
```

---

#### `assign` {#copy-properties}

The `assign` operator copies properties from its second, third, fourth, ... operands to its first operand:

```
o = # u 5 v 6
p = # v 7 w 8

# assign o     // {u: 5, v: 6} (shallow copy o)
# assign o p   // {u: 5, v: 7, w: 8}
o assign p     // {u: 5, v: 7, w: 8}
```

`assign` is shorthand for calling [`Object :assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

---

#### `setter` {#setter}

Use a custom setter function for a property:

```
o = # celsius 10

o 'fahrenheit' getter [this :celsius * 1.8 + 32]
o 'fahrenheit' setter [this :celsius = a - 32 / 1.8]

o :fahrenheit   // 50

o :celsius = 20
o :fahrenheit   // 68

o :fahrenheit = 86
o :celsius      // 30
```

In general:

```
o 'x' setter f
```

is equivalent to:

```
Object ~defineProperty o 'x'
    #
    | set f
    | configurable true
    | enumerable true
```

See [`Object :defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) for details.

`setter` returns the modified object.