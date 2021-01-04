## Literals {#literals}

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

`#` and `##` use [autoquoting](#autoquoting), which is why the property names in the above examples need not be quoted.

---

#### Arrays {#arrays}

Use the `@` operator for an array:

```
@       // empty array
@ 5 6   // [5, 6]
```

The `array` operator is like `@`, except that if an operand is a non-string iterable, `array` uses the elements of the iterable rather than the iterable itself:

```
i = 2         // 2
s = '34'      // '34'
x = @ 5 6 7   // [5, 6, 7] 
y = @@ 8 9    // Set {8, 9} (see below)

array     // empty array
i array   // [2]   
s array   // ['34']  
x array   // [5, 6, 7]
y array   // [8, 9]

i s x y @       // [2, '34', [5, 6, 7], Set {8, 9}]
i s x y array   // [2, '34', 5, 6, 7, 8, 9]

// array does not 'flatten' iterables recursively
z = @ 2 (@ 3 4)   // [2, [3, 4]]
1 z array         // [1, 2, [3, 4]] 
```

`empties`, `zeros` and `ones` create an array of a given length. `zeros` and `ones` set each entry to `0` or `1`. Include additional operands to create nested arrays:

```
3 empties    // [empty x 3]
2 3 zeros    // [[0, 0, 0], [0, 0, 0]]
2 3 2 ones   // [
             //   [[1, 1], [1, 1], [1, 1]],
             //   [[1, 1], [1, 1], [1, 1]]]
             // ]
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