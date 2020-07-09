## Backticks {#backticks}

---

A backtick before an operator indicates that the first operand is an iterable. A backtick after an operator indicates that the second operand is an iterable:

```
x = @ 5 6 7
x `+ 10              // [15, 16, 17]       
10 +` x              // [15, 16, 17]
x map xi (xi + 10)   // [15, 16, 17] (without backtick)

y = @ 10 20 30
x `+` y                     // [15, 26, 37]  
x map xi i (xi + (y , i))   // [15, 26, 37] (without backticks)
```

Backticks can be used with the following operators:&ensp;`+`&ensp;`-`&ensp;`*`&ensp;`/`&ensp;`%`&ensp;`^`&ensp;`&&`&ensp;`||`&ensp;`??`&ensp;`<>`&ensp;`><`&ensp;`<`&ensp;`<=`&ensp;`>`&ensp;`>=`&ensp;`==`&ensp;`!=`.

> If an operator has any backticks, it must have exactly two operands &mdash; `x + y z` is valid code, but <code>x \`+\` y z</code> is not.

> If any backticks are used with `&&`, `||` or `??`, short-circuit evaluation is _not_ used &mdash; both operands are always evaluated.

Backticks can be used with any (synchronous) iterables; the result is always an array:

```
r = 5 to 7     // generator (5 6 7)
s = @@ 4 6 8   // Set {4, 6, 8}
r `==` s       // [false, true, false]
```

When both operands are iterables, the returned array is the length of the shortest iterable:

```
@ 5 6 7 `+` (@ 10 20)   // [15, 26]
```

A backtick really means "treat this operand as an iterable". For example, a string is an iterable, but we may want to treat it as a single value:

```
'ab'  +  'X'    // 'abX'
'ab' `+  'X'    // ['aX', 'bX']
'ab'  +` 'X'    // ['abX']
'ab' `+` 'X'    // ['aX']

'ab'  +  'XY'   // 'abXY'
'ab' `+  'XY'   // ['aXY', 'bXY']
'ab'  +` 'XY'   // ['abX', 'abY']
'ab' `+` 'XY'   // ['aX', 'bY']
```