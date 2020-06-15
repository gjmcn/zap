## Literals

---

#### Basics 

```
5           // 5 (number)
5.6         // 5.6 (number)
5e-2        // 0.05 (number)
'abc'       // 'abc' (string)
"abc"       // 'abc' (string)
"a
bc"         // 'a\nbc' ("..." strings can be multiline)
&/abc/      // /abc/ (regular expression)
false       // false (boolean)
null        // null
undefined   // undefined
```

---

#### Objects and Maps {#objects-and-maps}

Use the `#` operator for an object, and `##` for a map:

```
#             // empty object
# u 5 v 6     // {u: 5, v: 6}

##            // empty map
## u 5 v 6    // Map {'u' => 5, 'v' => 6}
```

`#` and `##` use the [identifier-name rule](?Syntax#identifier-name-rule), which is why the property names in the above examples need not be quoted.

---

#### Arrays {#arrays}

Use the `@` operator for an array:

```
@        // empty array
@ 5 6    // [5, 6]
```

There is also an `array` operator that takes any number of iterables and returns a new array containing the elements of all of the iterables:

```
x = @ 5 6 7   // [5, 6, 7]
y = @@ 8 9    // Set {8, 9} (see below)
z = 'abc'     // 'abc'

array         // []
x array       // [5, 6, 7] (shallow copy of x)  
y array       // [8, 9]  
z array       // ['a', 'b', 'c']

x y z array   // [5, 6, 7, 8, 9, 'a', 'b', 'c']
```

---

#### Sets {#sets}

 Use the `@@` operator for a set:

```
@@       // empty set
@@ 5 6   // Set {5, 6}
```

Note that `@@` interprets each operand as an element, whereas the `Set` constructor extracts elements from an iterable:

```
@@ 'ab'        // Set {'ab'}
new Set 'ab'   // Set {'a', 'b'}
```