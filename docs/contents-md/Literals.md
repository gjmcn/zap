## Literals

---

#### Basics 

```
5;           // 5 (number)
5.6;         // 5.6 (number)
5e-2;        // 0.05 (number)
'abc';       // 'abc' (string)
"abc";       // 'abc' (string)
"a
bc";         // 'a\nbc' ("..." strings can be multiline)
&/abc/;      // /abc/ (regular expression)
false;       // false (boolean)
null;        // null
undefined;   // undefined
```

There is no string interpolation in Zap; just use `+` and optionally, omit spaces:

```
x = 5;
+ 'double 'x' is '(2 * x);  // 'double 5 is 10'
```

#### Arrays and Sets

Use the `@` operator for an array, and `@@` for a set:

```
@;        // empty array
@ 5 6;    // [5, 6]

@@;       // empty set
@@ 5 6;   // Set {5, 6}
```

`@` and `@@` interpret each operand as an element. Use [spread syntax](?Spread) to extract elements from iterables.

```
@@ 'ab';      // Set {'ab'}
@@ ...'ab';   // Set {'a', 'b'}

@@ 'ab' 'cd';         // Set {'ab', 'cd'}
@@ ...'ab' ...'cd';   // Set {'a', 'b', 'c', 'd'}
```

#### Objects and Maps {#objects-and-maps}

Use the `#` operator to create an object, and `##` for a map:

```
#;             // empty object
# u 5 v 6;     // {u: 5, v: 6}

##;            // empty map
## u 5 v 6;    // Map {'u' => 5, 'v' => 6}
```

As with any Zap code, use whitespace as required for readability:

```
# width 200
  height 100
  color 'red';   // {width: 200, height: 100, color: 'red'} 
```

`#` and `##` use the [identifier-name rule](?Evaluation#identifier-name-rule), which is why the property names in the above examples need not be quoted. Use an identifier as part of a larger expression (wrapping in parentheses suffices) to avoid this special behavior:

```
w = 'width';
x = @ 'height' 'col';

# (w) 200
  (x :0) 100
  (x :1 + 'or') 'red';   // {width: 200, height: 100, color: 'red'} 
```