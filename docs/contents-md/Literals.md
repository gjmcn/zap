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

#### Arrays and Sets {#arrays-and-sets}

Use the `@` operator for an array, and `@@` for a set:

```
@        // empty array
@ 5 6    // [5, 6]

@@       // empty set
@@ 5 6   // Set {5, 6}
```

Note that `@@` interprets each operand as an element, whereas the `Set` constructor extracts elements from an iterable:

```
@@ 'ab'        // Set {'ab'}
new Set 'ab'   // Set {'a', 'b'}
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