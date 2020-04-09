## Elementwise

---

Elementwise operators take a single operand. If the operand is a non-string iterable, the operator acts on each element independently and returns the results as an array. Otherwise, the operator acts on the operand directly and returns the result:

```
4 $sqrt;        // 2
@ 9 16 $sqrt;   // [3, 4]

'ab' $toUpperCase;          // 'AB'
@ 'cd' 'ef' $toUpperCase;   // ['CD', 'EF']
```

#### Math {#ew-math}

Elementwise math operators use the corresponding methods of the [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) object. The elementwise math operators are: 

`$abs` `$acos` `$acosh` `$asin` `$asinh` `$atan` `$atanh` `$cbrt` `$ceil` `$clz32` `$cos` `$cosh` `$exp` `$expm1` `$floor` `$fround` `$log` `$log10` `$log1p` `$log2` `$round` `$sign` `$sin` `$sinh` `$sqrt` `$tan` `$tanh` `$trunc`

#### Other {#ew-other}

The other elementwise operators are:

| Operator        | Description |
|-----------------|-------------|
| `$boolean`      | convert to boolean |
| `$date`         | convert to date |
| `$isFinite`     | is finite? (always `false` for non-number) |
| `$isInteger`    | is integer? (always `false` for non-number) |
| `$isNaN`        | is `NaN`? (always `false` for non-number) |
| `$neg`          | unary minus |
| `$not`          | logical not |
| `$number`       | convert to number |
| `$string`       | convert to string |
| `$toLowerCase`  | convert to lowercase string |
| `$toUpperCase`  | convert to uppercase string |
| `$trim`         | remove whitespace from both ends of string |
| `$trimEnd`      | remove whitespace from end of string |
| `$trimStart`    | remove whitespace from start of string {.table .table-sm .w500} |

> `$toLowerCase`, `$toUpperCase`, `$trim`, `$trimEnd` and `$trimStart` convert values to strings, but throw an error if a value is `null` or `undefined`.